"""
LangChain AI Coaching Agent.
Compatible with Gemini (default) and OpenAI (via LLM_PROVIDER env var).
Falls back to helpful static responses when LLM not configured.
"""
from typing import List
from sqlalchemy.orm import Session
from config import settings
from schemas import ChatMessage
import json


SYSTEM_PROMPT = """You are LearnBot, a warm, encouraging, and expert AI learning coach.
Your personality: patient, motivating, clear, and adaptive.

Your capabilities:
- Explain any academic concept in simple terms with examples
- Identify student mistake patterns and give targeted advice
- Motivate students who are struggling
- Create micro-summaries of topics
- Suggest study strategies based on performance data

When responding:
- Be concise (3-5 sentences for explanations unless asked for more)
- Always end with an encouraging note or actionable next step
- Use bullet points for structured advice
- Reference the student's specific weak topics when relevant
- Use emojis sparingly to make responses friendly
"""


def _make_openai():
    from langchain_openai import ChatOpenAI

    return ChatOpenAI(
        model="gpt-4o-mini",
        openai_api_key=settings.OPENAI_API_KEY,
        temperature=0.7,
    )


def _make_gemini():
    from langchain_google_genai import ChatGoogleGenerativeAI

    return ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        google_api_key=settings.GEMINI_API_KEY,
        temperature=0.7,
        convert_system_message_to_human=True,
    )


def _get_llm():
    """Initialize LLM — returns None if not configured (graceful degradation)."""
    provider = (settings.LLM_PROVIDER or "gemini").strip().lower()
    openai_ok = settings.valid_openai_key()
    gemini_ok = settings.valid_gemini_key()

    try:
        if provider == "openai" and openai_ok:
            return _make_openai()
        if provider == "gemini" and gemini_ok:
            return _make_gemini()
        # Preferred provider missing or invalid — use whichever key is configured
        if provider == "openai" and not openai_ok and gemini_ok:
            return _make_gemini()
        if provider == "gemini" and not gemini_ok and openai_ok:
            return _make_openai()
        if gemini_ok:
            return _make_gemini()
        if openai_ok:
            return _make_openai()
    except ImportError:
        pass
    return None


def _build_student_context(student_id: str, db: Session) -> str:
    from models import TopicPerformance, RevisionPlan
    topic_perfs = (
        db.query(TopicPerformance)
        .filter(TopicPerformance.student_id == student_id)
        .order_by(TopicPerformance.weakness_score.desc())
        .limit(10)
        .all()
    )
    if not topic_perfs:
        return "The student has not completed any tests yet."

    weak = [tp.topic for tp in topic_perfs if tp.weakness_score > 0.5]
    strong = [tp.topic for tp in topic_perfs if tp.weakness_score < 0.25]
    ctx = [
        f"Student ID: {student_id}",
        f"Weak topics: {', '.join(weak[:5]) if weak else 'None identified yet'}",
        f"Strong topics: {', '.join(strong[:3]) if strong else 'None identified yet'}",
    ]

    plan = db.query(RevisionPlan).filter(
        RevisionPlan.student_id == student_id,
        RevisionPlan.is_active == True
    ).first()
    if plan:
        plan_data = json.loads(plan.plan_data)
        if plan_data:
            today_topics = [s["topic"] for s in plan_data[0].get("sessions", [])]
            if today_topics:
                ctx.append(f"Today's plan: {', '.join(today_topics)}")
    return "\n".join(ctx)


async def get_coach_response(
    student_id: str,
    message: str,
    history: List[ChatMessage],
    db: Session
) -> str:
    llm = _get_llm()
    if llm is None:
        return _static_response(message)

    try:
        from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
        student_context = _build_student_context(student_id, db)
        full_system = f"{SYSTEM_PROMPT}\n\n--- Student Context ---\n{student_context}\n--- End Context ---"

        messages = [SystemMessage(content=full_system)]
        for msg in history[-10:]:
            if msg.role == "user":
                messages.append(HumanMessage(content=msg.content))
            elif msg.role == "assistant":
                messages.append(AIMessage(content=msg.content))
        messages.append(HumanMessage(content=message))

        response = await llm.ainvoke(messages)
        return response.content
    except Exception as e:
        print(f"⚠️  LLM error: {e}")
        return _static_response(message)


def _static_response(message: str) -> str:
    msg = message.lower()
    if any(w in msg for w in ["weak", "struggling", "hard", "difficult", "fail"]):
        return (
            "🎯 I see you're finding some topics challenging — that's completely normal! "
            "The key is to break them into small pieces and practice one concept at a time.\n\n"
            "• Check your revision plan for today's recommended topics\n"
            "• Focus 20-minute sessions on your weakest areas\n"
            "• Review the explanations after each test submission\n\n"
            "💪 You've got this! Every expert was once a beginner."
        )
    elif any(w in msg for w in ["plan", "today", "study", "schedule", "revision"]):
        return (
            "📅 Your personalized 7-day revision plan is on the **Planner** page!\n\n"
            "It's generated based on your test performance — weaker topics get more study time. "
            "Head to the Planner page, click **Generate My Plan**, and you'll see day-by-day sessions "
            "with learning objectives and resource links.\n\n"
            "🎯 Aim for at least 60-90 minutes of focused study today!"
        )
    elif any(w in msg for w in ["topic", "analytics", "performance", "score", "accuracy"]):
        return (
            "📊 Your analytics are on the **Analytics** page — it shows:\n\n"
            "• Per-topic accuracy bars (green = strong, red = weak)\n"
            "• Overall test accuracy across all attempts\n"
            "• Your weakest and strongest topics ranked\n"
            "• Complete attempt history\n\n"
            "Once you've taken a few tests, click **'Generate Revision Plan'** on that page "
            "to get a personalized study schedule! 🚀"
        )
    elif any(w in msg for w in ["explain", "what is", "how does", "define", "what are"]):
        return (
            "🔍 Great question! I'd love to explain that to you.\n\n"
            "Right now, I'm focusing on your test analytics and personalized study plans. "
            "To understand new concepts, I recommend reviewing your course materials or asking your teacher "
            "for specific examples related to your weak areas! 📚"
        )
    elif any(w in msg for w in ["hello", "hi", "hey", "start", "help"]):
        return (
            "👋 Hello! I'm **LearnBot**, your AI study coach!\n\n"
            "Here's what I can help you with:\n"
            "• 🎯 Review your weak areas from analytics\n"
            "• 📅 Discuss your revision plan\n"
            "• 💪 Motivate and guide your study sessions\n\n"
            "What would you like to work on today?"
        )
    else:
        return (
            "🤖 Thanks for your question!\n\n"
            "I'm currently focused on helping you analyze your test results and plan your schedule. "
            "Explore your **Analytics** and **Planner** pages for personalized study insights, "
            "and let me know if you need help understanding your progress! 📊"
        )
