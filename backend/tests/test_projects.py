import pytest
from app.core.errors import ErrorCodes

@pytest.mark.asyncio
async def test_create_project(auth_client):
    response = await auth_client.post(
        "/api/v1/projects",
        json={
            "name": "Test Project",
            "description": "Testing projects API",
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Project"
    assert data["description"] == "Testing projects API"

@pytest.mark.asyncio
async def test_list_projects(auth_client):
    response = await auth_client.get("/api/v1/projects")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert isinstance(data["items"], list)
    assert isinstance(data["total"], int)

@pytest.mark.asyncio
async def test_get_project(auth_client):
    create = await auth_client.post(
        "/api/v1/projects",
        json={"name": "Fetch Project"},
    )
    project_id = create.json()["id"]

    response = await auth_client.get(f"/api/v1/projects/{project_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Fetch Project"
    assert data["id"] == project_id

@pytest.mark.asyncio
async def test_update_project(auth_client):
    create = await auth_client.post(
        "/api/v1/projects",
        json={"name": "Old Name"},
    )
    project_id = create.json()["id"]

    response = await auth_client.patch(
        f"/api/v1/projects/{project_id}",
        json={"name": "New Name"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "New Name"
    assert data["id"] == project_id

@pytest.mark.asyncio
async def test_delete_project(auth_client):
    create = await auth_client.post(
        "/api/v1/projects",
        json={"name": "Delete Me"},
    )
    project_id = create.json()["id"]

    delete = await auth_client.delete(f"/api/v1/projects/{project_id}")
    assert delete.status_code == 204

    get_again = await auth_client.get(f"/api/v1/projects/{project_id}")
    assert get_again.status_code == 404
    data = get_again.json()
    error = data["error"]
    assert error["code"] == ErrorCodes.PROJECT_NOT_FOUND

@pytest.mark.asyncio
async def test_delete_project_cascades_issues(auth_client):
    project_resp = await auth_client.post(
        "/api/v1/projects",
        json={"name": "Cascade Test"},
    )
    project = project_resp.json()

    issue_resp = await auth_client.post(
        f"/api/v1/issues/projects/{project['id']}",
        json={"title": "Will be deleted"},
    )
    issue = issue_resp.json()

    await auth_client.delete(f"/api/v1/projects/{project['id']}")

    get_issue = await auth_client.get(f"/api/v1/issues/{issue['id']}")
    assert get_issue.status_code == 404
    data = get_issue.json()
    assert data["error"]["code"] == ErrorCodes.ISSUE_NOT_FOUND

@pytest.mark.asyncio
async def test_project_pagination(auth_client):
    for i in range(15):
        await auth_client.post("/api/v1/projects", json={"name": f"P{i}"})

    response = await auth_client.get("/api/v1/projects?page=2&page_size=5")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert isinstance(data["items"], list)
    assert isinstance(data["total"], int)
    assert len(data["items"]) == 5