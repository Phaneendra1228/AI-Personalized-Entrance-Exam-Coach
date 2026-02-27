"""
Weakness scorer service.
Computes normalized weakness scores per topic for a student.
"""
from sqlalchemy.orm import Session
from models import TopicPerformance
from typing import List, Dict


def compute_weakness_scores(student_id: str, db: Session) -> List[Dict]:
    """
    Compute and return weakness scores for all topics of a student.
    weakness_score: 0.0 = mastered, 1.0 = completely weak.
    
    Returns list of dicts sorted by weakness_score descending.
    """
    topic_perfs = (
        db.query(TopicPerformance)
        .filter(TopicPerformance.student_id == student_id)
        .all()
    )

    result = []
    for tp in topic_perfs:
        if tp.total_attempted == 0:
            continue
        result.append({
            "topic": tp.topic,
            "correct": tp.correct,
            "total_attempted": tp.total_attempted,
            "accuracy": tp.accuracy,
            "weakness_score": tp.weakness_score,
        })

    # Sort by weakness_score descending (weakest first)
    result.sort(key=lambda x: x["weakness_score"], reverse=True)
    return result


def get_weighted_topics(student_id: str, db: Session) -> List[Dict]:
    """
    Returns topics with normalized weights for planner allocation.
    Weight proportional to weakness_score (weak topics get more time).
    Topics not yet attempted get a default medium weight of 0.5.
    """
    scores = compute_weakness_scores(student_id, db)
    if not scores:
        return []

    total_weight = sum(max(s["weakness_score"], 0.1) for s in scores)
    for s in scores:
        s["weight"] = round(max(s["weakness_score"], 0.1) / total_weight, 4)

    return scores
