# Issue Tracker

A full-stack Issue Tracker application built with FastAPI and React.

This project demonstrates how to design, build, and ship a production-ready CRUD system with authentication, authorization, pagination, and a clean frontend.

---

## Features

- JWT Authentication
- Ownership-based authorization
- Projects & Issues management
- Issue lifecycle (create, filter, update status, delete)
- Pagination & filtering
- REST API with OpenAPI docs
- Responsive frontend with React + Tailwind

---

## Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- Alembic
- SQLite
- JWT (python-jose)
- Pytest

### Frontend
- React (Vite + TypeScript)
- React Router
- Tailwind CSS

---

## Screenshots

> _(Add screenshots here)_

---

## Getting Started

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

Backend runs at: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## Demo Credentials

```
email: demo@example.com
password: password123
```

---

## Why this project?

This project was built to demonstrate:

- Clean backend architecture
- Secure API design
- Real-world frontend workflows
- Ability to finish and ship a complete system

Keep it **simple, honest, readable**.
