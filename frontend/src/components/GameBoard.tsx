/**
 * GameBoard component - Main game interface
 *
 * Handles game state, user interactions, and displays results.
 */

import { useState } from 'react';
import type { Choice, PlayResponse, GameStats } from '../types/game';
import { gameApi, ApiError } from '../services/api';
import GameResult from './GameResult';
import GameStatistics from './GameStatistics';

/**
 * Emoji icons for each choice
 */
const CHOICE_ICONS: Record<Choice, string> = {
  rock: '🪨',
  paper: '📄',
  scissors: '✂️',
};

const GameBoard: React.FC = () => {
  const [result, setResult] = useState<PlayResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<GameStats>({
    wins: 0,
    losses: 0,
    draws: 0,
    total: 0,
  });

  /**
   * Handle player's choice and play a round
   */
  const handleChoice = async (choice: Choice) => {
    setLoading(true);
    setError(null);

    try {
      const gameResult = await gameApi.play(choice);
      setResult(gameResult);

      // Update statistics
      setStats((prevStats) => ({
        wins: prevStats.wins + (gameResult.outcome === 'win' ? 1 : 0),
        losses: prevStats.losses + (gameResult.outcome === 'lose' ? 1 : 0),
        draws: prevStats.draws + (gameResult.outcome === 'draw' ? 1 : 0),
        total: prevStats.total + 1,
      }));
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Game error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset the game for a new round
   */
  const handlePlayAgain = () => {
    setResult(null);
    setError(null);
  };

  /**
   * Reset all statistics
   */
  const handleResetStats = () => {
    setStats({
      wins: 0,
      losses: 0,
      draws: 0,
      total: 0,
    });
    setResult(null);
    setError(null);
  };

  return (
    <div className="game-container">
      {/* Error message */}
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {/* Game choices */}
      <div className="choices-section">
        <h2>Choose Your Weapon</h2>
        <div className="choices-grid">
          {(Object.keys(CHOICE_ICONS) as Choice[]).map((choice) => (
            <button
              key={choice}
              className="choice-button"
              onClick={() => handleChoice(choice)}
              disabled={loading || !!result}
              aria-label={`Choose ${choice}`}
            >
              {CHOICE_ICONS[choice]}
              <span>{choice}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && <div className="loading">Playing...</div>}

      {/* Game result */}
      {result && !loading && (
        <>
          <GameResult result={result} choiceIcons={CHOICE_ICONS} />
          <button
            className="play-again-button"
            onClick={handlePlayAgain}
            aria-label="Play again"
          >
            Play Again
          </button>
        </>
      )}

      {/* Statistics */}
      <GameStatistics stats={stats} onReset={handleResetStats} />
    </div>
  );
};

export default GameBoard;
