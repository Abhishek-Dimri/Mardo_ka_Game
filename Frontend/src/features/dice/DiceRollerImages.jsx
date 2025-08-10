// DiceRollerImages.js
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { addLog } from '../game/gameSlice';
import socket from '../../socket/socket';
import dice1 from "../../assets/dice1.png";
import dice2 from "../../assets/dice2.png";
import dice3 from "../../assets/dice3.png";
import dice4 from "../../assets/dice4.png";
import dice5 from "../../assets/dice5.png";
import dice6 from "../../assets/dice6.png";

const DiceRollerImages = forwardRef((props, ref) => {
  const [rolling, setRolling] = useState(false);
  const [diceFaces, setDiceFaces] = useState([1, 1]);
  const intervalRef = useRef(null);
  const dispatch = useDispatch();

  const diceImages = {
    1: dice1,
    2: dice2,
    3: dice3,
    4: dice4,
    5: dice5,
    6: dice6,
  };

  const rollDice = () => {
    if (rolling) return;
    setRolling(true);
  };

  useImperativeHandle(ref, () => ({
    rollDice,
    rolling,
  }));

  useEffect(() => {
    if (rolling) {
      intervalRef.current = setInterval(() => {
        setDiceFaces([
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1,
        ]);
      }, 100);

      const timeout = setTimeout(() => {
        clearInterval(intervalRef.current);
        const finalFaces = [
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1,
        ];
        setDiceFaces(finalFaces);
        setRolling(false);
        dispatch(addLog({ message: `Rolled ${finalFaces[0]} and ${finalFaces[1]}` }));
      }, 1000);

      return () => {
        clearInterval(intervalRef.current);
        clearTimeout(timeout);
      };
    }
  }, [rolling]);

  // Listen for server diceRolled to sync final outcome
  useEffect(() => {
    const onDiceRolled = ({ playerId, diceValue }) => {
      // Show the server diceValue as first die (simple); could support 2 dice later
      setDiceFaces([diceValue, Math.max(1, Math.min(6, diceValue))]);
    };
    socket.on('diceRolled', onDiceRolled);
    return () => socket.off('diceRolled', onDiceRolled);
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", backgroundColor: "#000" }}>
        <img src={diceImages[diceFaces[0]]} alt="dice1" width={100} height={100} />
        <img src={diceImages[diceFaces[1]]} alt="dice2" width={100} height={100} />
      </div>
    </div>
  );
});

export default DiceRollerImages;
