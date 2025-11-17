"""
Unit tests for Rock-Paper-Scissors game logic.

Tests cover all game scenarios including edge cases and error handling.
"""

import pytest
from app.core.game import (
    RockPaperScissorsGame,
    Choice,
    GameOutcome,
    GameResult
)


class TestChoice:
    """Tests for the Choice enum."""

    def test_choice_values(self):
        """Test that all expected choices exist."""
        assert Choice.ROCK.value == "rock"
        assert Choice.PAPER.value == "paper"
        assert Choice.SCISSORS.value == "scissors"

    def test_from_string_valid(self):
        """Test conversion from valid strings."""
        assert Choice.from_string("rock") == Choice.ROCK
        assert Choice.from_string("ROCK") == Choice.ROCK
        assert Choice.from_string("Rock") == Choice.ROCK
        assert Choice.from_string("paper") == Choice.PAPER
        assert Choice.from_string("scissors") == Choice.SCISSORS

    def test_from_string_invalid(self):
        """Test that invalid strings raise ValueError."""
        with pytest.raises(ValueError, match="Invalid choice"):
            Choice.from_string("invalid")

        with pytest.raises(ValueError, match="Invalid choice"):
            Choice.from_string("")


class TestGameResult:
    """Tests for the GameResult dataclass."""

    def test_game_result_immutable(self):
        """Test that GameResult is immutable (frozen)."""
        result = GameResult(
            player_choice=Choice.ROCK,
            computer_choice=Choice.SCISSORS,
            outcome=GameOutcome.WIN,
            message="You win!"
        )

        with pytest.raises(AttributeError):
            result.outcome = GameOutcome.LOSE

    def test_to_dict(self):
        """Test conversion to dictionary."""
        result = GameResult(
            player_choice=Choice.ROCK,
            computer_choice=Choice.SCISSORS,
            outcome=GameOutcome.WIN,
            message="You win! Rock beats Scissors."
        )

        result_dict = result.to_dict()

        assert result_dict["player_choice"] == "rock"
        assert result_dict["computer_choice"] == "scissors"
        assert result_dict["outcome"] == "win"
        assert "Rock beats Scissors" in result_dict["message"]


