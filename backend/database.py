"""
Database configuration module.
Handles SQLite engine creation and session management.
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}  # Required for SQLite
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependency injection for database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize all database tables."""
    from models import (  # noqa: F401 - import to register models
        Domain, Subject, MockTest, Question,
        StudentAttempt, TopicPerformance, RevisionPlan
    )
    Base.metadata.create_all(bind=engine)
