// /sockets/handlers/gameSocket.js

const Game = require('../../models/Game');
const Board = require('../../models/Board');
const Player = require('../../models/Player');
const Tile = require('../../models/Tile');
const Property = require('../../models/Property');

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

      const boardinfo = await Board.findById(game.boardId)
        .populate({
          path: 'tiles',
          populate: {
            path: 'propertyRef' // this will populate tile.propertyRef if it exists
          }
        })
        .exec();


      callback({
        success: true,
        gameId: game._id,
        joinLink: `http://localhost:5173/join/${game._id}`,
        boardId: board._id,
        boardinfo
      });

    } catch (err) {
      console.error('❌ createGame error:', err);
      callback({ success: false, error: 'Server error while creating game' });
    }
  });

  // GET GAME DATA
  socket.on('getGameData', async (gameId, callback) => {
    try {
      const game = await Game.findById(gameId);
      if (!game) return callback({ success: false, error: 'Game not found' });

      const players = await Player.find({ gameId });
  const board = await Board.findById(game.boardId).populate({
        path: 'tiles',
        populate: { path: 'propertyRef' }
  }).lean();
      const playerMap = new Map(players.map(p => [p._id.toString(), p]));
      // Build ordered player objects from game.playerOrder (fallback to unordered if mismatch)
      const orderedPlayerObjects = (game.playerOrder || []).map(id => {
        const p = playerMap.get(id.toString());
        return p ? {
          playerId: p._id,
          username: p.username,
            color: p.color,
            gameId: p.gameId
        } : null;
      }).filter(Boolean);
      // If any players not in playerOrder (e.g., legacy games), append them
      if (orderedPlayerObjects.length !== players.length) {
        const included = new Set(orderedPlayerObjects.map(p => p.playerId.toString()));
        players.forEach(p => {
          if (!included.has(p._id.toString())) {
            orderedPlayerObjects.push({
              playerId: p._id,
              username: p.username,
              color: p.color,
              gameId: p.gameId
            });
          }
        });
      }

      callback({
        success: true,
        board,
        players: orderedPlayerObjects, // legacy field; keep for compatibility
        ownerId: game.ownerId,
        status: game.status,
        playerOrder: orderedPlayerObjects, // now full objects in correct order
        currentTurnPlayerId: game.currentTurnPlayerId,
      });
    } catch (err) {
      console.error('getGameData error:', err);
      callback({ success: false, error: 'Server error while fetching game' });
    }
  });


  // JOIN GAME
  socket.on('joinGame', async ({ gameId, username, color }, callback) => {
    try {
      if (!gameId || !username || !color) {
        return callback({ success: false, error: 'Missing required data' });
      }

      const game = await Game.findById(gameId);
      if (!game || game.status !== 'waiting') {
        return callback({ success: false, error: 'Invalid game' });
      }

  const existingPlayers = await Player.find({ gameId }).lean();
      if (existingPlayers.some(p => p.username === username)) {
        return callback({ success: false, error: 'Username taken' });
      }

      const player = await Player.create({
        username,
        color,
        gameId,
        socketId: socket.id
      });

      if (existingPlayers.length === 0) {
        game.ownerId = player._id;
      }

      game.playerOrder.push(player._id);
      await game.save();

      socket.join(gameId);

      // Build ordered list (game.playerOrder now includes new player)
      const allPlayers = [...existingPlayers, player];
      const playerMap = new Map(allPlayers.map(p => [p._id.toString(), p]));
      const ordered = game.playerOrder.map(id => {
        const p = playerMap.get(id.toString());
        return p ? {
          playerId: p._id,
          username: p.username,
          color: p.color,
          gameId: p.gameId
        } : null;
      }).filter(Boolean);

      // ✅ Send ordered full player list to the new player only
      socket.emit('existingPlayers', ordered);

      // ✅ Broadcast to others about the new player
      socket.to(gameId).emit('playerJoined', {
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

  const players = await Player.find({ gameId }).lean();
      if (players.length < 2) {
        return callback({ success: false, error: 'Minimum 2 players required' });
      }

      const shuffledPlayers = players.sort(() => 0.5 - Math.random());

      game.status = 'active';
      game.playerOrder = shuffledPlayers.map(p => p._id);
      game.currentTurnPlayerId = game.playerOrder[0];
      await game.save();

      io.to(gameId).emit('gameStarted', {
        currentTurnPlayerId: game.currentTurnPlayerId,
        playerOrder: shuffledPlayers.map(p => ({
          playerId: p._id,
          username: p.username,
          color: p.color,
          gameId: p.gameId,
        }))
      });


      callback({ success: true });

    } catch (err) {
      console.error('❌ startGame error:', err);
      callback({ success: false, error: 'Server error while starting game' });
    }
  });

  // REJOIN GAME
  socket.on('rejoinGame', async ({ gameId, playerId }, callback) => {
    try {
      if (!gameId || !playerId) {
        return callback({ success: false, error: 'Missing gameId or playerId' });
      }

      const game = await Game.findById(gameId);
      if (!game) {
        return callback({ success: false, error: 'Game not found' });
      }

  const player = await Player.findOne({ _id: playerId, gameId });
      if (!player) {
        return callback({ success: false, error: 'Player not found in game' });
      }

      // Update socketId for live features like chat, movement, etc.
      player.socketId = socket.id;
      await player.save();

      socket.join(gameId);

      callback({
        success: true,
        gameOwner: game.ownerId,
      });

      // Optional: Broadcast to other players that this player is back online
      // socket.to(gameId).emit('playerRejoined', { playerId: player._id });

    } catch (err) {
      console.error('❌ rejoinGame error:', err);
      callback({ success: false, error: 'Server error while rejoining game' });
    }
  });

};
