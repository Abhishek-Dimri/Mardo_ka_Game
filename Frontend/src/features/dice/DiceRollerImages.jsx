// DiceRollerImages.js
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
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
        setDiceFaces([
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1,
        ]);
        setRolling(false);
      }, 1000);

      return () => {
        clearInterval(intervalRef.current);
        clearTimeout(timeout);
      };
    }
  }, [rolling]);

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
