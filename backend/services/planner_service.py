"""
Adaptive 7-Day Revision Planner Service.

Algorithm:
1. Fetch all TopicPerformance for student
2. Compute weakness weights (0.1 floor for all topics)
3. Budget: 120 min/day × 7 days = 840 total minutes
4. Allocate minutes proportional to weakness weight
5. Split into daily sessions (max 3 topics/day, max 60 min/topic)
6. Generate learning objectives per session
7. Persist active plan
"""
import json
import math
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from models import RevisionPlan
from services.weakness_scorer import get_weighted_topics
from services.pinecone_service import retrieve_resources_sync
from schemas import StudySession, DayPlan, RevisionPlanResponse
from typing import List, Dict


TOTAL_DAYS = 7
DAILY_MINUTES = 120
MAX_TOPICS_PER_DAY = 3
MAX_MINUTES_PER_SESSION = 60
MIN_MINUTES_PER_SESSION = 20


LEARNING_OBJECTIVES = {
    "default_weak": "Review core concepts, identify gaps, practice targeted exercises",
    "default_medium": "Consolidate understanding through practice problems and examples",
    "default_strong": "Light review and application to challenging edge cases",
}


def _get_objective(weakness_score: float, topic: str) -> str:
    """Generate a learning objective based on weakness score."""
    if weakness_score >= 0.65:
        return f"Deeply review '{topic}': focus on fundamentals, work through each concept step-by-step, practice 10+ example problems"
    elif weakness_score >= 0.35:
        return f"Strengthen '{topic}': revisit key formulas/theories, attempt medium-difficulty problems, identify recurring mistake patterns"
    else:
        return f"Maintain '{topic}': quick recall flashcards, solve 3-5 advanced problems, review any recent errors"


def generate_revision_plan(student_id: str, db: Session) -> RevisionPlanResponse:
    """Generate a 7-day personalized revision plan."""
    weighted_topics = get_weighted_topics(student_id, db)

    if not weighted_topics:
        # No data yet — return a balanced fallback plan
        return _fallback_plan(student_id)

    # Allocate total minutes per topic
    total_minutes = TOTAL_DAYS * DAILY_MINUTES
    topic_minutes = {}
    for topic_data in weighted_topics:
        allocated = round(total_minutes * topic_data["weight"])
        allocated = max(allocated, MIN_MINUTES_PER_SESSION)
        topic_minutes[topic_data["topic"]] = {
            "minutes_remaining": allocated,
            "weakness_score": topic_data["weakness_score"],
        }

    # Distribute into days
    days: List[DayPlan] = []
    today = datetime.utcnow().date()
    topics_queue = list(topic_minutes.keys())

    for day_num in range(1, TOTAL_DAYS + 1):
        sessions: List[StudySession] = []
        minutes_today = 0

        for topic in topics_queue:
            if len(sessions) >= MAX_TOPICS_PER_DAY:
                break
            if minutes_today >= DAILY_MINUTES:
                break

            remaining = topic_minutes[topic]["minutes_remaining"]
            if remaining <= 0:
                continue

            session_mins = min(remaining, MAX_MINUTES_PER_SESSION, DAILY_MINUTES - minutes_today)
            session_mins = max(session_mins, MIN_MINUTES_PER_SESSION)

            weakness = topic_minutes[topic]["weakness_score"]
            objective = _get_objective(weakness, topic)
            resources = retrieve_resources_sync(topic, top_k=3)

            sessions.append(StudySession(
                topic=topic,
                duration_minutes=session_mins,
                learning_objective=objective,
                resources=[{"title": r.title, "url": r.url or "#", "type": r.resource_type} for r in resources],
                weakness_score=round(weakness, 3),
            ))
            topic_minutes[topic]["minutes_remaining"] -= session_mins
            minutes_today += session_mins

        if not sessions:
            # Recycle weakest topics on empty days
            for topic in topics_queue[:MAX_TOPICS_PER_DAY]:
                weakness = topic_minutes[topic]["weakness_score"]
                resources = retrieve_resources_sync(topic, top_k=2)
                sessions.append(StudySession(
                    topic=topic,
                    duration_minutes=MIN_MINUTES_PER_SESSION,
                    learning_objective=f"Review session: {topic}",
                    resources=[{"title": r.title, "url": r.url or "#", "type": r.resource_type} for r in resources],
                    weakness_score=round(weakness, 3),
                ))
                minutes_today += MIN_MINUTES_PER_SESSION

        day_date = today + timedelta(days=day_num - 1)
        days.append(DayPlan(
            day=day_num,
            date=day_date.isoformat(),
            sessions=sessions,
            total_minutes=minutes_today,
        ))

    # Persist plan
    existing_plan = db.query(RevisionPlan).filter(
        RevisionPlan.student_id == student_id,
        RevisionPlan.is_active == True
    ).first()
    if existing_plan:
        existing_plan.is_active = False

    new_plan = RevisionPlan(
        student_id=student_id,
        plan_data=json.dumps([d.model_dump() for d in days]),
        is_active=True,
    )
    db.add(new_plan)
    db.commit()

    total_topics = len(set(
        s.topic for day in days for s in day.sessions
    ))

    return RevisionPlanResponse(
        student_id=student_id,
        plan=days,
        generated_at=datetime.utcnow().isoformat(),
        total_topics_covered=total_topics,
    )


def _fallback_plan(student_id: str) -> RevisionPlanResponse:
    """Fallback balanced plan when no performance data exists."""
    today = datetime.utcnow().date()
    fallback_topics = ["Core Concepts Review", "Problem Solving", "Exam Strategy"]
    days = []
    for day_num in range(1, TOTAL_DAYS + 1):
        topic = fallback_topics[day_num % len(fallback_topics)]
        sessions = [
            StudySession(
                topic=topic,
                duration_minutes=60,
                learning_objective="Complete your first mock test to unlock your personalized plan!",
                resources=[],
                weakness_score=0.5,
            )
        ]
        days.append(DayPlan(
            day=day_num,
            date=(today + timedelta(days=day_num - 1)).isoformat(),
            sessions=sessions,
            total_minutes=60,
        ))
    return RevisionPlanResponse(
        student_id=student_id,
        plan=days,
        generated_at=datetime.utcnow().isoformat(),
        total_topics_covered=len(fallback_topics),
    )
