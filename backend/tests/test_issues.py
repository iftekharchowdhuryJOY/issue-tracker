def test_create_issue(auth_client):
    project = auth_client.post(
        "/api/v1/projects",
        json={"name": "Issue Project"},
    ).json()

    response = auth_client.post(
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
def test_list_issues_by_project(auth_client):
    project = auth_client.post(
        "/api/v1/projects",
        json={"name": "List Issues"},
    ).json()

    auth_client.post(
        f"/api/v1/issues/projects/{project['id']}",
        json={"title": "Issue A"},
    )

    response = auth_client.get(
        f"/api/v1/issues/projects/{project['id']}"
    )

    assert response.status_code == 200
    assert len(response.json()["items"]) >= 1

def test_filter_issues(auth_client):
    project = auth_client.post(
        "/api/v1/projects",
        json={"name": "Filter Issues"},
    ).json()

    auth_client.post(
        f"/api/v1/issues/projects/{project['id']}",
        json={
            "title": "High Priority",
            "priority": "high",
        },
    )

    response = auth_client.get(
        f"/api/v1/issues/projects/{project['id']}?priority=high"
    )

    assert response.status_code == 200
    assert response.json()["items"][0]["priority"] == "high"

def test_update_issue_status(auth_client):
    project = auth_client.post(
        "/api/v1/projects",
        json={"name": "Update Issue"},
    ).json()

    issue = auth_client.post(
        f"/api/v1/issues/projects/{project['id']}",
        json={"title": "Progress Issue"},
    ).json()

    response = auth_client.patch(
        f"/api/v1/issues/{issue['id']}",
        json={"status": "in_progress"},
    )

    assert response.status_code == 200
    assert response.json()["status"] == "in_progress"
def test_delete_issue(auth_client):
    project = auth_client.post(
        "/api/v1/projects",
        json={"name": "Delete Issue"},
    ).json()

    issue = auth_client.post(
        f"/api/v1/issues/projects/{project['id']}",
        json={"title": "Temp Issue"},
    ).json()

    delete = auth_client.delete(f"/api/v1/issues/{issue['id']}")
    assert delete.status_code == 204
