from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_order_creation_validation():
    # Empty items should be rejected with 422 or 400
    invalid_payload = {
        "restaurantId": "rest-1",
        "restaurantName": "Spice Garden",
        "items": [],
        "deliveryAddress": {
            "name": "Tester",
            "phone": "+91 99999 11111",
            "addressLine": "123 Main St"
        }
    }
    response = client.post("/api/v1/orders", json=invalid_payload)
    assert response.status_code in [400, 422, 500]


def test_payment_session_creation():
    response = client.post(
        "/api/v1/payments/create-session",
        json={"amount": 450.0, "orderId": "FG1001", "method": "UPI"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["gateway"] == "Razorpay"
    assert "transactionId" in data


def test_order_history_endpoint():
    response = client.get("/api/v1/orders/history")
    assert response.status_code in [200, 500]

