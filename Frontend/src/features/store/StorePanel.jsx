// features/store/StorePanel.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setStoreItems } from './storeSlice';
import socket from '../../socket/socket';
import styles from './StorePanel.module.css';

const StorePanel = () => {
  const dispatch = useDispatch();
  const { bombs, defenseItems } = useSelector(state => state.store);
  const gameStatus = useSelector(state => state.game.status);

  useEffect(() => {
    if (gameStatus === 'active') {
      socket.emit('getStoreItems', null, (res) => {
        if (res.success) {
          dispatch(setStoreItems({
            bombs: res.store.bombs,
            defenseItems: res.store.defenseItems,
          }));
        } else {
          console.error(res.error);
        }
      });
    }
  }, [dispatch, gameStatus]);

//   if (gameStatus !== 'active') return null; // ❌ hide if game isn't active

  return (
    <div className={styles.storePanel}>
      <h3>🛒 In-Game Store</h3>

      <h4>💣 Bombs</h4>
      <ul>
        {bombs.map(b => (
          <li key={b._id}>
            <div className={styles.itemRow}>
              <div>
                <strong>{b.name}</strong><br />
                ₹{b.price} | Intensity: {b.intensity} | Radius: {b.blastRadius}
              </div>
              <button disabled>Buy</button>
            </div>
          </li>
        ))}
      </ul>

      <h4>🛡️ Defense</h4>
      <ul>
        {defenseItems.map(d => (
          <li key={d._id}>
            <div className={styles.itemRow}>
              <div>
                <strong>{d.name}</strong><br />
                ₹{d.price} | Strength: {d.strength}
              </div>
              <button disabled>Buy</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StorePanel;
