"""
Pydantic schemas for request/response validation.
"""
from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class DifficultyEnum(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"


# ─── Domain ──────────────────────────────────────────────
class DomainBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None


class DomainResponse(DomainBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime


# ─── Subject ─────────────────────────────────────────────
class SubjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    domain_id: int


class SubjectResponse(SubjectBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime


# ─── MockTest ────────────────────────────────────────────
class MockTestBase(BaseModel):
    name: str
    description: Optional[str] = None
    subject_id: int
    difficulty: DifficultyEnum
    duration_minutes: int = 30


class MockTestResponse(MockTestBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
    question_count: Optional[int] = None


# ─── Question ────────────────────────────────────────────
class QuestionBase(BaseModel):
    text: str
    options: List[str]
    topic: str
    explanation: Optional[str] = None
    order_num: int = 0


class QuestionResponse(QuestionBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    test_id: int
    correct_answer: Optional[int] = None  # Hidden unless reviewing


class QuestionWithAnswer(QuestionResponse):
    """Includes correct_answer for post-attempt review."""
    correct_answer: int = Field(...)  # Required in this subclass; narrows Optional[int] from parent


# ─── Attempt ─────────────────────────────────────────────
class SubmitAttemptRequest(BaseModel):
    student_id: str
    test_id: int
    answers: Dict[str, int]  # {question_id: selected_option_index}
    time_taken_seconds: Optional[int] = None


class AttemptResult(BaseModel):
    attempt_id: int
    score: int
    total: int
    percentage: float
    correct_questions: List[int]
    incorrect_questions: List[int]
    topic_breakdown: Dict[str, Dict[str, int]]  # {topic: {correct, total}}


# ─── Analytics ───────────────────────────────────────────
class TopicPerformanceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    topic: str
    correct: int
    total_attempted: int
    accuracy: float
    weakness_score: float


class AnalyticsResponse(BaseModel):
    student_id: str
    total_tests_taken: int
    overall_accuracy: float
    topic_performance: List[TopicPerformanceResponse]
    weakest_topics: List[str]
    strongest_topics: List[str]
    recent_attempts: List[Dict[str, Any]]


# ─── Planner ─────────────────────────────────────────────
class StudySession(BaseModel):
    topic: str
    duration_minutes: int
    learning_objective: str
    resources: List[Dict[str, str]]
    weakness_score: float


class DayPlan(BaseModel):
    day: int
    date: str
    sessions: List[StudySession]
    total_minutes: int


class RevisionPlanResponse(BaseModel):
    student_id: str
    plan: List[DayPlan]
    generated_at: str
    total_topics_covered: int


# ─── Resources ───────────────────────────────────────────
class ResourceItem(BaseModel):
    title: str
    description: str
    url: Optional[str] = None
    resource_type: str  # article, video, quiz, tutorial
    score: float


class ResourcesResponse(BaseModel):
    topic: str
    resources: List[ResourceItem]


# ─── Chat ────────────────────────────────────────────────
class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    student_id: str
    message: str
    history: Optional[List[ChatMessage]] = []


class ChatResponse(BaseModel):
    response: str
    student_id: str
