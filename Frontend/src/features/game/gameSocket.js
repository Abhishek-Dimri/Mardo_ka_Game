// gameSocket.js
import socket from '../../socket/socket';
import { setGameStarted, setLobbyPlayers, addLog } from './gameSlice';
import { store } from '../../redux/store';

export const initGameSocket = (dispatch) => {
  const onGameStarted = ({ currentTurnPlayerId, playerOrder }) => {
    dispatch(setGameStarted({ currentTurnPlayerId, playerOrder }));
    dispatch(addLog({ message: 'Game started' }));
  };
  const onExistingPlayers = (players) => {
    players.forEach(player => dispatch(setLobbyPlayers(player)));
  };
  const onPlayerJoined = (player) => {
    dispatch(setLobbyPlayers(player));
    dispatch(addLog({ message: `${player.username} joined the lobby` }));
  };
  const onDiceRolled = ({ playerId, diceValue, newPosition }) => {
    const state = store.getState();
    const player = state.game.playerOrder.find(p => p.playerId === playerId) || {};
    dispatch(addLog({ message: `${player.username || playerId} rolled ${diceValue} (-> ${newPosition})` }));
  };
  const onTurnChanged = ({ currentTurnPlayerId }) => {
    dispatch(addLog({ message: `Turn changed` }));
    // Preserve existing playerOrder; only update current turn id
    dispatch(setGameStarted({ currentTurnPlayerId, playerOrder: [] }));
  };

  socket.on('gameStarted', onGameStarted);
  socket.on('existingPlayers', onExistingPlayers);
  socket.on('playerJoined', onPlayerJoined);
  socket.on('diceRolled', onDiceRolled);
  socket.on('turnChanged', onTurnChanged);
};

// Optional cleanup
export const cleanupGameSocket = () => {
  socket.off('gameStarted');
  socket.off('existingPlayers');
  socket.off('playerJoined');
  socket.off('diceRolled');
  socket.off('turnChanged');
};
