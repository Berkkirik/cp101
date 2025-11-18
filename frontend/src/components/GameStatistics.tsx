/**
 * GameStatistics component - Displays game statistics
 *
 * Shows wins, losses, draws, and total games played with animated counters.
 */

import { useEffect, useState, useRef } from 'react';
import type { GameStats } from '../types/game';

interface GameStatisticsProps {
  stats: GameStats;
  onReset: () => void;
  playSound: (soundType: 'hover' | 'click' | 'battle' | 'win' | 'lose' | 'draw' | 'stat', delay?: number) => void;
}

const MILESTONES = [5, 10, 25, 50, 100];

const GameStatistics: React.FC<GameStatisticsProps> = ({ stats, onReset, playSound }) => {
  const [animatingStats, setAnimatingStats] = useState<Set<string>>(new Set());
  const [milestoneReached, setMilestoneReached] = useState(false);
  const prevStatsRef = useRef<GameStats>(stats);

  // Calculate win percentage
  const winPercentage = stats.total > 0
    ? Math.round((stats.wins / stats.total) * 100)
    : 0;

  useEffect(() => {
    // Detect which stats changed
    const changed = new Set<string>();
    if (stats.wins !== prevStatsRef.current.wins) {
      changed.add('wins');
      playSound('stat');
    }
    if (stats.losses !== prevStatsRef.current.losses) {
      changed.add('losses');
      playSound('stat');
    }
    if (stats.draws !== prevStatsRef.current.draws) {
      changed.add('draws');
      playSound('stat');
    }
    if (stats.total !== prevStatsRef.current.total) {
      changed.add('total');

      // Check for milestone
      if (MILESTONES.includes(stats.total)) {
        setMilestoneReached(true);
        setTimeout(() => setMilestoneReached(false), 1000);
      }
    }

    setAnimatingStats(changed);

    // Clear animation classes after animation completes
    const timer = setTimeout(() => setAnimatingStats(new Set()), 500);

    prevStatsRef.current = stats;

    return () => clearTimeout(timer);
  }, [stats, playSound]);

  const getStatItemClass = (statKey: string, isMilestone = false) => {
    const classes = ['stat-item'];
    if (animatingStats.has(statKey)) classes.push('updating');
    if (isMilestone && milestoneReached) classes.push('milestone');
    return classes.join(' ');
  };

  return (
    <div className="stats-section" role="region" aria-label="Game statistics">
      <h3>Your Statistics</h3>
      <div className="stats-grid">
        <div className={getStatItemClass('wins')}>
          <div
            className={`stat-value ${animatingStats.has('wins') ? 'rolling' : ''}`}
            style={{ color: 'var(--color-success)' }}
          >
            {stats.wins}
          </div>
          <div className="stat-label">Wins</div>
        </div>

        <div className={getStatItemClass('losses')}>
          <div
            className={`stat-value ${animatingStats.has('losses') ? 'rolling' : ''}`}
            style={{ color: 'var(--color-danger)' }}
          >
            {stats.losses}
          </div>
          <div className="stat-label">Losses</div>
        </div>

        <div className={getStatItemClass('draws')}>
          <div
            className={`stat-value ${animatingStats.has('draws') ? 'rolling' : ''}`}
            style={{ color: 'var(--color-warning)' }}
          >
            {stats.draws}
          </div>
          <div className="stat-label">Draws</div>
        </div>

        <div className={getStatItemClass('total', true)}>
          <div className={`stat-value ${animatingStats.has('total') ? 'rolling' : ''}`}>
            {stats.total}
          </div>
          <div className="stat-label">Total</div>
          {milestoneReached && (
            <div style={{ fontSize: '2rem', marginTop: '0.5rem' }}>🎉</div>
          )}
        </div>

        <div className="stat-item">
          <div className="stat-value">{winPercentage}%</div>
          <div className="stat-label">Win Rate</div>
          <div className="win-percentage-bar">
            <div
              className="progress"
              style={{ width: `${winPercentage}%` }}
              role="progressbar"
              aria-valuenow={winPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      </div>

      {stats.total > 0 && (
        <button
          className="reset-button"
          onClick={onReset}
          onMouseEnter={() => playSound('hover')}
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
