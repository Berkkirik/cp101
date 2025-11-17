"""
API routes for Rock-Paper-Scissors game.

This module defines all REST API endpoints with proper error handling,
validation, and documentation.
"""

from fastapi import APIRouter, HTTPException, status
from app.core.game import RockPaperScissorsGame
from app.models.schemas import (
    PlayRequest,
    PlayResponse,
    ChoicesResponse,
    ErrorResponse
)

# Create router instance
router = APIRouter(prefix="/api/v1", tags=["game"])

# Game instance (stateless, can be shared)
game = RockPaperScissorsGame()


@router.post(
    "/play",
    response_model=PlayResponse,
    status_code=status.HTTP_200_OK,
    summary="Play a round of Rock-Paper-Scissors",
    description="Submit your choice and get the game result",
    responses={
        200: {
            "description": "Successful game round",
            "model": PlayResponse
        },
        400: {
            "description": "Invalid choice provided",
            "model": ErrorResponse
        },
        422: {
            "description": "Validation error",
            "model": ErrorResponse
        }
    }
)
async def play_game(request: PlayRequest) -> PlayResponse:
    """
    Play a single round of Rock-Paper-Scissors.

    Args:
        request: PlayRequest containing the player's choice

    Returns:
        PlayResponse with game result

    Raises:
        HTTPException: If the choice is invalid (400)
    """
    try:
        result = game.play(request.choice)
        return PlayResponse(**result.to_dict())
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        ) from e


@router.get(
    "/choices",
    response_model=ChoicesResponse,
    status_code=status.HTTP_200_OK,
    summary="Get valid choices",
    description="Retrieve list of valid game choices"
)
async def get_choices() -> ChoicesResponse:
    """
    Get list of valid game choices.

    Returns:
        ChoicesResponse containing list of valid choices
    """
    return ChoicesResponse(choices=game.get_valid_choices())
