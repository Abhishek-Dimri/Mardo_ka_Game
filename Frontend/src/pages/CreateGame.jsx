import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setGameInfo, setLobbyPlayers } from '../features/game/gameSlice';
import { setPlayerInfo } from '../features/player/playerSlice';
import { useNavigate } from 'react-router-dom';
// Use unified gameEvents from features to avoid duplicate filenames confusion
import { emitCreateGame, emitJoinGame } from '../features/game/gameEvents';

const CreateGame = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);
  const [username, setUsername] = useState('');
  const [color, setColor] = useState('#ff0000');
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!username.trim()) return alert('Enter a username first');
    setLoading(true);
    emitCreateGame((createRes) => {
      setLoading(false);
      if (!createRes.success) return alert(createRes.error || 'Failed to create');

      // Set base game info
      dispatch(setGameInfo({
        gameId: createRes.gameId,
        boardId: createRes.boardinfo._id,
        board: createRes.boardinfo,
        status: 'waiting',
      }));

      // Join as host automatically
      setJoining(true);
      emitJoinGame({ gameId: createRes.gameId, username, color }, (joinRes) => {
        setJoining(false);
        if (!joinRes.success) {
          return alert(joinRes.error || 'Auto-join failed (you can manually join on game page)');
        }

        // Persist for rejoin
        localStorage.setItem('playerData', JSON.stringify({
          gameId: createRes.gameId,
          playerId: joinRes.playerId,
          username,
          color,
        }));

        dispatch(setPlayerInfo({
          playerId: joinRes.playerId,
          username,
          color,
          gameOwner: joinRes.gameOwner === joinRes.playerId,
        }));

        dispatch(setLobbyPlayers({
          playerId: joinRes.playerId,
          username,
          color,
          gameId: createRes.gameId,
        }));

        navigate(`/game/${createRes.gameId}`);
      });
    });
  };

  return (
    <div>
      <h2>Create Game</h2>
      <div style={{marginTop:'1rem'}}>
        <input
          placeholder="Your username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
          style={{padding:'8px', marginRight:'8px'}}
        />
        <input
          type="color"
          value={color}
          onChange={(e)=>setColor(e.target.value)}
          title="Pick your color"
          style={{width:'48px', height:'38px', verticalAlign:'middle'}}
        />
      </div>
      <button onClick={handleCreate} disabled={loading || joining} style={{marginTop:'12px'}}>
        {loading ? 'Creating...' : joining ? 'Joining...' : 'Create & Join'}
      </button>
    </div>
  );
};

export default CreateGame;
