"""
Pydantic models for API request and response validation.

These models ensure type safety and automatic validation for all API endpoints.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Literal
from app.core.game import Choice


class PlayRequest(BaseModel):
    """
    Request model for playing a game round.

    Attributes:
        choice: Player's choice (rock, paper, or scissors)
    """
    choice: str = Field(
        ...,
        description="Player's choice: rock, paper, or scissors",
        examples=["rock"]
    )

    @field_validator("choice")
    @classmethod
    def validate_choice(cls, v: str) -> str:
        """
        Validate that the choice is valid.

        Args:
            v: The choice value to validate

        Returns:
            Lowercase validated choice

        Raises:
            ValueError: If choice is not valid
        """
        try:
            Choice.from_string(v)
            return v.lower()
        except ValueError as e:
            raise ValueError(
                f"Invalid choice. Must be one of: rock, paper, scissors"
            ) from e

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "choice": "rock"
                }
            ]
        }
    }


class PlayResponse(BaseModel):
    """
    Response model for a game round result.

    Attributes:
        player_choice: The player's choice
        computer_choice: The computer's choice
        outcome: The game outcome (win, lose, draw)
        message: Human-readable result message
    """
    player_choice: str = Field(..., description="Player's choice")
    computer_choice: str = Field(..., description="Computer's choice")
    outcome: Literal["win", "lose", "draw"] = Field(..., description="Game outcome")
    message: str = Field(..., description="Result message")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "player_choice": "rock",
                    "computer_choice": "scissors",
                    "outcome": "win",
                    "message": "You win! Rock beats Scissors."
                }
            ]
        }
    }


class HealthResponse(BaseModel):
    """
    Response model for health check endpoint.

    Attributes:
        status: Service status
        version: API version
    """
    status: str = Field(..., description="Service status")
    version: str = Field(..., description="API version")


class ChoicesResponse(BaseModel):
    """
    Response model for available choices endpoint.

    Attributes:
        choices: List of valid game choices
    """
    choices: list[str] = Field(..., description="List of valid choices")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "choices": ["rock", "paper", "scissors"]
                }
            ]
        }
    }


class ErrorResponse(BaseModel):
    """
    Standard error response model.

    Attributes:
        detail: Error message
    """
    detail: str = Field(..., description="Error message")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "detail": "Invalid choice. Must be one of: rock, paper, scissors"
                }
            ]
        }
    }
