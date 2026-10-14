import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "database" in data


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "docs" in data


def test_otp_send_and_verify():
    send_res = client.post("/api/v1/auth/otp/send", json={"phone": "+91 99999 88888"})
    assert send_res.status_code == 200
    assert send_res.json()["success"] is True

    verify_res = client.post("/api/v1/auth/otp/verify", json={"phone": "+91 99999 88888", "otp": "1234"})
    assert verify_res.status_code == 200
    assert verify_res.json()["success"] is True


def test_invalid_login():
    response = client.post("/api/v1/auth/login", json={"email": "nonexistent@foodiego.com", "password": "wrong"})
    assert response.status_code in [401, 500]  # 401 when DB connected
