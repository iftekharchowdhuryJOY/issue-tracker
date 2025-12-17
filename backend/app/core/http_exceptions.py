from fastapi import HTTPException, status
from app.schemas.error import ErrorResponse
from app.core.errors import ErrorCodes


def not_found(code: str, message: str):
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail={
            "error": {
                "code": code,
                "message": message,
            }
        },
    )


def bad_request(code: str, message: str):
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail={
            "error": {
                "code": code,
                "message": message,
            }
        },
    )
