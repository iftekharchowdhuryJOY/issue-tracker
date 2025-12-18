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

### How to Add Images to This README

There are two main ways to add images to this README file:

#### Method 1: Using Local Images (Recommended)

1. Create an `images` or `screenshots` folder in the project root:
   ```bash
   mkdir images
   ```

2. Add your image files to this folder (e.g., `images/dashboard.png`)

3. Reference the image in the README using relative paths:
   ```markdown
   ![Dashboard Screenshot](images/dashboard.png)
   ```

#### Method 2: Using Remote Images (URLs)

Reference images hosted online directly:
```markdown
![Alt Text](https://example.com/path/to/image.png)
```

#### Example Usage

```markdown
### Application Dashboard
![Dashboard View](images/dashboard.png)

### Issue Details Page
![Issue Details](images/issue-details.png)
```

#### Best Practices

- Use descriptive file names (e.g., `login-page.png`, `issue-list.png`)
- Keep images under 500KB for faster loading
- Use PNG for screenshots with text, JPEG for photos
- Always include descriptive alt text for accessibility
- Consider using relative paths for better portability

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
