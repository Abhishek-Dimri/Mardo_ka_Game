import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setGameInfo } from '../features/game/gameSlice';
import socket from '../socket/socket';
import { useNavigate } from 'react-router-dom';

const CreateGame = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = () => {
    setLoading(true);

    socket.emit('createGame', {}, (response) => {
      setLoading(false);
      if (response.success) {
        dispatch(setGameInfo({
          gameId: response.gameId,
          boardId: response.boardinfo._id,
          board: response.boardinfo,
          status: 'waiting'
        }));
        navigate(`/game/${response.gameId}`); // SPA navigation
      } else {
        alert(response.error);
      }
    });
  };

  return (
    <div>
      <h2>Create Game</h2>
      <button onClick={handleCreate} disabled={loading}>
        {loading ? 'Creating...' : 'Create Game'}
      </button>
    </div>
  );
};

export default CreateGame;
