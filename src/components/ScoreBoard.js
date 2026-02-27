import React from 'react';

function ScoreBoard({ players, currentPlayerIndex }) {
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="scoreboard">
      <h2>Scoreboard</h2>
      <ol className="score-list">
        {sorted.map((player, i) => (
          <li 
            key={player.name} 
            className={`score-item rank-${i + 1} ${currentPlayer?.name === player.name ? 'current-player' : ''}`}
          >
            <span className="player-name">
              {currentPlayer?.name === player.name && '▶ '}
              {player.name}
            </span>
            <span className={`player-score ${player.score < 0 ? 'negative' : ''}`}>
              {player.score}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default ScoreBoard;
