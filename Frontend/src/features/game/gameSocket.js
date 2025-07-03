// features/game/gameSocket.js
import socket from '../../socket/socket';
import { setGameStarted } from './gameSlice';

export const initGameSocket = (dispatch) => {
  socket.on('gameStarted', ({ currentTurnPlayerId, playerOrder }) => {
    dispatch(setGameStarted({ currentTurnPlayerId, playerOrder }));
  });
};
