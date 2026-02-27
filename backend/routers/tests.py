"""Mock tests router."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import MockTest, Question
from schemas import MockTestResponse

router = APIRouter()


@router.get("/{subject_id}", response_model=List[MockTestResponse])
def get_tests(subject_id: int, db: Session = Depends(get_db)):
    """Return all mock tests for a subject, with question count."""
    tests = db.query(MockTest).filter(MockTest.subject_id == subject_id).all()
    # Do NOT raise 404 — return empty list so frontend handles it gracefully

    result = []
    for test in tests:
        q_count = db.query(Question).filter(Question.test_id == test.id).count()
        # Build dict manually to inject computed question_count (avoids Pydantic immutability)
        result.append(MockTestResponse(
            id=test.id,
            name=test.name,
            description=test.description,
            subject_id=test.subject_id,
            difficulty=test.difficulty,
            duration_minutes=test.duration_minutes,
            created_at=test.created_at,
            question_count=q_count,
        ))
    return result
