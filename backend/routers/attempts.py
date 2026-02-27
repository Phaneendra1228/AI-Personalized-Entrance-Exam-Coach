"""
Attempt submission router.
Handles scoring, topic performance updates, and persistence.
"""
import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict
from database import get_db
from models import StudentAttempt, Question, TopicPerformance
from schemas import SubmitAttemptRequest, AttemptResult
from datetime import datetime

router = APIRouter()


@router.post("", response_model=AttemptResult)
def submit_attempt(payload: SubmitAttemptRequest, db: Session = Depends(get_db)):
    """
    Submit student answers for a mock test.
    Scores the attempt, updates topic performance, and persists everything.
    """
    # Fetch all questions for the test
    questions = db.query(Question).filter(Question.test_id == payload.test_id).all()
    if not questions:
        raise HTTPException(status_code=404, detail="Test not found")

    # Score the attempt
    score = 0
    correct_ids = []
    incorrect_ids = []
    topic_breakdown: Dict[str, Dict[str, int]] = {}

    for q in questions:
        submitted = payload.answers.get(str(q.id))
        is_correct = submitted is not None and submitted == q.correct_answer

        if is_correct:
            score += 1
            correct_ids.append(q.id)
        else:
            incorrect_ids.append(q.id)

        # Track per-topic breakdown
        if q.topic not in topic_breakdown:
            topic_breakdown[q.topic] = {"correct": 0, "total": 0}
        topic_breakdown[q.topic]["total"] += 1
        if is_correct:
            topic_breakdown[q.topic]["correct"] += 1

    total = len(questions)

    # Persist attempt
    attempt = StudentAttempt(
        student_id=payload.student_id,
        test_id=payload.test_id,
        score=score,
        total=total,
        time_taken_seconds=payload.time_taken_seconds,
        completed=True,
    )
    attempt.set_answers(payload.answers)
    db.add(attempt)

    # Update TopicPerformance
    for topic, stats in topic_breakdown.items():
        tp = db.query(TopicPerformance).filter(
            TopicPerformance.student_id == payload.student_id,
            TopicPerformance.topic == topic
        ).first()

        if not tp:
            tp = TopicPerformance(
                student_id=payload.student_id,
                topic=topic,
                correct=0,
                total_attempted=0
            )
            db.add(tp)

        tp.correct += stats["correct"]
        tp.total_attempted += stats["total"]
        # weakness_score: 0.0 = perfect, 1.0 = all wrong
        if tp.total_attempted > 0:
            tp.weakness_score = round(
                1.0 - (tp.correct / tp.total_attempted), 4
            )
        tp.last_updated = datetime.utcnow()

    db.commit()
    db.refresh(attempt)

    return AttemptResult(
        attempt_id=attempt.id,
        score=score,
        total=total,
        percentage=round((score / total) * 100, 2) if total > 0 else 0.0,
        correct_questions=correct_ids,
        incorrect_questions=incorrect_ids,
        topic_breakdown=topic_breakdown,
    )
