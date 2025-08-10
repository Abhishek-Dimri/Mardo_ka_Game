import { setGameStarted, setGameInfo, setLobbyPlayers } from '../../features/game/gameSlice';

const setupGameHandlers = (socket, dispatch) => {
  socket.on('gameStarted', ({ currentTurnPlayerId, playerOrder }) => {
    dispatch(setGameStarted({ currentTurnPlayerId, playerOrder }));
  });

  socket.on('existingPlayers', (players) => {
    players.forEach(player => dispatch(setLobbyPlayers(player)));
  });

  socket.on('playerJoined', (player) => {
    dispatch(setLobbyPlayers(player));
  });

  // 🧼 Optional cleanup on disconnect
  return () => {
    socket.off('gameStarted');
    socket.off('existingPlayers');
    socket.off('playerJoined');
  };
};

export default setupGameHandlers;
