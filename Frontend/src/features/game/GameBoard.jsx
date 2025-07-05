
import BoardLayout from '../../layouts/BoardLayout';
import DiceArea from './DiceArea'; // Make a simple component or placeholder
import ActionArea from './ActionArea'; // ActionArea
import GameBoardContent from './GameBoardContent'; // Your original tile rendering
import Logs from './Logs'; // Optional log area

const GameBoard = () => {

  return (
    <BoardLayout
      diceArea={<DiceArea />}
      actionArea={<ActionArea />}
      gameBoard={<GameBoardContent />}
      logs={<Logs />}
    />
  );
};

export default GameBoard;
