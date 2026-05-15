"""
FastAPI application entry point.
Includes all routers and startup events.
In production (Render), this also reverse-proxies non-API requests
to the Next.js frontend running on port 3000.
"""
import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from contextlib import asynccontextmanager
from database import init_db
from config import settings
import httpx

from routers import (
    domains, subjects, tests, questions,
    attempts, analytics, planner, resources, coach, exam_coach
)

NEXTJS_URL = "http://localhost:3000"
IS_PRODUCTION = os.getenv("RENDER", "") == "true"

# Persistent httpx client for proxying to Next.js
_http_client: httpx.AsyncClient | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup."""
    global _http_client
    init_db()
    print("✅ Database initialized")
    if IS_PRODUCTION:
        _http_client = httpx.AsyncClient(base_url=NEXTJS_URL, timeout=30.0)
        print("✅ Reverse proxy to Next.js enabled")
    yield
    if _http_client:
        await _http_client.aclose()
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


# ─── Reverse Proxy: Forward non-API requests to Next.js ──────────
# This catch-all MUST be registered last so API routes take priority.
if IS_PRODUCTION:
    @app.api_route("/{path:path}", methods=["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH"])
    async def nextjs_proxy(request: Request, path: str):
        """Reverse-proxy all non-API requests to the Next.js frontend."""
        global _http_client
        if _http_client is None:
            return JSONResponse({"error": "Frontend not available"}, status_code=503)

        # Build the target URL
        url = f"/{path}"
        if request.url.query:
            url = f"{url}?{request.url.query}"

        # Forward the request
        try:
            body = await request.body()
            proxy_resp = await _http_client.request(
                method=request.method,
                url=url,
                headers={
                    k: v for k, v in request.headers.items()
                    if k.lower() not in ("host", "transfer-encoding")
                },
                content=body if body else None,
            )

            # Stream the response back
            excluded_headers = {"transfer-encoding", "content-encoding", "content-length"}
            response_headers = {
                k: v for k, v in proxy_resp.headers.items()
                if k.lower() not in excluded_headers
            }

            return StreamingResponse(
                content=iter([proxy_resp.content]),
                status_code=proxy_resp.status_code,
                headers=response_headers,
            )
        except httpx.ConnectError:
            return JSONResponse(
                {"error": "Frontend server not ready. Please try again in a moment."},
                status_code=503
            )
else:
    # In development, show the API info at root
    @app.get("/", tags=["Root"])
    async def root():
        return {
            "message": "Adaptive Learning Platform API",
            "docs": "/docs",
            "health": "/health"
        }
