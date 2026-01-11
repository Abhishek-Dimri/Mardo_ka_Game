import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setGameInfo, setLobbyPlayers } from '../game/gameSlice';
import { setPlayerInfo } from '../player/playerSlice';
import socket from '../../socket/socket';
import styles from './JoinRoom.module.css';

const colorOptions = [
  { name: 'Red', value: '#ff4d4f' },
  { name: 'Blue', value: '#1890ff' },
  { name: 'Green', value: '#52c41a' },
  { name: 'Yellow', value: '#fadb14' },
  { name: 'Purple', value: '#722ed1' },
  { name: 'Orange', value: '#fa8c16' },
];

const JoinRoom = ({ gameId }) => {
  const dispatch = useDispatch();
  const player = useSelector((state) => state.player);
  const board = useSelector((state) => state.game.board);
  const boardId = useSelector((state) => state.game.boardId);

  const [username, setUsername] = useState('');
  const [color, setColor] = useState('');
  const [showColors, setShowColors] = useState(false);

  useEffect(() => {
    const handlePlayerJoined = (data) => {
      dispatch(setLobbyPlayers(data));
    };
    socket.on('playerJoined', handlePlayerJoined);
    return () => socket.off('playerJoined', handlePlayerJoined);
  }, [dispatch]);

  useEffect(() => {
    const handleExistingPlayers = (players) => {
      players.forEach((p) => {
        dispatch(setLobbyPlayers(p));
      });
    };
    socket.on('existingPlayers', handleExistingPlayers);
    return () => socket.off('existingPlayers', handleExistingPlayers);
  }, [dispatch]);

  const handleJoin = () => {
    if (!username.trim()) return alert('Please enter a username');
    if (!color) return alert('Please choose a color');

    socket.emit('joinGame', { gameId, username, color }, (response) => {
      if (response.success) {
        localStorage.setItem(
          'playerData',
          JSON.stringify({
            gameId,
            playerId: response.playerId,
            username,
            color,
          })
        );

        dispatch(setGameInfo({
          gameId,
          boardId,
          board,
          status: response.status || 'waiting',
        }));

        dispatch(setPlayerInfo({
          playerId: response.playerId,
          username,
          color,
          gameOwner: response.playerId === response.gameOwner,
        }));

        dispatch(setLobbyPlayers({
          playerId: response.playerId,
          username,
          color,
          gameId,
        }));
      } else {
        alert(response.error);
      }
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleJoin();
  };

  if (player.playerId) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Join Room</h2>
        <input
          type="text"
          value={username}
          placeholder="Enter your name"
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.input}
        />

        <div className={styles.colorLabel}>Choose Color:</div>
        <div className={styles.colorGrid}>
          {colorOptions.map(({ name, value }) => (
            <button
              key={name}
              className={`${styles.colorButton} ${color === value ? styles.selected : ''}`}
              style={{ backgroundColor: value }}
              onClick={() => setColor(value)}
              title={name}
            />
          ))}
        </div>

        {color && (
          <div className={styles.selectedPreview}>
            Selected Color: <span style={{ color }}>{color}</span>
          </div>
        )}

        <button className={styles.joinButton} onClick={handleJoin}>
          Join
        </button>
      </div>
    </div>
  );
};

export default JoinRoom;
