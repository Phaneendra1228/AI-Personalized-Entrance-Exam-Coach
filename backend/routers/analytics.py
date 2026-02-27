"""
Analytics router.
Returns student performance summary, weakness report.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import StudentAttempt, TopicPerformance, MockTest, Subject, Domain
from schemas import AnalyticsResponse, TopicPerformanceResponse

router = APIRouter()


@router.get("/{student_id}", response_model=AnalyticsResponse)
def get_analytics(student_id: str, db: Session = Depends(get_db)):
    """Comprehensive analytics for a student."""
    attempts = (
        db.query(StudentAttempt)
        .filter(StudentAttempt.student_id == student_id)
        .order_by(StudentAttempt.created_at.desc())
        .all()
    )

    topic_performances = (
        db.query(TopicPerformance)
        .filter(TopicPerformance.student_id == student_id)
        .order_by(TopicPerformance.weakness_score.desc())
        .all()
    )

    total_correct = sum(a.score for a in attempts)
    total_questions = sum(a.total for a in attempts)
    overall_accuracy = round((total_correct / total_questions) * 100, 2) if total_questions > 0 else 0.0

    # Build recent attempts with context
    recent = []
    for a in attempts[:10]:
        test = db.query(MockTest).filter(MockTest.id == a.test_id).first()
        test_name = test.name if test else "Unknown"
        recent.append({
            "attempt_id": a.id,
            "test_id": a.test_id,
            "test_name": test_name,
            "score": a.score,
            "total": a.total,
            "percentage": a.percentage,
            "created_at": a.created_at.isoformat(),
        })

    tp_responses = [
        TopicPerformanceResponse(
            topic=tp.topic,
            correct=tp.correct,
            total_attempted=tp.total_attempted,
            accuracy=tp.accuracy,
            weakness_score=tp.weakness_score,
        )
        for tp in topic_performances
    ]

    weakest = [tp.topic for tp in topic_performances if tp.weakness_score > 0.5][:5]
    strongest = [tp.topic for tp in reversed(topic_performances) if tp.weakness_score < 0.25][:5]

    return AnalyticsResponse(
        student_id=student_id,
        total_tests_taken=len(attempts),
        overall_accuracy=overall_accuracy,
        topic_performance=tp_responses,
        weakest_topics=weakest,
        strongest_topics=strongest,
        recent_attempts=recent,
    )
