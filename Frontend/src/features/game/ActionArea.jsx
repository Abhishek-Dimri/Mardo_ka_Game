// ActionArea.js
import React from 'react';
import StartGameBar from './StartGameBar';
import { useSelector } from 'react-redux';
import DiceRollButton from '../dice/DiceRollButton';

function ActionArea({ onRollDice, rolling }) {
  const gameStatus = useSelector((state) => state.game.status);

  if (gameStatus === 'waiting') {
    return <StartGameBar />;
  }

  if (gameStatus === 'active') {
    return <DiceRollButton onClick={onRollDice} disabled={rolling} />;
  }

  return (
    <div style={{ padding: '1rem', backgroundColor: '#fefefe', borderBottom: '1px solid #ddd' }}>
      <p>Game has ended.</p>
    </div>
  );
}

export default ActionArea;
