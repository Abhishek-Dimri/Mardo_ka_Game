import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setGameInfo, setLobbyPlayers } from '../game/gameSlice';
import { setPlayerInfo } from '../player/playerSlice';
import socket from '../../socket/socket';
import styles from './JoinRoom.module.css';

const JoinRoom = ({ gameId }) => {
  const dispatch = useDispatch();
  const player = useSelector((state) => state.player);
  const board = useSelector((state) => state.game.board);
  const boardId = useSelector((state) => state.game.boardId);

  const [username, setUsername] = useState('');
  const [color, setColor] = useState('#ff0000');

  // 🔁 Listen for playerJoined globally (others joining)
  useEffect(() => {
    const handlePlayerJoined = (data) => {
      dispatch(setLobbyPlayers(data)); // full player info
    };

    socket.on('playerJoined', handlePlayerJoined);
    return () => socket.off('playerJoined', handlePlayerJoined);
  }, [dispatch]);

  useEffect(() => {
    const handleExistingPlayers = (players) => {
      players.forEach(p => {
        dispatch(setLobbyPlayers(p));
      });
    };

    socket.on('existingPlayers', handleExistingPlayers);
    return () => socket.off('existingPlayers', handleExistingPlayers);
  }, [dispatch]);


  const handleJoin = () => {
    if (!username.trim()) {
      return alert('Please enter a username');
    }

    socket.emit('joinGame', { gameId, username, color }, (response) => {
      if (response.success) {
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
        
          // ✅ Add yourself to player list
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

  // 🔁 Allow pressing Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleJoin();
  };

  if (player.playerId) return null; // ✅ Already joined

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
        />
        <label>
          Pick Color:
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>
        <button onClick={handleJoin}>Join</button>
      </div>
    </div>
  );
};

export default JoinRoom;
