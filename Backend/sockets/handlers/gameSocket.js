// /sockets/handlers/gameSocket.js

const Game = require('../../models/Game');
const Board = require('../../models/Board');
const Player = require('../../models/Player');

module.exports = (io, socket) => {
  // CREATE GAME
  socket.on('createGame', async (_, callback) => {
    try {
      // Use a pre-seeded board (e.g., find the "Classic Board")
      const board = await Board.findOne({ name: 'Classic Board' }).exec();
      if (!board) {
        return callback({ success: false, error: 'Board not found' });
      }

      const game = await Game.create({ boardId: board._id });

      socket.join(game._id.toString());

      callback({
        success: true,
        gameId: game._id,
        joinLink: `https://your-frontend-url.com/join/${game._id}`
      });

    } catch (err) {
      console.error('❌ createGame error:', err);
      callback({ success: false, error: 'Server error while creating game' });
    }
  });


  // JOIN GAME
  socket.on('joinGame', async ({ gameId, username, color }, callback) => {
    try {
      if(!gameId) {
        return callback({ success: false, error: 'Game ID is required' });
      }
      if (!username) {
        return callback({ success: false, error: 'Username is required' });
      }
      if (!color) {
        return callback({ success: false, error: 'Color is required' });
      }

      const game = await Game.findById(gameId);
      if (!game || game.status !== 'waiting') {
        return callback({ success: false, error: 'Invalid game' });
      }

      const existingPlayers = await Player.find({ gameId });
      if (existingPlayers.some(p => p.username === username)) {
        return callback({ success: false, error: 'Username taken' });
      }

      const player = await Player.create({
        username,
        color,
        gameId,
        socketId: socket.id
      });

      if (existingPlayers.length === 0) game.ownerId = player._id;

      game.playerOrder.push(player._id);
      await game.save();

      socket.join(gameId);

      io.to(gameId).emit('playerJoined', {
        playerId: player._id,
        username,
        color,
        gameId
      });

      callback({
        success: true,
        playerId: player._id,
        gameOwner: game.ownerId
      });

    } catch (err) {
      console.error('❌ joinGame error:', err);
      callback({ success: false, error: 'Server error while joining game' });
    }
  });

  // START GAME
  socket.on('startGame', async ({ gameId, playerId }, callback) => {
    try {
      const game = await Game.findById(gameId);
      if (!game || !game.ownerId.equals(playerId)) {
        return callback({ success: false, error: 'Not authorized to start game' });
      }

      const players = await Player.find({ gameId });
      if (players.length < 2) {
        return callback({ success: false, error: 'Minimum 2 players required' });
      }

      const shuffled = players.map(p => p._id).sort(() => 0.5 - Math.random());
      game.status = 'active';
      game.playerOrder = shuffled;
      game.currentTurnPlayerId = shuffled[0];
      await game.save();

      io.to(gameId).emit('gameStarted', {
        currentTurnPlayerId: game.currentTurnPlayerId,
        playerOrder: shuffled
      });

      callback({ success: true });

    } catch (err) {
      console.error('❌ startGame error:', err);
      callback({ success: false, error: 'Server error while starting game' });
    }
  });
};
