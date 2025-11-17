"""
Core game logic for Rock-Paper-Scissors.

This module implements the game rules and logic using OOP principles,
type hints, and immutable data structures following Python best practices.
"""

from enum import Enum
from dataclasses import dataclass
from typing import Literal
import random


class Choice(str, Enum):
    """
    Enumeration of valid game choices.

    Inherits from str to ensure JSON serialization compatibility.
    """
    ROCK = "rock"
    PAPER = "paper"
    SCISSORS = "scissors"

    @classmethod
    def from_string(cls, value: str) -> "Choice":
        """
        Convert a string to a Choice enum.

        Args:
            value: String representation of the choice

        Returns:
            Choice enum value

        Raises:
            ValueError: If the value is not a valid choice
        """
        try:
            return cls(value.lower())
        except ValueError as e:
            valid_choices = [choice.value for choice in cls]
            raise ValueError(
                f"Invalid choice: {value}. Must be one of {valid_choices}"
            ) from e


class GameOutcome(str, Enum):
    """Enumeration of possible game outcomes."""
    WIN = "win"
    LOSE = "lose"
    DRAW = "draw"


@dataclass(frozen=True)
class GameResult:
    """
    Immutable data class representing a game round result.

    Attributes:
        player_choice: The choice made by the player
        computer_choice: The choice made by the computer
        outcome: The outcome from the player's perspective
        message: Human-readable message describing the result
    """
    player_choice: Choice
    computer_choice: Choice
    outcome: GameOutcome
    message: str

    def to_dict(self) -> dict[str, str]:
        """
        Convert the result to a dictionary for JSON serialization.

        Returns:
            Dictionary representation of the game result
        """
        return {
            "player_choice": self.player_choice.value,
            "computer_choice": self.computer_choice.value,
            "outcome": self.outcome.value,
            "message": self.message
        }


class RockPaperScissorsGame:
    """
    Rock-Paper-Scissors game implementation.

    This class encapsulates the game logic using a rule-based approach.
    The game is stateless - each play is independent.
    """

    # Game rules: key beats all values in the set
    _WINNING_RULES: dict[Choice, set[Choice]] = {
        Choice.ROCK: {Choice.SCISSORS},
        Choice.PAPER: {Choice.ROCK},
        Choice.SCISSORS: {Choice.PAPER}
    }

    def __init__(self, seed: int | None = None) -> None:
        """
        Initialize the game.

        Args:
            seed: Optional random seed for reproducible computer choices (useful for testing)
        """
        self._random = random.Random(seed)

    def play(
        self,
        player_choice: Choice | str
    ) -> GameResult:
        """
        Play a single round of Rock-Paper-Scissors.

        Args:
            player_choice: The player's choice (Choice enum or string)

        Returns:
            GameResult containing the outcome and details

        Raises:
            ValueError: If player_choice is invalid
        """
        # Convert string to Choice if needed
        if isinstance(player_choice, str):
            player_choice = Choice.from_string(player_choice)

        # Generate computer's choice
        computer_choice = self._get_computer_choice()

        # Determine outcome
        outcome = self._determine_outcome(player_choice, computer_choice)

        # Generate message
        message = self._generate_message(player_choice, computer_choice, outcome)

        return GameResult(
            player_choice=player_choice,
            computer_choice=computer_choice,
            outcome=outcome,
            message=message
        )

    def _get_computer_choice(self) -> Choice:
        """
        Generate a random choice for the computer.

        Returns:
            Random Choice from available options
        """
        return self._random.choice(list(Choice))

    def _determine_outcome(
        self,
        player_choice: Choice,
        computer_choice: Choice
    ) -> GameOutcome:
        """
        Determine the outcome of a game round.

        Args:
            player_choice: The player's choice
            computer_choice: The computer's choice

        Returns:
            GameOutcome from the player's perspective
        """
        if player_choice == computer_choice:
            return GameOutcome.DRAW

        if computer_choice in self._WINNING_RULES[player_choice]:
            return GameOutcome.WIN

        return GameOutcome.LOSE

    def _generate_message(
        self,
        player_choice: Choice,
        computer_choice: Choice,
        outcome: GameOutcome
    ) -> str:
        """
        Generate a human-readable message for the game result.

        Args:
            player_choice: The player's choice
            computer_choice: The computer's choice
            outcome: The game outcome

        Returns:
            Formatted message string
        """
        choice_display = {
            Choice.ROCK: "Rock",
            Choice.PAPER: "Paper",
            Choice.SCISSORS: "Scissors"
        }

        player = choice_display[player_choice]
        computer = choice_display[computer_choice]

        if outcome == GameOutcome.DRAW:
            return f"It's a draw! Both chose {player}."

        if outcome == GameOutcome.WIN:
            return f"You win! {player} beats {computer}."

        return f"You lose! {computer} beats {player}."

    @staticmethod
    def get_valid_choices() -> list[str]:
        """
        Get a list of valid choice strings.

        Returns:
            List of valid choice values
        """
        return [choice.value for choice in Choice]
