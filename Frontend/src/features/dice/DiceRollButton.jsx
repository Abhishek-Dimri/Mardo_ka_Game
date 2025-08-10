// DiceRollButton.js
import React from "react";

// Provide both named and default exports to avoid module resolution issues in hot reload.
export const DiceRollButton = React.memo(({ onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{ fontSize: "20px", padding: "10px 20px", cursor: disabled ? 'not-allowed' : 'pointer' }}
  >
    {disabled ? "Rolling..." : "Roll Dice"}
  </button>
));
export default DiceRollButton;
