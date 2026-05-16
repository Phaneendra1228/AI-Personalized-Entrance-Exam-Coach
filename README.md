<div align="center">
  <h1>🚀 LearnFlow: Personalized Entrance Exam Coach</h1>
  <p><i>An AI-driven intelligent tutoring system for JEE/NEET aspirants.</i></p>

  [![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
  [![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
</div>

<br />

## 🌟 Overview

**LearnFlow** is a comprehensive, AI-powered study companion designed specifically for students preparing for competitive entrance exams like **JEE** and **NEET**. 
It offers a highly interactive, animated user interface built with Next.js and Tailwind CSS, backed by a robust FastAPI backend.

The platform provides structured learning paths covering **65 official NTA syllabus chapters** across Mathematics, Physics, Chemistry, and Biology.

## ✨ Key Features

- **🧠 AI Entrance Exam Coach:** Personalized study materials and revision plans tailored to individual learning paces.
- **📚 Comprehensive Syllabus Coverage:** In-depth modules for Physics, Chemistry, Mathematics, and Biology (JEE/NEET standards).
- **🎨 Modern, Animated UI:** Beautiful glassmorphism effects, particle animations, and fluid transitions built from the ground up to provide an engaging learning environment.
- **🔐 Simulated Authentication:** A seamless, local-first mock authentication system using `localStorage` and `sessionStorage` for swift onboarding and profile management.
- **🚀 Dual-Server Architecture:** Seamlessly orchestrated Next.js frontend and FastAPI backend for an optimal developer experience.
- **🌐 Ready for Deployment:** Configured for out-of-the-box deployment on Render.

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State Management:** React Hooks & Custom Event Syncing

### Backend
- **Framework:** FastAPI
- **Language:** Python 3.11+
- **Server:** Uvicorn
- **Database:** SQLite (with SQLAlchemy)

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v20+)
- [Python](https://www.python.org/) (v3.11+)

### 1. Clone the repository
```bash
git clone https://github.com/Phaneendra1228/LearnFlow.git
cd LearnFlow
```

### 2. Run the Application (Windows)
We have provided a convenient batch script that automatically sets up the environment and starts both the frontend and backend servers.

```bash
run.bat
```
*This will:*
- *Start the FastAPI server on `http://localhost:8000`*
- *Start the Next.js server on `http://localhost:3000`*
- *Automatically open the app in your default browser.*

### Alternative: Manual Setup

**Backend:**
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r ../requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## ☁️ Deployment

This project is configured to be easily deployed on [Render](https://render.com/) using the included `render.yaml` blueprint. It sets up a single Render Web Service that serves both the compiled Next.js static frontend and the FastAPI backend.

1. Connect your GitHub repository to Render.
2. Select **Blueprints** and create a new Blueprint Instance.
3. Render will automatically build and deploy the full stack application.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Phaneendra1228/LearnFlow/issues).

## 📄 License

This project is licensed under the MIT License.
