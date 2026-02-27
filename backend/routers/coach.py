"""
AI Coach router.
LangChain-powered coaching agent endpoint.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from services.agent_service import get_coach_response
from schemas import ChatRequest, ChatResponse

router = APIRouter()


@router.post("", response_model=ChatResponse)
async def chat_with_coach(payload: ChatRequest, db: Session = Depends(get_db)):
    """Chat with the AI learning coach."""
    try:
        response = await get_coach_response(
            student_id=payload.student_id,
            message=payload.message,
            history=payload.history or [],
            db=db
        )
        return ChatResponse(response=response, student_id=payload.student_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Coach error: {str(e)}")
