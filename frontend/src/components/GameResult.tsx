/**
 * GameResult component - Displays the result of a game round
 *
 * Shows both choices, the outcome, and a message with enhanced animations.
 */

import { useEffect, useState } from 'react';
import type { PlayResponse, Choice } from '../types/game';

interface GameResultProps {
  result: PlayResponse;
  choiceIcons: Record<Choice, string>;
  battlePhase: boolean;
}

const GameResult: React.FC<GameResultProps> = ({ result, choiceIcons, battlePhase }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Show confetti for wins
    if (result.outcome === 'win') {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [result.outcome]);

  // Determine animation classes
  const getChoiceClass = (isPlayer: boolean) => {
    const baseClass = isPlayer ? 'player-choice' : 'computer-choice';
    const outcomeClass =
      result.outcome === 'win'
        ? isPlayer
          ? 'winner'
          : 'loser'
        : result.outcome === 'lose'
        ? isPlayer
          ? 'loser'
          : 'winner'
        : 'draw-shake';

    return `result-choice ${baseClass} ${outcomeClass}`;
  };

  return (
    <>
      {/* Confetti for wins */}
      {showConfetti && (
        <div className="confetti-container" aria-hidden="true">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className={`confetti color-${(i % 5) + 1}`}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div
        className={`result-section ${result.outcome} ${battlePhase ? 'battle-shake' : ''}`}
        role="region"
        aria-label="Game result"
      >
        {/* Flash effect for collision */}
        <div className={`collision-flash ${battlePhase ? 'active' : ''}`} />

        <div className="result-choices">
          {/* Player's choice */}
          <div className={getChoiceClass(true)}>
            <div className="result-choice-icon">
              {choiceIcons[result.player_choice]}
            </div>
            <div className="result-choice-label">You</div>
            <div>{result.player_choice}</div>
          </div>

          {/* VS separator */}
          <div className="result-vs">VS</div>

          {/* Computer's choice */}
          <div className={getChoiceClass(false)}>
            <div className="result-choice-icon">
              {choiceIcons[result.computer_choice]}
            </div>
            <div className="result-choice-label">Computer</div>
            <div>{result.computer_choice}</div>
          </div>
        </div>

        {/* Result message */}
        <div className={`result-message ${result.outcome}`}>
          {result.message}
        </div>
      </div>
    </>
  );
};

export default GameResult;
