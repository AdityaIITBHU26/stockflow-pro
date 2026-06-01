def test_create_product_success(client):
    payload = {
        "name": "Test Product",
        "sku": "TST123",
        "description": "A test product",
        "category": "Test",
        "price": 19.99,
        "quantity_in_stock": 100
    }
    response = client.post("/api/v1/products", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["data"]["sku"] == "TST123"

def test_create_duplicate_sku(client):
    payload = {
        "name": "Duplicate",
        "sku": "DUP001",
        "price": 10.0,
        "quantity_in_stock": 5
    }
    client.post("/api/v1/products", json=payload)
    response = client.post("/api/v1/products", json=payload)
    assert response.status_code == 409

def test_get_products_pagination(client):
    for i in range(10):
        client.post("/api/v1/products", json={
            "name": f"Product {i}", "sku": f"SKU{i}", "price": 10.0, "quantity_in_stock": i
        })
    response = client.get("/api/v1/products?page=1&limit=5")
    data = response.json()
    assert data["total"] == 10
    assert len(data["data"]) == 5
    assert data["page"] == 1