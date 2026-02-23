import React, { useState } from 'react';

function PlayerSetup({ onStart }) {
  const [players, setPlayers] = useState([
    { id: 1, name: '' },
    { id: 2, name: '' },
  ]);
  const [nextId, setNextId] = useState(3);
  const [error, setError] = useState('');

  const handleNameChange = (id, value) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: value } : p))
    );
  };

  const addPlayer = () => {
    if (players.length < 6) {
      setPlayers((prev) => [...prev, { id: nextId, name: '' }]);
      setNextId((n) => n + 1);
    }
  };

  const removePlayer = (id) => {
    if (players.length > 1) {
      setPlayers((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleStart = () => {
    const trimmed = players
      .map((p) => p.name.trim())
      .filter((name) => name.length > 0);
    if (trimmed.length === 0) {
      setError('Please enter at least one player name.');
      return;
    }
    const unique = [...new Set(trimmed)];
    if (unique.length !== trimmed.length) {
      setError('Player names must be unique.');
      return;
    }
    onStart(trimmed.map((name) => ({ name, score: 0 })));
  };

  return (
    <div className="player-setup">
      <h2>Players</h2>
      {players.map((player, i) => (
        <div key={player.id} className="player-row">
          <input
            type="text"
            placeholder={`Player ${i + 1}`}
            value={player.name}
            onChange={(e) => handleNameChange(player.id, e.target.value)}
            maxLength={30}
          />
          {players.length > 1 && (
            <button className="remove-btn" onClick={() => removePlayer(player.id)}>
              ✕
            </button>
          )}
        </div>
      ))}
      {players.length < 6 && (
        <button className="add-player-btn" onClick={addPlayer}>
          + Add Player
        </button>
      )}
      {error && <p className="error">{error}</p>}
      <button className="start-btn" onClick={handleStart}>
        Start Game
      </button>
    </div>
  );
}

export default PlayerSetup;
