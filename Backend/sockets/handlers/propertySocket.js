// /sockets/handlers/propertySocket.js

const Game = require('../../models/Game');
const Player = require('../../models/Player');
const Property = require('../../models/Property');
const PlayerProperty = require('../../models/PlayerProperty');

module.exports = (io, socket) => {
  // 🏠 BUY PROPERTY
  socket.on('buyProperty', async ({ gameId, playerId, propertyId }, callback) => {
    try {
      const [game, player, property] = await Promise.all([
        Game.findById(gameId),
        Player.findById(playerId),
        Property.findById(propertyId)
      ]);

      if (!game || !player || !property) {
        return callback({ success: false, error: 'Invalid request' });
      }

      // Check if already owned
      const owned = await PlayerProperty.findOne({ propertyId });
      if (owned) return callback({ success: false, error: 'Already owned' });

      if (player.money < property.price) {
        return callback({ success: false, error: 'Not enough money' });
      }

      // Deduct money and assign ownership
      player.money -= property.price;
      await player.save();

      const playerProp = await PlayerProperty.create({
        playerId,
        propertyId,
        gameId,
        level: 0
      });

      io.to(gameId).emit('propertyBought', {
        playerId,
        propertyId,
        newBalance: player.money
      });

      callback({ success: true });
    } catch (err) {
      console.error('❌ buyProperty error:', err);
      callback({ success: false, error: 'Server error during property purchase' });
    }
  });

  // 🛠 UPGRADE PROPERTY
  socket.on('upgradeProperty', async ({ gameId, playerId, propertyId }, callback) => {
    try {
      const ownership = await PlayerProperty.findOne({ playerId, propertyId });
      if (!ownership) return callback({ success: false, error: 'You don’t own this property' });

      if (ownership.level >= 4) {
        return callback({ success: false, error: 'Max level reached' });
      }

      const player = await Player.findById(playerId);
      const property = await Property.findById(propertyId);
      const upgradeCost = property.upgradeCost;

      if (player.money < upgradeCost) {
        return callback({ success: false, error: 'Not enough money to upgrade' });
      }

      player.money -= upgradeCost;
      ownership.level += 1;

      await Promise.all([player.save(), ownership.save()]);

      io.to(gameId).emit('propertyUpgraded', {
        playerId,
        propertyId,
        newLevel: ownership.level,
        newBalance: player.money
      });

      callback({ success: true });
    } catch (err) {
      console.error('❌ upgradeProperty error:', err);
      callback({ success: false, error: 'Upgrade error' });
    }
  });

  // 💸 MORTGAGE PROPERTY
  socket.on('mortgageProperty', async ({ gameId, playerId, propertyId }, callback) => {
    try {
      const owned = await PlayerProperty.findOne({ playerId, propertyId });
      if (!owned) return callback({ success: false, error: 'Not owned by you' });

      if (owned.isMortgaged) return callback({ success: false, error: 'Already mortgaged' });

      const player = await Player.findById(playerId);
      const property = await Property.findById(propertyId);
      const mortgageAmount = Math.floor(property.price / 2);

      owned.isMortgaged = true;
      player.money += mortgageAmount;

      await Promise.all([owned.save(), player.save()]);

      io.to(gameId).emit('propertyMortgaged', {
        playerId,
        propertyId,
        newBalance: player.money
      });

      callback({ success: true });
    } catch (err) {
      console.error('❌ mortgageProperty error:', err);
      callback({ success: false, error: 'Mortgage error' });
    }
  });

  // ♻️ UNMORTGAGE PROPERTY
  socket.on('unmortgageProperty', async ({ gameId, playerId, propertyId }, callback) => {
    try {
      const owned = await PlayerProperty.findOne({ playerId, propertyId });
      if (!owned || !owned.isMortgaged) return callback({ success: false, error: 'Not mortgaged' });

      const player = await Player.findById(playerId);
      const property = await Property.findById(propertyId);
      const unmortgageCost = Math.floor(property.price / 2 * 1.1); // +10% interest

      if (player.money < unmortgageCost) {
        return callback({ success: false, error: 'Insufficient funds' });
      }

      owned.isMortgaged = false;
      player.money -= unmortgageCost;

      await Promise.all([owned.save(), player.save()]);

      io.to(gameId).emit('propertyUnmortgaged', {
        playerId,
        propertyId,
        newBalance: player.money
      });

      callback({ success: true });
    } catch (err) {
      console.error('❌ unmortgageProperty error:', err);
      callback({ success: false, error: 'Unmortgage error' });
    }
  });
};
