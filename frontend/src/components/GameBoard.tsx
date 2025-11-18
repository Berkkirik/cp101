/**
 * GameBoard component - Main game interface
 *
 * Handles game state, user interactions, and displays results.
 */

import { useState, useEffect } from 'react';
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

interface GameBoardProps {
  playSound: (soundType: 'hover' | 'click' | 'battle' | 'win' | 'lose' | 'draw' | 'stat', delay?: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ playSound }) => {
  const [result, setResult] = useState<PlayResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [battlePhase, setBattlePhase] = useState(false);
  const [stats, setStats] = useState<GameStats>({
    wins: 0,
    losses: 0,
    draws: 0,
    total: 0,
  });

  /**
   * Handle player's choice and play a round with animations
   */
  const handleChoice = async (choice: Choice) => {
    setLoading(true);
    setError(null);
    setSelectedChoice(choice);

    // Play click sound
    playSound('click');

    // Wait a bit for selection animation
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const gameResult = await gameApi.play(choice);

      // Battle phase animation
      setBattlePhase(true);
      playSound('battle');

      // Wait for battle animation
      await new Promise(resolve => setTimeout(resolve, 800));

      setResult(gameResult);
      setBattlePhase(false);

      // Play result sound after a short delay
      setTimeout(() => {
        playSound(gameResult.outcome);
      }, 200);

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
      setSelectedChoice(null);
      setBattlePhase(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset the game for a new round
   */
  const handlePlayAgain = () => {
    playSound('click');
    setResult(null);
    setError(null);
    setSelectedChoice(null);
  };

  /**
   * Reset all statistics
   */
  const handleResetStats = () => {
    playSound('click');
    setStats({
      wins: 0,
      losses: 0,
      draws: 0,
      total: 0,
    });
    setResult(null);
    setError(null);
    setSelectedChoice(null);
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
              className={`choice-button ${selectedChoice === choice ? 'selected' : ''}`}
              onClick={() => handleChoice(choice)}
              onMouseEnter={() => playSound('hover')}
              disabled={loading || !!result}
              aria-label={`Choose ${choice}`}
            >
              <span className="choice-emoji">{CHOICE_ICONS[choice]}</span>
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
          <GameResult result={result} choiceIcons={CHOICE_ICONS} battlePhase={battlePhase} />
          <button
            className="play-again-button"
            onClick={handlePlayAgain}
            onMouseEnter={() => playSound('hover')}
            aria-label="Play again"
          >
            Play Again
          </button>
        </>
      )}

      {/* Statistics */}
      <GameStatistics stats={stats} onReset={handleResetStats} playSound={playSound} />
    </div>
  );
};

export default GameBoard;
