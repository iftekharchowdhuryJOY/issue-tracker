from sqlalchemy.orm import Session

from app.core.jwt import create_access_token
from app.core.security import verify_password
from app.db.models.user import User


class AuthService:
    def authenticate(self, db: Session, email: str, password: str):
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return None

        if not verify_password(password, user.hashed_password):
            return None

        return create_access_token(subject=str(user.id))


auth_service = AuthService()
