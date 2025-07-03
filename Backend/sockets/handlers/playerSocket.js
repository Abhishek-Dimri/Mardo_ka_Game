// /sockets/handlers/playerSocket.js

const Game = require('../../models/Game');
const Player = require('../../models/Player');
const Property = require('../../models/Property'); // Optional: if needed for tile info

module.exports = (io, socket) => {
  // 🎲 ROLL DICE
  socket.on('rollDice', async ({ gameId, playerId }) => {
    try {
      const game = await Game.findById(gameId);
      if (!game || game.status !== 'active') return;

      if (!game.currentTurnPlayerId.equals(playerId)) {
        return socket.emit('errorMessage', 'Not your turn');
      }

      const player = await Player.findById(playerId);
      if (!player) return;

      // Skip turn if on vacation
      if (player.isVacation) {
        player.isVacation = false;
        await player.save();
        io.to(gameId).emit('playerSkippedTurn', { playerId });
        return;
      }

      const diceValue = Math.floor(Math.random() * 6) + 1;
      const totalTiles = 40; // adjust if your board has more/less
      const newPosition = (player.currentPosition + diceValue) % totalTiles;

      player.currentPosition = newPosition;
      await player.save();

      // Optional: fetch tile info (could be property, jail, surprise, etc.)
      const tile = await Property.findOne({ boardIndex: newPosition });

      io.to(gameId).emit('diceRolled', {
        playerId,
        diceValue,
        newPosition,
        tileInfo: tile || null
      });
    } catch (err) {
      console.error('❌ rollDice error:', err);
      socket.emit('errorMessage', 'Server error during dice roll');
    }
  });

  // 🔚 END TURN
  socket.on('endTurn', async ({ gameId, playerId }) => {
    try {
      const game = await Game.findById(gameId);
      if (!game || game.status !== 'active') return;

      if (!game.currentTurnPlayerId.equals(playerId)) {
        return socket.emit('errorMessage', 'Not your turn');
      }

      const currentIndex = game.playerOrder.findIndex(id => id.equals(playerId));
      const nextIndex = (currentIndex + 1) % game.playerOrder.length;

      game.currentTurnPlayerId = game.playerOrder[nextIndex];
      await game.save();

      io.to(gameId).emit('turnChanged', {
        currentTurnPlayerId: game.currentTurnPlayerId
      });
    } catch (err) {
      console.error('❌ endTurn error:', err);
      socket.emit('errorMessage', 'Error ending turn');
    }
  });

  // 🚪 LEAVE GAME
  socket.on('leaveGame', async ({ gameId, playerId }) => {
    try {
      const player = await Player.findById(playerId);
      if (!player) return;

      await Player.findByIdAndDelete(playerId);

      const game = await Game.findById(gameId);
      if (!game) return;

      game.playerOrder = game.playerOrder.filter(id => !id.equals(playerId));

      if (game.currentTurnPlayerId.equals(playerId)) {
        game.currentTurnPlayerId = game.playerOrder[0] || null;
      }

      // Optional: reassign owner if host left
      if (game.ownerId.equals(playerId)) {
        game.ownerId = game.playerOrder[0] || null;
      }

      await game.save();

      io.to(gameId).emit('playerLeft', { playerId });
    } catch (err) {
      console.error('❌ leaveGame error:', err);
      socket.emit('errorMessage', 'Error leaving game');
    }
  });
};
