"""
Exam Coach router — analyze topic scores and generate personalized revision plans
for JEE Main, JEE Advanced, EAMCET, and NEET.
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, List, Optional
from datetime import date, timedelta

router = APIRouter()

# ─── Constants ──────────────────────────────────────────────────────────────

EXAM_SUBJECTS = {
    "jee_main": ["Mathematics", "Physics", "Chemistry"],
    "jee_advanced": ["Mathematics", "Physics", "Chemistry"],
    "eamcet_mpc": ["Mathematics", "Physics", "Chemistry"],
    "eamcet_bipc": ["Biology", "Physics", "Chemistry"],
    "neet": ["Biology", "Physics", "Chemistry"],
}

EXAM_WEIGHTAGE = {
    "jee_main":     {"Mathematics": 33, "Physics": 33, "Chemistry": 34},
    "jee_advanced": {"Mathematics": 33, "Physics": 33, "Chemistry": 34},
    "eamcet_mpc":   {"Mathematics": 40, "Physics": 30, "Chemistry": 30},
    "eamcet_bipc":  {"Biology": 50, "Physics": 25, "Chemistry": 25},
    "neet":         {"Biology": 50, "Physics": 25, "Chemistry": 25},
}

EXAM_MAX_MARKS = {
    "jee_main": 300,
    "jee_advanced": 360,
    "eamcet_mpc": 160,
    "eamcet_bipc": 160,
    "neet": 720,
}

VIDEO_RESOURCES = {
    "Mathematics": [
        {"title": "Physics Wallah Maths", "url": "https://www.youtube.com/@PhysicsWallah", "type": "YouTube"},
        {"title": "Unacademy JEE Maths", "url": "https://www.youtube.com/@UnacademyJEE", "type": "YouTube"},
    ],
    "Physics": [
        {"title": "Physics Wallah", "url": "https://www.youtube.com/@PhysicsWallah", "type": "YouTube"},
        {"title": "IIT-PAL Physics", "url": "https://www.youtube.com/@IITPAL", "type": "YouTube"},
    ],
    "Chemistry": [
        {"title": "Physics Wallah Chemistry", "url": "https://www.youtube.com/@PhysicsWallah", "type": "YouTube"},
        {"title": "Unacademy Chemistry", "url": "https://www.youtube.com/@UnacademyJEE", "type": "YouTube"},
    ],
    "Biology": [
        {"title": "PW NEET Biology", "url": "https://www.youtube.com/@PWNEET", "type": "YouTube"},
        {"title": "Unacademy NEET Biology", "url": "https://www.youtube.com/@UnacademyNEET", "type": "YouTube"},
        {"title": "Khan Academy Biology", "url": "https://www.youtube.com/@khanacademy", "type": "YouTube"},
    ],
}

MISTAKE_THRESHOLDS = {
    "Conceptual":   lambda acc: acc < 40,
    "Calculation":  lambda acc: 40 <= acc < 60,
    "Careless":     lambda acc: 60 <= acc < 75,
    "Time Pressure":lambda acc: 75 <= acc < 85,
}

STRATEGY = {
    "jee_main": {
        "attempt_order": "Chemistry → Physics → Mathematics",
        "time_split": "Chemistry: 60 min | Physics: 60 min | Maths: 60 min",
        "negative_marking": "-1 for every wrong answer. Skip if less than 33% confident.",
        "high_weightage": ["Calculus", "Thermodynamics", "Organic Chemistry"],
        "tips": [
            "Attempt all 20 MCQs per subject — integer type has no negative marking.",
            "Mark difficult MCQs and revisit in last 15 min.",
            "Chemistry is the fastest subject — attempt first to save time.",
        ],
    },
    "jee_advanced": {
        "attempt_order": "Paper 1: Physics → Chemistry → Maths | Paper 2: Maths → Chemistry → Physics",
        "time_split": "3 hours per paper — 60 min per subject",
        "negative_marking": "Varies by question type. Read instructions carefully for each section.",
        "high_weightage": ["Integration", "Electrochemistry", "Mechanics"],
        "tips": [
            "Never guess in partial marking sections — penalty is severe.",
            "Solve paragraph-based questions from the subject you are strongest in first.",
            "Leave 20 minutes at end for review.",
        ],
    },
    "eamcet_mpc": {
        "attempt_order": "Mathematics → Physics → Chemistry",
        "time_split": "Maths: 80 min | Physics: 40 min | Chemistry: 40 min",
        "negative_marking": "No negative marking — attempt all questions.",
        "high_weightage": ["Coordinate Geometry", "Thermodynamics", "Organic Chemistry"],
        "tips": [
            "No negative marking — attempt every question.",
            "Mathematics has 80 questions; practice speed extensively.",
            "Use elimination method for tricky options.",
        ],
    },
    "eamcet_bipc": {
        "attempt_order": "Biology → Chemistry → Physics",
        "time_split": "Biology: 80 min | Chemistry: 40 min | Physics: 40 min",
        "negative_marking": "No negative marking — attempt all questions.",
        "high_weightage": ["Human Physiology", "Organic Chemistry", "Optics"],
        "tips": [
            "Biology has the most questions — start with it.",
            "Revise NCERT diagrams thoroughly.",
            "Physics formulas need quick recall — make a formula sheet.",
        ],
    },
    "neet": {
        "attempt_order": "Biology → Chemistry → Physics",
        "time_split": "Biology: 90 min | Chemistry: 45 min | Physics: 45 min",
        "negative_marking": "-1 for every wrong answer. Skip if unsure.",
        "high_weightage": ["Human Physiology", "Genetics", "Organic Chemistry"],
        "tips": [
            "Biology (Botany + Zoology) carries 360/720 marks — master NCERT.",
            "Physics questions are calculative — don't rush.",
            "Chemistry is scoring — aim for 95%+ in Chemistry.",
        ],
    },
}


# ─── Schemas ────────────────────────────────────────────────────────────────

class TopicScore(BaseModel):
    topic: str
    subject: str
    accuracy: float          # 0-100
    time_taken_avg: float    # seconds per question
    attempted: int


class AnalyzeRequest(BaseModel):
    exam_type: str           # jee_main | jee_advanced | eamcet_mpc | eamcet_bipc | neet
    topic_scores: List[TopicScore]


class WeakTopic(BaseModel):
    topic: str
    subject: str
    accuracy: float
    mistake_type: str
    priority: str            # High | Medium | Low


class AnalyzeResponse(BaseModel):
    weak_topics: List[WeakTopic]
    subject_summary: Dict[str, float]   # subject -> avg accuracy
    predicted_score: float
    max_score: int
    readiness_pct: float


class PlanRequest(BaseModel):
    exam_type: str
    weak_topics: List[WeakTopic]


class DaySession(BaseModel):
    subject: str
    topic: str
    duration_minutes: int
    session_type: str        # Concept | Practice | Revision | Mini Test
    resources: List[Dict]


class DayPlanItem(BaseModel):
    day: int
    date: str
    sessions: List[DaySession]
    total_minutes: int


class PlanResponse(BaseModel):
    exam_type: str
    plan: List[DayPlanItem]
    strategy: Dict
    total_topics: int


# ─── Endpoints ──────────────────────────────────────────────────────────────

@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_performance(req: AnalyzeRequest):
    """Analyze topic scores and return weak topics with mistake classification."""
    weak: List[WeakTopic] = []
    subject_totals: Dict[str, List[float]] = {}

    for ts in req.topic_scores:
        subj = ts.subject
        subject_totals.setdefault(subj, []).append(ts.accuracy)

        if ts.accuracy < 85:
            # Classify mistake type
            mistake = "Conceptual"
            for mtype, cond in MISTAKE_THRESHOLDS.items():
                if cond(ts.accuracy):
                    mistake = mtype
                    break

            # Also penalise slow answers even if moderately accurate
            if ts.time_taken_avg > 120 and ts.accuracy < 75:
                mistake = "Time Pressure"

            priority = "High" if ts.accuracy < 50 else ("Medium" if ts.accuracy < 70 else "Low")
            weak.append(WeakTopic(
                topic=ts.topic,
                subject=ts.subject,
                accuracy=ts.accuracy,
                mistake_type=mistake,
                priority=priority,
            ))

    subject_summary = {
        subj: round(sum(accs) / len(accs), 1)
        for subj, accs in subject_totals.items()
    }

    # Predicted score
    weightage = EXAM_WEIGHTAGE.get(req.exam_type, {})
    max_marks = EXAM_MAX_MARKS.get(req.exam_type, 300)
    predicted = 0.0
    for subj, avg_acc in subject_summary.items():
        w = weightage.get(subj, 33)
        subject_marks = (w / 100) * max_marks
        predicted += (avg_acc / 100) * subject_marks

    readiness = round((predicted / max_marks) * 100, 1) if max_marks else 0

    return AnalyzeResponse(
        weak_topics=sorted(weak, key=lambda x: x.accuracy),
        subject_summary=subject_summary,
        predicted_score=round(predicted, 1),
        max_score=max_marks,
        readiness_pct=readiness,
    )


@router.post("/plan", response_model=PlanResponse)
def generate_plan(req: PlanRequest):
    """Generate a 7-day revision plan targeting weak topics."""
    strategy = STRATEGY.get(req.exam_type, {})

    # Sort topics: High priority first
    priority_order = {"High": 0, "Medium": 1, "Low": 2}
    sorted_topics = sorted(req.weak_topics, key=lambda t: (priority_order.get(t.priority, 3), t.accuracy))

    plan: List[DayPlanItem] = []
    today = date.today()

    for day_num in range(1, 8):
        sessions: List[DaySession] = []
        day_date = today + timedelta(days=day_num - 1)

        if day_num == 7:
            # Day 7 = full revision + mini test
            for i, topic in enumerate(sorted_topics[:3]):
                sessions.append(DaySession(
                    subject=topic.subject,
                    topic=topic.topic,
                    duration_minutes=30,
                    session_type="Revision",
                    resources=VIDEO_RESOURCES.get(topic.subject, []),
                ))
            sessions.append(DaySession(
                subject="All Subjects",
                topic="Full Mock Test",
                duration_minutes=60,
                session_type="Mini Test",
                resources=[],
            ))
        else:
            # Distribute topics across 6 days (1-2 topics per day)
            idx_a = (day_num - 1) * 2 % max(len(sorted_topics), 1)
            idx_b = (idx_a + 1) % max(len(sorted_topics), 1)

            for idx in set([idx_a, idx_b]):
                if idx < len(sorted_topics):
                    topic = sorted_topics[idx]
                    stype = "Concept" if topic.mistake_type in ("Conceptual", "Formula") else "Practice"
                    sessions.append(DaySession(
                        subject=topic.subject,
                        topic=topic.topic,
                        duration_minutes=45 if topic.priority == "High" else 30,
                        session_type=stype,
                        resources=VIDEO_RESOURCES.get(topic.subject, []),
                    ))

            # Add a daily practice block
            if sorted_topics:
                weakest = sorted_topics[0]
                sessions.append(DaySession(
                    subject=weakest.subject,
                    topic=f"PYQ Practice — {weakest.topic}",
                    duration_minutes=20,
                    session_type="Practice",
                    resources=[],
                ))

        total_min = sum(s.duration_minutes for s in sessions)
        plan.append(DayPlanItem(
            day=day_num,
            date=str(day_date),
            sessions=sessions,
            total_minutes=total_min,
        ))

    return PlanResponse(
        exam_type=req.exam_type,
        plan=plan,
        strategy=strategy,
        total_topics=len(sorted_topics),
    )
