/**
 * GameStatistics component - Displays game statistics
 *
 * Shows wins, losses, draws, and total games played.
 */

import type { GameStats } from '../types/game';

interface GameStatisticsProps {
  stats: GameStats;
  onReset: () => void;
}

const GameStatistics: React.FC<GameStatisticsProps> = ({ stats, onReset }) => {
  // Calculate win percentage
  const winPercentage = stats.total > 0
    ? Math.round((stats.wins / stats.total) * 100)
    : 0;

  return (
    <div className="stats-section" role="region" aria-label="Game statistics">
      <h3>Your Statistics</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value" style={{ color: 'var(--color-success)' }}>
            {stats.wins}
          </div>
          <div className="stat-label">Wins</div>
        </div>

        <div className="stat-item">
          <div className="stat-value" style={{ color: 'var(--color-danger)' }}>
            {stats.losses}
          </div>
          <div className="stat-label">Losses</div>
        </div>

        <div className="stat-item">
          <div className="stat-value" style={{ color: 'var(--color-warning)' }}>
            {stats.draws}
          </div>
          <div className="stat-label">Draws</div>
        </div>

        <div className="stat-item">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>

        <div className="stat-item">
          <div className="stat-value">{winPercentage}%</div>
          <div className="stat-label">Win Rate</div>
        </div>
      </div>

      {stats.total > 0 && (
        <button
          className="play-again-button"
          onClick={onReset}
          style={{ marginTop: 'var(--spacing-md)' }}
          aria-label="Reset statistics"
        >
          Reset Statistics
        </button>
      )}
    </div>
  );
};

export default GameStatistics;
