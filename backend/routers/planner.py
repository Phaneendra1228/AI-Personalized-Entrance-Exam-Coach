"""Planner router."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from services.planner_service import generate_revision_plan
from schemas import RevisionPlanResponse

router = APIRouter()


@router.post("/{student_id}", response_model=RevisionPlanResponse)
def generate_plan(student_id: str, db: Session = Depends(get_db)):
    """Generate a personalized 7-day revision plan for a student."""
    return generate_revision_plan(student_id, db)
