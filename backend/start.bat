@echo off
echo Starting LearnFlow Backend...
cd /d %~dp0

REM Check if venv exists, create if not
if not exist "venv\Scripts\python.exe" (
    echo Creating virtual environment...
    python -m venv venv
    echo Installing dependencies...
    venv\Scripts\pip.exe install fastapi uvicorn[standard] sqlalchemy pydantic pydantic-settings python-dotenv python-multipart aiosqlite
    echo Optional: install AI packages
    venv\Scripts\pip.exe install langchain langchain-community langchain-google-genai langchain-openai openai google-generativeai pinecone-client
)

REM Seed database if not already done
if not exist "learning.db" (
    echo Seeding database...
    venv\Scripts\python.exe seed.py
)

echo Starting FastAPI server on http://localhost:8000
echo Docs available at http://localhost:8000/docs
venv\Scripts\uvicorn.exe main:app --port 8000 --reload
