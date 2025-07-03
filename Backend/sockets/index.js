const gameSocket = require('./handlers/gameSocket');
const playerSocket = require('./handlers/playerSocket');
const propertySocket = require('./handlers/propertySocket');
const storeSocket = require('./handlers/storeSocket');
const attackSocket = require('./handlers/attackSocket');
const chatSocket = require('./handlers/chatSocket');

module.exports = function (io) {
  io.on('connection', (socket) => {
    console.log(`🔌 New connection: ${socket.id}`);

    gameSocket(io, socket);
    playerSocket(io, socket);
    propertySocket(io, socket);
    storeSocket(io, socket);
    attackSocket(io, socket);
    chatSocket(io, socket);

    socket.on('disconnect', () => {
      console.log(`❌ Disconnected: ${socket.id}`);
      // optional: clean up player/socketId map
    });
  });
};
