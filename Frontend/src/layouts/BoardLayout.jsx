import React from 'react';
import styles from './BoardLayout.module.css';

const BoardLayout = ({ gameBoard, diceArea, actionArea, logs }) => {
  return (
    <div className={styles.container}>
      {/* GameBoard as background */}
      {gameBoard}

      {/* Overlay elements stacked vertically */}
      <div className={styles.overlay}>
        <div className={styles.spacerTop} />

        <div className={styles.dice}>
          {diceArea}
        </div>

        <div className={styles.action}>
          {actionArea}
        </div>

        <div className={styles.logs}>
          {logs}
        </div>

        <div className={styles.spacerBottom} />
      </div>
    </div>
  );
};

export default BoardLayout;
