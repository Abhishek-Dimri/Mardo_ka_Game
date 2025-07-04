import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setGameInfo } from '../features/game/gameSlice';
import { setPlayerInfo } from '../features/player/playerSlice';
import socket from '../socket/socket';

const JoinGame = () => {
  const dispatch = useDispatch();
  const { gameId } = useParams();

  const player = useSelector(state => state.player);
  const game = useSelector(state => state.game);

  const [username, setUsername] = useState('');
  const [color, setColor] = useState('#ff0000');

const handleJoin = () => {
  socket.emit('joinGame', { gameId, username, color }, (response) => {
    if (response.success) {
      dispatch(setGameInfo({
        gameId,
        boardId: response.boardId,
        board: response.board, // ✅ set full board
        status: response.status || 'waiting'
      }));

      dispatch(setPlayerInfo({
        playerId: response.playerId,
        username,
        color,
        gameOwner: response.playerId === response.gameOwner
      }));
    } else {
      alert(response.error);
    }
  });
};

  useEffect(() => {
    // Fetch game data if needed (board info can be included here if it's dynamic)
    // Or add a socket event for 'gameInfo' if server emits it
  }, [gameId]);

  return (
    <div>
  <h2>Join Game</h2>

  {/* Always show board info */}
  <div>
    <p><strong>Game ID:</strong> {game.gameId}</p>
    <p><strong>Board ID:</strong> {game.boardId}</p>
    <p><strong>Status:</strong> {game.status}</p>

    {game.board && (
      <div style={{ marginTop: '1rem' }}>
        <p><strong>Board Name:</strong> {game.board.name}</p>
        <p><strong>Description:</strong> {game.board.description}</p>
        <p><strong>Total Tiles:</strong> {game.board.tiles?.length || 0}</p>

        <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '1rem' }}>
          {game.board.tiles?.map(tile => (
            <div key={tile._id} style={{ padding: '6px', borderBottom: '1px solid #ccc' }}>
              <strong>Tile #{tile.index} - {tile.type}</strong>
              {tile.propertyRef && (
                <div style={{ marginLeft: '1rem' }}>
                  <p>Name: {tile.propertyRef.name}</p>
                  <p>BasePrice: {tile.propertyRef.basePrice}</p>
                  <p>BaseRent: {tile.propertyRef.baseRent}</p>
                  <p>Upgrade Cost: {tile.propertyRef.upgradeCostPerLevel}</p>
                  <p>Hotel Cost: {tile.propertyRef.hotelCost}</p>
                  <p>Country: {tile.propertyRef.country}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>

  {/* Show join form only if player is not set */}
  {!player.playerId && (
    <div>
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
  )}

  {/* Optional: show player info once joined */}
  {player.playerId && (
    <div>
      <p><strong>Welcome,</strong> {player.username}!</p>
      <p><strong>Your Color:</strong> <span style={{ color: player.color }}>{player.color}</span></p>
      {player.gameOwner && <p>You are the game owner.</p>}
    </div>
  )}
</div>

  );
};

export default JoinGame;
