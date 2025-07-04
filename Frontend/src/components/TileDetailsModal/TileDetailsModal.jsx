// File: /src/components/TileDetailsModal/TileDetailsModal.jsx
import React from 'react';
import styles from './TileDetailsModal.module.css';

const TileDetailsModal = ({ tile, onClose }) => {
  if (!tile || tile.type !== 'property') return null;

  const {
    name,
    basePrice,
    baseRent,
    upgradeCost,
    hotelCost,
    country
  } = tile.propertyRef;

  const rentMultipliers = [1, 5, 15, 45, 60, 80]; // base, 1h, 2h, 3h, 4h, hotel
  const rentLabels = [
    'Base rent',
    'With 1 house',
    'With 2 houses',
    'With 3 houses',
    'With 4 houses',
    'With hotel'
  ];
  const rentTiers = rentMultipliers.map(m => baseRent * m);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        <h2 className={styles.title}>{name} <span>({country})</span></h2>

        <div className={styles.section}>
          <p><strong>Price:</strong> ${basePrice}</p>
          <p><strong>Upgrade Cost (per level):</strong> ${upgradeCost}</p>
          <p><strong>Hotel Cost:</strong> ${hotelCost}</p>
        </div>

        <div className={styles.section}>
          <h3>Rent Details</h3>
          <table className={styles.rentTable}>
            <tbody>
              {rentTiers.map((rent, idx) => (
                <tr key={idx}>
                  <td>{rentLabels[idx]}</td>
                  <td>${rent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TileDetailsModal;
