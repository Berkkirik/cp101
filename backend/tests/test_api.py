"""
API endpoint tests for Rock-Paper-Scissors game.

Tests all API endpoints with various scenarios using FastAPI TestClient.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestHealthEndpoint:
    """Tests for health check endpoint."""

    def test_health_check(self):
        """Test health check returns correct status."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "version" in data


class TestRootEndpoint:
    """Tests for root endpoint."""

    def test_root(self):
        """Test root endpoint returns API information."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "version" in data
        assert "docs" in data


class TestChoicesEndpoint:
    """Tests for choices endpoint."""

    def test_get_choices(self):
        """Test getting valid choices."""
        response = client.get("/api/v1/choices")
        assert response.status_code == 200
        data = response.json()
        assert "choices" in data
        assert len(data["choices"]) == 3
        assert "rock" in data["choices"]
        assert "paper" in data["choices"]
        assert "scissors" in data["choices"]


class TestPlayEndpoint:
    """Tests for play game endpoint."""

    def test_play_with_rock(self):
        """Test playing with rock choice."""
        response = client.post("/api/v1/play", json={"choice": "rock"})
        assert response.status_code == 200
        data = response.json()
        assert data["player_choice"] == "rock"
        assert data["computer_choice"] in ["rock", "paper", "scissors"]
        assert data["outcome"] in ["win", "lose", "draw"]
        assert len(data["message"]) > 0

    def test_play_with_paper(self):
        """Test playing with paper choice."""
        response = client.post("/api/v1/play", json={"choice": "paper"})
        assert response.status_code == 200
        data = response.json()
        assert data["player_choice"] == "paper"

    def test_play_with_scissors(self):
        """Test playing with scissors choice."""
        response = client.post("/api/v1/play", json={"choice": "scissors"})
        assert response.status_code == 200
        data = response.json()
        assert data["player_choice"] == "scissors"

    def test_play_case_insensitive(self):
        """Test that choices are case-insensitive."""
        for choice in ["ROCK", "Rock", "rock"]:
            response = client.post("/api/v1/play", json={"choice": choice})
            assert response.status_code == 200
            data = response.json()
            assert data["player_choice"] == "rock"

    def test_play_invalid_choice(self):
        """Test playing with invalid choice returns error."""
        response = client.post("/api/v1/play", json={"choice": "invalid"})
        assert response.status_code == 422  # Pydantic validation error
        data = response.json()
        assert "detail" in data

    def test_play_empty_choice(self):
        """Test playing with empty choice returns error."""
        response = client.post("/api/v1/play", json={"choice": ""})
        assert response.status_code == 422  # Pydantic validation error

    def test_play_missing_choice(self):
        """Test playing without choice field returns validation error."""
        response = client.post("/api/v1/play", json={})
        assert response.status_code == 422

    def test_play_response_structure(self):
        """Test that response has correct structure."""
        response = client.post("/api/v1/play", json={"choice": "rock"})
        assert response.status_code == 200
        data = response.json()

        # Check all required fields are present
        required_fields = ["player_choice", "computer_choice", "outcome", "message"]
        for field in required_fields:
            assert field in data

    def test_play_outcome_consistency(self):
        """Test that outcome is consistent with choices."""
        # Test multiple rounds to check consistency
        for _ in range(10):
            response = client.post("/api/v1/play", json={"choice": "rock"})
            data = response.json()

            player = data["player_choice"]
            computer = data["computer_choice"]
            outcome = data["outcome"]

            # Check outcome is correct based on choices
            if player == computer:
                assert outcome == "draw"
            elif (player == "rock" and computer == "scissors") or \
                 (player == "paper" and computer == "rock") or \
                 (player == "scissors" and computer == "paper"):
                assert outcome == "win"
            else:
                assert outcome == "lose"


class TestAPIDocumentation:
    """Tests for API documentation endpoints."""

    def test_openapi_schema(self):
        """Test that OpenAPI schema is accessible."""
        response = client.get("/openapi.json")
        assert response.status_code == 200
        schema = response.json()
        assert "openapi" in schema
        assert "info" in schema
        assert "paths" in schema

    def test_docs_accessible(self):
        """Test that Swagger UI docs are accessible."""
        response = client.get("/docs")
        assert response.status_code == 200

    def test_redoc_accessible(self):
        """Test that ReDoc is accessible."""
        response = client.get("/redoc")
        assert response.status_code == 200
