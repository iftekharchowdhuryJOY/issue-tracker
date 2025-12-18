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

<img width="1867" height="887" alt="first" src="https://github.com/user-attachments/assets/f9fc59f9-1ea7-46e8-9fa2-ce33318d5c44" />
<img width="1841" height="892" alt="second" src="https://github.com/user-attachments/assets/ffaa1a08-503c-4303-bf8a-eb75690642a9" />
<img width="1237" height="852" alt="Third" src="https://github.com/user-attachments/assets/39416697-8e0c-4b89-bc1a-21d5a3ae61b0" />
<img width="973" height="557" alt="four" src="https://github.com/user-attachments/assets/434be9fe-f9e4-41ae-a078-5e406f40bf6a" />

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
