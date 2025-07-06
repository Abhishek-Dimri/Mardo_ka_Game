// GameBoard.js
import React, { useRef } from 'react';
import BoardLayout from '../../layouts/BoardLayout';
import ActionArea from './ActionArea';
import GameBoardContent from './GameBoardContent';
import Logs from './Logs';
import DiceRollerImages from '../dice/DiceRollerImages';

const GameBoard = () => {
  const diceRef = useRef();

  const handleRollDice = () => {
    if (diceRef.current) {
      diceRef.current.rollDice();
    }
  };

  const rolling = diceRef.current?.rolling ?? false;

  return (
    <BoardLayout
      diceArea={<DiceRollerImages ref={diceRef} />}
      actionArea={<ActionArea onRollDice={handleRollDice} rolling={rolling} />}
      gameBoard={<GameBoardContent />}
      logs={<Logs />}
    />
  );
};

export default GameBoard;
