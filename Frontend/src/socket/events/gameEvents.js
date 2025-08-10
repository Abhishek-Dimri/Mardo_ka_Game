import socket from '../socket';

// Temporary debug to ensure module evaluated; remove when stable.
// eslint-disable-next-line no-console
console.debug('[socket/events/gameEvents] exports:', ['emitCreateGame','emitJoinGame','emitRejoinGame','emitGetGameData','emitStartGame']);

export const emitCreateGame = (callback) => {
  socket.emit('createGame', {}, callback);
};

export const emitJoinGame = ({ gameId, username, color }, callback) => {
  socket.emit('joinGame', { gameId, username, color }, callback);
};

export const emitRejoinGame = ({ gameId, playerId }, callback) => {
  socket.emit('rejoinGame', { gameId, playerId }, callback);
};

export const emitGetGameData = (gameId, callback) => {
  socket.emit('getGameData', gameId, callback);
};

export const emitStartGame = ({ gameId, playerId }, callback) => {
  socket.emit('startGame', { gameId, playerId }, callback);
};
