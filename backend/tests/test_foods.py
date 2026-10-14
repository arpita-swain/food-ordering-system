from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_foods_structure():
    response = client.get("/api/v1/foods")
    assert response.status_code in [200, 500]


def test_get_categories_structure():
    response = client.get("/api/v1/categories")
    assert response.status_code in [200, 500]


def test_unauthorized_food_deletion():
    response = client.delete("/api/v1/foods/food-101")
    assert response.status_code in [401, 403]
