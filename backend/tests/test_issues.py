def test_create_issue(client):
    project = client.post(
        "/api/v1/projects",
        json={"name": "Issue Project"},
    ).json()

    response = client.post(
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
def test_list_issues_by_project(client):
    project = client.post(
        "/api/v1/projects",
        json={"name": "List Issues"},
    ).json()

    client.post(
        f"/api/v1/issues/projects/{project['id']}",
        json={"title": "Issue A"},
    )

    response = client.get(
        f"/api/v1/issues/projects/{project['id']}"
    )

    assert response.status_code == 200
    assert len(response.json()["items"]) >= 1

def test_filter_issues(client):
    project = client.post(
        "/api/v1/projects",
        json={"name": "Filter Issues"},
    ).json()

    client.post(
        f"/api/v1/issues/projects/{project['id']}",
        json={
            "title": "High Priority",
            "priority": "high",
        },
    )

    response = client.get(
        f"/api/v1/issues/projects/{project['id']}?priority=high"
    )

    assert response.status_code == 200
    assert response.json()["items"][0]["priority"] == "high"

def test_update_issue_status(client):
    project = client.post(
        "/api/v1/projects",
        json={"name": "Update Issue"},
    ).json()

    issue = client.post(
        f"/api/v1/issues/projects/{project['id']}",
        json={"title": "Progress Issue"},
    ).json()

    response = client.patch(
        f"/api/v1/issues/{issue['id']}",
        json={"status": "in_progress"},
    )

    assert response.status_code == 200
    assert response.json()["status"] == "in_progress"
def test_delete_issue(client):
    project = client.post(
        "/api/v1/projects",
        json={"name": "Delete Issue"},
    ).json()

    issue = client.post(
        f"/api/v1/issues/projects/{project['id']}",
        json={"title": "Temp Issue"},
    ).json()

    delete = client.delete(f"/api/v1/issues/{issue['id']}")
    assert delete.status_code == 204
