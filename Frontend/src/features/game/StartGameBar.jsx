// StartGameBar.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { emitStartGame } from './gameEvents'; // re-exported from socket/events

const StartGameBar = () => {
  const game = useSelector((state) => state.game);
  const player = useSelector((state) => state.player);

  const handleStartGame = () => {
    emitStartGame({ gameId: game.gameId, playerId: player.playerId }, (res) => {
      if (!res.success) alert(res.error);
    });
  };

  if (game.status !== 'waiting') return null;

  return (
    <div style={{ padding: '1rem', backgroundColor: '#fefefe', borderBottom: '1px solid #ddd' }}>
      {player.gameOwner ? (
        <button onClick={handleStartGame} style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
          🚀 Start Game
        </button>
      ) : (
        <p>Waiting for host to start the game...</p>
      )}
    </div>
  );
};

export default StartGameBar;
