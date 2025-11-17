/**
 * GameResult component - Displays the result of a game round
 *
 * Shows both choices, the outcome, and a message.
 */

import type { PlayResponse, Choice } from '../types/game';

interface GameResultProps {
  result: PlayResponse;
  choiceIcons: Record<Choice, string>;
}

const GameResult: React.FC<GameResultProps> = ({ result, choiceIcons }) => {
  return (
    <div className={`result-section ${result.outcome}`} role="region" aria-label="Game result">
      <div className="result-choices">
        {/* Player's choice */}
        <div className="result-choice">
          <div className="result-choice-icon">
            {choiceIcons[result.player_choice]}
          </div>
          <div className="result-choice-label">You</div>
          <div>{result.player_choice}</div>
        </div>

        {/* VS separator */}
        <div className="result-vs">VS</div>

        {/* Computer's choice */}
        <div className="result-choice">
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
  );
};

export default GameResult;
