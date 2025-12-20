import pytest

@pytest.mark.asyncio
async def test_create_issue(auth_client):
    project_resp = await auth_client.post(
        "/api/v1/projects",
        json={"name": "Issue Project"},
    )
    project = project_resp.json()

    response = await auth_client.post(
        f"/api/v1/issues/projects/{project['id']}",
        json={
            "title": "Bug #1",
            "description": "Something broke",
            "priority": "high",
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Bug #1"
    assert data["status"] == "open"

@pytest.mark.asyncio
async def test_list_issues_by_project(auth_client):
    project_resp = await auth_client.post(
        "/api/v1/projects",
        json={"name": "List Issues"},
    )
    project = project_resp.json()

    await auth_client.post(
        f"/api/v1/issues/projects/{project['id']}",
        json={"title": "Issue A"},
    )

    response = await auth_client.get(
        f"/api/v1/issues/projects/{project['id']}"
    )

    assert response.status_code == 200
    assert len(response.json()["items"]) >= 1

@pytest.mark.asyncio
async def test_filter_issues(auth_client):
    project_resp = await auth_client.post(
        "/api/v1/projects",
        json={"name": "Filter Issues"},
    )
    project = project_resp.json()

    await auth_client.post(
        f"/api/v1/issues/projects/{project['id']}",
        json={
            "title": "High Priority",
            "priority": "high",
        },
    )

    response = await auth_client.get(
        f"/api/v1/issues/projects/{project['id']}?priority=high"
    )

    assert response.status_code == 200
    assert response.json()["items"][0]["priority"] == "high"

@pytest.mark.asyncio
async def test_update_issue_status(auth_client):
    project_resp = await auth_client.post(
        "/api/v1/projects",
        json={"name": "Update Issue"},
    )
    project = project_resp.json()

    issue_resp = await auth_client.post(
        f"/api/v1/issues/projects/{project['id']}",
        json={"title": "Progress Issue"},
    )
    issue = issue_resp.json()

    response = await auth_client.patch(
        f"/api/v1/issues/{issue['id']}",
        json={"status": "in_progress"},
    )

    assert response.status_code == 200
    assert response.json()["status"] == "in_progress"

@pytest.mark.asyncio
async def test_delete_issue(auth_client):
    project_resp = await auth_client.post(
        "/api/v1/projects",
        json={"name": "Delete Issue"},
    )
    project = project_resp.json()

    issue_resp = await auth_client.post(
        f"/api/v1/issues/projects/{project['id']}",
        json={"title": "Temp Issue"},
    )
    issue = issue_resp.json()

    delete = await auth_client.delete(f"/api/v1/issues/{issue['id']}")
    assert delete.status_code == 204