class TestRockPaperScissorsGame:
    """Tests for the main game logic."""

    @pytest.fixture
    def game(self):
        """Create a game instance with a fixed seed for testing."""
        return RockPaperScissorsGame(seed=42)

    def test_get_valid_choices(self):
        """Test retrieval of valid choices."""
        choices = RockPaperScissorsGame.get_valid_choices()
        assert len(choices) == 3
        assert "rock" in choices
        assert "paper" in choices
        assert "scissors" in choices

    def test_play_with_enum(self, game):
        """Test playing with Choice enum."""
        result = game.play(Choice.ROCK)
        assert isinstance(result, GameResult)
        assert result.player_choice == Choice.ROCK
        assert result.computer_choice in [Choice.ROCK, Choice.PAPER, Choice.SCISSORS]
        assert result.outcome in [GameOutcome.WIN, GameOutcome.LOSE, GameOutcome.DRAW]
        assert isinstance(result.message, str)
        assert len(result.message) > 0

    def test_play_with_string(self, game):
        """Test playing with string choice."""
        result = game.play("rock")
        assert result.player_choice == Choice.ROCK

    def test_play_with_invalid_choice(self, game):
        """Test that invalid choices raise ValueError."""
        with pytest.raises(ValueError, match="Invalid choice"):
            game.play("invalid")

    def test_rock_beats_scissors(self):
        """Test that rock beats scissors."""
        game = RockPaperScissorsGame(seed=100)
        # We'll test the logic directly
        player = Choice.ROCK
        computer = Choice.SCISSORS
        outcome = game._determine_outcome(player, computer)
        assert outcome == GameOutcome.WIN

    def test_paper_beats_rock(self):
        """Test that paper beats rock."""
        game = RockPaperScissorsGame()
        player = Choice.PAPER
        computer = Choice.ROCK
        outcome = game._determine_outcome(player, computer)
        assert outcome == GameOutcome.WIN

    def test_scissors_beats_paper(self):
        """Test that scissors beats paper."""
        game = RockPaperScissorsGame()
        player = Choice.SCISSORS
        computer = Choice.PAPER
        outcome = game._determine_outcome(player, computer)
        assert outcome == GameOutcome.WIN

    def test_draw_conditions(self):
        """Test all draw conditions."""
        game = RockPaperScissorsGame()

        assert game._determine_outcome(Choice.ROCK, Choice.ROCK) == GameOutcome.DRAW
        assert game._determine_outcome(Choice.PAPER, Choice.PAPER) == GameOutcome.DRAW
        assert game._determine_outcome(Choice.SCISSORS, Choice.SCISSORS) == GameOutcome.DRAW

    def test_all_losing_conditions(self):
        """Test all losing conditions."""
        game = RockPaperScissorsGame()

        # Rock loses to Paper
        assert game._determine_outcome(Choice.ROCK, Choice.PAPER) == GameOutcome.LOSE

        # Paper loses to Scissors
        assert game._determine_outcome(Choice.PAPER, Choice.SCISSORS) == GameOutcome.LOSE

        # Scissors loses to Rock
        assert game._determine_outcome(Choice.SCISSORS, Choice.ROCK) == GameOutcome.LOSE

    def test_message_win(self):
        """Test win message format."""
        game = RockPaperScissorsGame()
        message = game._generate_message(Choice.ROCK, Choice.SCISSORS, GameOutcome.WIN)
        assert "win" in message.lower()
        assert "Rock" in message
        assert "Scissors" in message

    def test_message_lose(self):
        """Test lose message format."""
        game = RockPaperScissorsGame()
        message = game._generate_message(Choice.ROCK, Choice.PAPER, GameOutcome.LOSE)
        assert "lose" in message.lower()
        assert "Paper" in message
        assert "Rock" in message

    def test_message_draw(self):
        """Test draw message format."""
        game = RockPaperScissorsGame()
        message = game._generate_message(Choice.ROCK, Choice.ROCK, GameOutcome.DRAW)
        assert "draw" in message.lower()
        assert "Rock" in message

    def test_computer_choice_randomness(self):
        """Test that computer makes varied choices."""
        game = RockPaperScissorsGame()
        choices = set()

        # Play multiple rounds
        for _ in range(50):
            result = game.play(Choice.ROCK)
            choices.add(result.computer_choice)

        # Should have seen multiple different choices
        assert len(choices) > 1

    def test_seeded_game_reproducibility(self):
        """Test that seeded games produce same results."""
        game1 = RockPaperScissorsGame(seed=12345)
        game2 = RockPaperScissorsGame(seed=12345)

        for _ in range(10):
            result1 = game1.play(Choice.ROCK)
            result2 = game2.play(Choice.ROCK)
            assert result1.computer_choice == result2.computer_choice


class TestIntegration:
    """Integration tests for complete game flow."""

    def test_full_game_round(self):
        """Test a complete game round."""
        game = RockPaperScissorsGame()

        for choice in [Choice.ROCK, Choice.PAPER, Choice.SCISSORS]:
            result = game.play(choice)

            # Verify result structure
            assert result.player_choice == choice
            assert result.computer_choice in [Choice.ROCK, Choice.PAPER, Choice.SCISSORS]
            assert result.outcome in [GameOutcome.WIN, GameOutcome.LOSE, GameOutcome.DRAW]
            assert len(result.message) > 0

            # Verify consistency between outcome and choices
            if result.player_choice == result.computer_choice:
                assert result.outcome == GameOutcome.DRAW
            elif (
                (result.player_choice == Choice.ROCK and result.computer_choice == Choice.SCISSORS) or
                (result.player_choice == Choice.PAPER and result.computer_choice == Choice.ROCK) or
                (result.player_choice == Choice.SCISSORS and result.computer_choice == Choice.PAPER)
            ):
                assert result.outcome == GameOutcome.WIN
            else:
                assert result.outcome == GameOutcome.LOSE

    def test_case_insensitive_play(self):
        """Test that string inputs are case-insensitive."""
        game = RockPaperScissorsGame()

        result1 = game.play("rock")
        result2 = game.play("ROCK")
        result3 = game.play("Rock")

        assert result1.player_choice == Choice.ROCK
        assert result2.player_choice == Choice.ROCK
        assert result3.player_choice == Choice.ROCK
