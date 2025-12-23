import pytest
from app.core.errors import ErrorCodes

@pytest.mark.asyncio
async def test_validation_error_format(auth_client):
    # Try to create a project with a very short name to trigger validation error
    response = await auth_client.post(
        "/api/v1/projects",
        json={"name": "a"}  # min_length is 2
    )
    
    assert response.status_code == 422
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == ErrorCodes.VALIDATION_ERROR
    assert "details" in data["error"]
    assert "errors" in data["error"]["details"]

@pytest.mark.asyncio
async def test_not_found_error_format(auth_client):
    response = await auth_client.get("/api/v1/projects/00000000-0000-0000-0000-000000000000")
    
    assert response.status_code == 404
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == ErrorCodes.PROJECT_NOT_FOUND
    assert "message" in data["error"]

@pytest.mark.asyncio
async def test_unauthorized_error_format(client):
    # Request without auth
    response = await client.get("/api/v1/projects")
    
    # FastAPI's OAuth2PasswordBearer returns 401 with "Not authenticated" by default
    # But let's see how our middleware handles it if it's trapped.
    # Actually, OAuth2PasswordBearer raises HTTPException before it hits our handler?
    # No, it should hit our HTTPException handler.
    assert response.status_code == 401
    data = response.json()
    assert "error" in data
    # Standard HTTPException handler uses f"HTTP_{status_code}" as code
    assert data["error"]["code"] == "HTTP_401"
