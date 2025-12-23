from app.core.http_exceptions import forbidden


def require_owner(resource_owner_id, current_user_id):
    if resource_owner_id != current_user_id:
        forbidden("Not allowed to modify this resource")
