from fastapi import HTTPException, status

from app.core.errors import ErrorCodes


def require_owner(resource_owner_id, current_user_id):
    if resource_owner_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "error": {
                    "code": ErrorCodes.INTERNAL_ERROR,
                    "message": "Not allowed to modify this resource",
                }
            },
        )
