"""Subjects router."""
from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Subject
from schemas import SubjectResponse

router = APIRouter()


@router.get("/{domain_id}", response_model=List[SubjectResponse])
def get_subjects(domain_id: int, db: Session = Depends(get_db)):
    """Return all subjects for a given domain."""
    subjects = db.query(Subject).filter(Subject.domain_id == domain_id).order_by(Subject.name).all()
    return subjects  # Return empty list instead of 404
