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
Backend runs at:
http://localhost:8000/docs

Frontend
cd frontend
npm install
npm run dev


Frontend runs at:
http://localhost:5173

Demo Credentials
email: demo@example.com
password: password123

Why this project?

This project was built to demonstrate:

Clean backend architecture

Secure API design

Real-world frontend workflows

Ability to finish and ship a complete system


Keep it **simple, honest, readable**.

---

## 3️⃣ Screenshots & demo (proof beats words)

### Take 4–6 screenshots:
1. Login screen
2. Projects list
3. Create project form
4. Project detail with issues
5. Filters + status update
6. (Optional) Mobile view

Save them in:


/screenshots/


Then reference them in README:
```md
![Projects](screenshots/projects.png)


Optional but powerful:

30–60 sec screen recording (GIF or MP4)

Show: login → create project → create issue → update status

4️⃣ Repo hygiene (quiet professionalism)
Do these once:

Remove commented code

Run formatter / linter

Ensure .env is git-ignored

Ensure node_modules not committed

Ensure migrations included

Run final checks:

pytest

npm run build
