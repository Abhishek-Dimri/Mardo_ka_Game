// ActionArea.js
import React, { useCallback } from 'react';
import StartGameBar from './StartGameBar';
import { useSelector, useDispatch } from 'react-redux';
import DiceRollButton from '../dice/DiceRollButton';
import socket from '../../socket/socket';
import { addLog } from './gameSlice';

function ActionArea({ onRollDice, rolling }) {
  const dispatch = useDispatch();
  const { status, currentTurnPlayerId, gameId } = useSelector((s) => s.game);
  const player = useSelector((s) => s.player);

  const isMyTurn = currentTurnPlayerId && player.playerId && currentTurnPlayerId === player.playerId;

  const handleClick = useCallback(() => {
    if (!isMyTurn || rolling) return;
    // Emit rollDice to server; server authoritative for value & movement
    socket.emit('rollDice', { gameId, playerId: player.playerId });
  }, [isMyTurn, rolling, gameId, player.playerId]);

  if (status === 'waiting') {
    return <StartGameBar />;
  }

  if (status === 'active') {
    return (
      <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
        <DiceRollButton onClick={handleClick} disabled={!isMyTurn || rolling} />
        {isMyTurn && !rolling && (
          <button onClick={() => socket.emit('endTurn', { gameId, playerId: player.playerId })} style={{padding:'6px 12px'}}>End Turn</button>
        )}
        <div style={{fontSize:'0.85rem', opacity:0.8}}>
          {isMyTurn ? 'Your turn — roll the dice.' : (
            currentTurnPlayerId ? 'Waiting for other player...' : 'Waiting for turn data...'
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', backgroundColor: '#fefefe', borderBottom: '1px solid #ddd' }}>
      <p>Game has ended.</p>
    </div>
  );
}

export default ActionArea;
