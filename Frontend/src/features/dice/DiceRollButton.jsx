// DiceRollButton.js
import React from "react";

const DiceRollButton = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ fontSize: "20px", padding: "10px 20px", cursor: "pointer" }}
    >
      {disabled ? "Rolling..." : "Roll Dice"}
    </button>
  );
};

export default DiceRollButton;
