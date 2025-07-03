import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { setGameId } from '../features/game/gameSlice';
import { setPlayerInfo } from '../features/player/playerSlice';
import socket from '../socket/socket';

const JoinGame = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { gameId } = useParams(); // ✅ Get gameId from URL params

  const [username, setUsername] = useState('');
  const [color, setColor] = useState('#ff0000');

  const handleJoin = () => {
    socket.emit(
      'joinGame',
      { gameId, username, color },
      (response) => {
        if (response.success) {
          dispatch(setGameId(gameId));
          dispatch(setPlayerInfo({
            playerId: response.playerId,
            username,
            color: response.color, // ✅ use color from server response
            gameOwner: response.playerId === response.gameOwner
          }));
          navigate(`/game/${gameId}`); // ✅ Navigate using React Router
        } else {
          alert(response.error);
        }
      }
    );
  };

  return (
    <div>
      <h2>Join Game</h2>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <button onClick={handleJoin}>Join</button>
    </div>
  );
};

export default JoinGame;
