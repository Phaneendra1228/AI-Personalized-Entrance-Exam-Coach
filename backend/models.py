"""
SQLAlchemy ORM models for the adaptive learning platform.
"""
import json
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Float, DateTime,
    ForeignKey, Enum, Boolean
)
from sqlalchemy.orm import relationship
from database import Base
import enum


class DifficultyEnum(str, enum.Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"


class Domain(Base):
    __tablename__ = "domains"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(10), nullable=True)  # emoji icon
    created_at = Column(DateTime, default=datetime.utcnow)

    subjects = relationship("Subject", back_populates="domain", cascade="all, delete-orphan")


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    domain_id = Column(Integer, ForeignKey("domains.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    domain = relationship("Domain", back_populates="subjects")
    mock_tests = relationship("MockTest", back_populates="subject", cascade="all, delete-orphan")


class MockTest(Base):
    __tablename__ = "mock_tests"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    difficulty = Column(Enum(DifficultyEnum), nullable=False)
    duration_minutes = Column(Integer, default=30)
    created_at = Column(DateTime, default=datetime.utcnow)

    subject = relationship("Subject", back_populates="mock_tests")
    questions = relationship("Question", back_populates="mock_test", cascade="all, delete-orphan")
    attempts = relationship("StudentAttempt", back_populates="mock_test")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("mock_tests.id"), nullable=False)
    text = Column(Text, nullable=False)
    options = Column(Text, nullable=False)  # JSON array of 4 strings
    correct_answer = Column(Integer, nullable=False)  # 0-indexed
    topic = Column(String(200), nullable=False)
    explanation = Column(Text, nullable=True)
    order_num = Column(Integer, default=0)

    mock_test = relationship("MockTest", back_populates="questions")

    def get_options(self):
        return json.loads(self.options)

    def set_options(self, options_list):
        self.options = json.dumps(options_list)


class StudentAttempt(Base):
    __tablename__ = "student_attempts"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(100), nullable=False, index=True)
    test_id = Column(Integer, ForeignKey("mock_tests.id"), nullable=False)
    answers = Column(Text, nullable=False)  # JSON: {question_id: selected_option}
    score = Column(Integer, nullable=False)
    total = Column(Integer, nullable=False)
    time_taken_seconds = Column(Integer, nullable=True)
    completed = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    mock_test = relationship("MockTest", back_populates="attempts")

    def get_answers(self):
        return json.loads(self.answers)

    def set_answers(self, answers_dict):
        self.answers = json.dumps(answers_dict)

    @property
    def percentage(self):
        if self.total == 0:
            return 0.0
        return round((self.score / self.total) * 100, 2)


class TopicPerformance(Base):
    __tablename__ = "topic_performance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(100), nullable=False, index=True)
    topic = Column(String(200), nullable=False)
    correct = Column(Integer, default=0)
    total_attempted = Column(Integer, default=0)
    weakness_score = Column(Float, default=0.0)  # 0.0=strong, 1.0=very weak
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    @property
    def accuracy(self):
        if self.total_attempted == 0:
            return 0.0
        return round((self.correct / self.total_attempted) * 100, 2)


class RevisionPlan(Base):
    __tablename__ = "revision_plans"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(100), nullable=False, index=True)
    plan_data = Column(Text, nullable=False)  # JSON: list of DayPlan objects
    generated_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
