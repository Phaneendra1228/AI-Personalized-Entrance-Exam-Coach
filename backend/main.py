"""
FastAPI application entry point.
Includes all routers and startup events.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import init_db
from config import settings

from routers import (
    domains, subjects, tests, questions,
    attempts, analytics, planner, resources, coach, exam_coach
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup."""
    init_db()
    print("✅ Database initialized")
    yield
    print("🔴 Shutting down...")


app = FastAPI(
    title="Adaptive Learning Platform API",
    description="AI-powered adaptive learning with personalized revision planning",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list + ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(domains.router, prefix="/domains", tags=["Domains"])
app.include_router(subjects.router, prefix="/subjects", tags=["Subjects"])
app.include_router(tests.router, prefix="/tests", tags=["Tests"])
app.include_router(questions.router, prefix="/questions", tags=["Questions"])
app.include_router(attempts.router, prefix="/submit_attempt", tags=["Attempts"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
app.include_router(planner.router, prefix="/generate_plan", tags=["Planner"])
app.include_router(resources.router, prefix="/resources", tags=["Resources"])
app.include_router(coach.router, prefix="/chat", tags=["AI Coach"])
app.include_router(exam_coach.router, prefix="/exam-coach", tags=["Exam Coach"])


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "version": "1.0.0"}


@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Adaptive Learning Platform API",
        "docs": "/docs",
        "health": "/health"
    }
