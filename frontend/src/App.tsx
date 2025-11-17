/**
 * Main App component
 *
 * Root component that sets up the application structure.
 */

import { useEffect, useState } from 'react';
import GameBoard from './components/GameBoard';
import { gameApi } from './services/api';
import './styles/App.css';

function App() {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    // Check backend health on mount
    const checkBackend = async () => {
      const isHealthy = await gameApi.healthCheck();
      setBackendStatus(isHealthy ? 'online' : 'offline');
    };

    checkBackend();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>🪨 Rock Paper Scissors ✂️</h1>
        <p>Test your luck against the computer!</p>
        {backendStatus === 'offline' && (
          <div className="error-message" style={{ marginTop: 'var(--spacing-md)' }}>
            Backend is offline. Please start the Python backend server.
          </div>
        )}
      </header>

      <main>
        {backendStatus === 'checking' ? (
          <div className="loading">Connecting to server...</div>
        ) : backendStatus === 'online' ? (
          <GameBoard />
        ) : (
          <div className="game-container">
            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
              Please start the backend server at <code>http://localhost:8000</code>
            </p>
            <p style={{ textAlign: 'center', marginTop: 'var(--spacing-md)' }}>
              Run: <code>cd backend && python -m app.main</code>
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
