"""Questions router."""
import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Question
from schemas import QuestionResponse

router = APIRouter()


@router.get("/{test_id}", response_model=List[QuestionResponse])
def get_questions(test_id: int, db: Session = Depends(get_db)):
    """Return all questions for a test (without correct answers)."""
    questions = (
        db.query(Question)
        .filter(Question.test_id == test_id)
        .order_by(Question.order_num)
        .all()
    )
    if not questions:
        raise HTTPException(status_code=404, detail="No questions found for this test")

    result = []
    for q in questions:
        result.append(QuestionResponse(
            id=q.id,
            test_id=q.test_id,
            text=q.text,
            options=json.loads(q.options),
            topic=q.topic,
            explanation=None,  # hide until reviewed
            order_num=q.order_num,
            correct_answer=None  # hidden during test
        ))
    return result
