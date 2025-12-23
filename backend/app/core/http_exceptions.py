from fastapi import status
from app.core.errors import AppException, ErrorCodes


def not_found(code: str, message: str):
    raise AppException(
        status_code=status.HTTP_404_NOT_FOUND,
        code=code,
        message=message
    )


def bad_request(code: str, message: str, details: dict | None = None):
    raise AppException(
        status_code=status.HTTP_400_BAD_REQUEST,
        code=code,
        message=message,
        details=details
    )


def unauthorized(message: str = "Invalid credentials"):
    raise AppException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        code=ErrorCodes.AUTHENTICATION_ERROR,
        message=message
    )


def forbidden(message: str = "Permission denied"):
    raise AppException(
        status_code=status.HTTP_403_FORBIDDEN,
        code=ErrorCodes.AUTHORIZATION_ERROR,
        message=message
    )
