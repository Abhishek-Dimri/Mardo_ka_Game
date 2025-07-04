import React from 'react';
import styles from './GameLayout.module.css';

const GameLayout = ({ left, center, right }) => {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebarLeft}>
        {left}
      </aside>

      <main className={styles.center}>
        {center}
      </main>

      <aside className={styles.sidebarRight}>
        {right}
      </aside>
    </div>
  );
};

export default GameLayout;
