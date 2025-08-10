import socket from '../socket';

export const emitGetStoreItems = (callback) => {
  socket.emit('getStoreItems', null, callback);
};

export const emitBuyItem = ({ playerId, itemType, itemId, quantity }, callback) => {
  socket.emit('buyItem', { playerId, itemType, itemId, quantity }, callback);
};
