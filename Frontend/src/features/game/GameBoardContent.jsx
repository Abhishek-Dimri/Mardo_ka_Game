import React, { useState, useEffect } from 'react';
import styles from './GameBoardContent.module.css';
import { useDispatch, useSelector } from 'react-redux';
import TileDetailsModal from '../../components/TileDetailsModal/TileDetailsModal';
import JoinRoom from '../lobby/JoinRoom';
import StartGameBar from './StartGameBar';

const GameBoardContent = () => {
  const [x, setX] = useState(0);
  const [selectedTile, setSelectedTile] = useState(null);
  const game = useSelector(state => state.game);
  const gameId = useSelector(state => state.game.gameId);

  useEffect(() => {
    const updateSize = () => {
      const shorterSide = Math.min(window.innerWidth, window.innerHeight) - 20; // 20px for padding
      setX(Math.floor(shorterSide / 13));
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const getTileClass = (index) => {
    if ([0, 11, 22, 33].includes(index)) return styles.cornerTile;
    return styles.edgeTile;
  };

  const getTilePosition = (index) => {
    const px = (val) => `${val}px`;
    const cornerSize = 1.5 * x;
    const edgeSize = x;

    if (index === 0) return { top: 0, left: 0 }; // Top-left
    if (index === 11) return { top: 0, left: px(cornerSize + 10 * edgeSize) }; // Top-right
    if (index === 22) return { top: px(cornerSize + 10 * edgeSize), left: px(cornerSize + 10 * edgeSize) }; // Bottom-right
    if (index === 33) return { top: px(cornerSize + 10 * edgeSize), left: 0 }; // Bottom-left

    if (index > 0 && index < 11) {
      return {
        top: 0,
        left: px(cornerSize + (index - 1) * edgeSize),
      };
    }

    if (index > 11 && index < 22) {
      return {
        top: px(cornerSize + (index - 12) * edgeSize),
        left: px(cornerSize + 10 * edgeSize + 1.5 * x),
        transform: 'rotate(90deg)',
        transformOrigin: 'top left',
      };
    }

    if (index > 22 && index < 33) {
      return {
        top: px(cornerSize + 10 * edgeSize),
        left: px(cornerSize + (32 - index) * edgeSize),
      };
    }

    if (index > 33 && index < 44) {
      return {
        top: px(cornerSize + (43 - index) * edgeSize),
        left: 1.5 * x,
        transform: 'rotate(90deg)',
        transformOrigin: 'top left',
      };
    }

    return {};
  };

  const boardSize = x * 13;

  return (
    <>
    <div className={styles.board} style={{ width: boardSize, height: boardSize }}>
      {game.board.tiles?.map((tile, idx) => (
        <div
          key={tile._id}
          onClick={() => {
            if (tile.type === 'property') setSelectedTile(tile);
          }}
          className={getTileClass(idx)}
          style={{
            ...getTilePosition(idx),
            width: idx % 11 === 0 ? 1.5 * x : x,
            height: 1.5 * x,
            position: 'absolute',
            cursor: tile.type === 'property' ? 'pointer' : 'default',
          }}
        >
          <div className={styles.tileContent}>
            <strong>#{tile.index} - {tile.type}</strong>
            {tile.propertyRef && (
              <div>
                <p>{tile.propertyRef.name}</p>
              </div>
            )}
          </div>
        </div>
      ))}

      {selectedTile && (
        <TileDetailsModal tile={selectedTile} onClose={() => setSelectedTile(null)} />
      )}
    </div>
    </>
  );
};

export default GameBoardContent;
