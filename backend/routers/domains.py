"""Domains router."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Domain
from schemas import DomainResponse

router = APIRouter()


@router.get("", response_model=List[DomainResponse])
def get_domains(db: Session = Depends(get_db)):
    """Return all learning domains."""
    return db.query(Domain).order_by(Domain.name).all()


@router.get("/{domain_id}", response_model=DomainResponse)
def get_domain(domain_id: int, db: Session = Depends(get_db)):
    from fastapi import HTTPException
    domain = db.query(Domain).filter(Domain.id == domain_id).first()
    if not domain:
        raise HTTPException(status_code=404, detail="Domain not found")
    return domain
