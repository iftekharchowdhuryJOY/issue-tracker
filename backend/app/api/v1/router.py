from fastapi import APIRouter

from app.api.v1.routes import auth, health, issues, projects, users

router = APIRouter()
router.include_router(health.router, tags=["health"])
router.include_router(projects.router, tags=["projects"])
router.include_router(issues.router, tags=["issues"])
router.include_router(auth.router, tags=["auth"])
router.include_router(users.router, tags=["users"])
