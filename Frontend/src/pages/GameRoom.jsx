import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import socket from '../socket/socket';
import { initGameSocket } from '../features/game/gameSocket';

const GameRoom = () => {
  const { gameId, status, currentTurnPlayerId } = useSelector(state => state.game);
  const { playerId, gameOwner } = useSelector(state => state.player);

  useEffect(() => {
    if (!socket.connected) socket.connect();
    initGameSocket();
  }, []);

  const handleStartGame = () => {
    socket.emit('startGame', { gameId, playerId}, (res) => {
      if (!res.success) alert(res.error);
    });
  };

  return (
    <div>
      <h2>Game Room</h2>
      <p>Status: {status}</p>
      <p>Your Turn: {playerId === currentTurnPlayerId ? 'Yes' : 'No'}</p>
      {gameOwner && status === 'waiting' && (
        <button onClick={handleStartGame}>Start Game</button>
      )}
    </div>
  );
};

export default GameRoom;
