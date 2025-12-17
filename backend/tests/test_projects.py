def test_create_project(client):
    response = client.post(
        "/api/v1/projects",
        json={
            "name": "Test Project",
            "description": "Testing projects API",
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Project"
    assert "id" in data

def test_list_projects(client):
    response = client.get("/api/v1/projects")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_project(client):
    create = client.post(
        "/api/v1/projects",
        json={"name": "Fetch Project"},
    )
    project_id = create.json()["id"]

    response = client.get(f"/api/v1/projects/{project_id}")
    assert response.status_code == 200
    assert response.json()["id"] == project_id

def test_update_project(client):
    create = client.post(
        "/api/v1/projects",
        json={"name": "Old Name"},
    )
    project_id = create.json()["id"]

    response = client.patch(
        f"/api/v1/projects/{project_id}",
        json={"name": "New Name"},
    )

    assert response.status_code == 200
    assert response.json()["name"] == "New Name"
def test_delete_project(client):
    create = client.post(
        "/api/v1/projects",
        json={"name": "Delete Me"},
    )
    project_id = create.json()["id"]

    delete = client.delete(f"/api/v1/projects/{project_id}")
    assert delete.status_code == 204

    get_again = client.get(f"/api/v1/projects/{project_id}")
    assert get_again.status_code == 404
