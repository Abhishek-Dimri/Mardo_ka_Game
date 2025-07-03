// /sockets/handlers/storeSocket.js

const Player = require('../../models/Player');
const Bomb = require('../../models/Bomb');
const DefenseItem = require('../../models/DefenseItem');
const PlayerBombInventory = require('../../models/PlayerBombInventory');
const PlayerDefenseInventory = require('../../models/PlayerDefenseInventory');
const StoreTransaction = require('../../models/StoreTransaction');

module.exports = (io, socket) => {
  // 🛒 BUY ITEM
  socket.on('buyItem', async ({ playerId, itemType, itemId, quantity }, callback) => {
    try {
      const player = await Player.findById(playerId);
      if (!player) return callback({ success: false, error: 'Player not found' });

      if (!['bomb', 'defense'].includes(itemType)) {
        return callback({ success: false, error: 'Invalid item type' });
      }

      let itemModel = itemType === 'bomb' ? Bomb : DefenseItem;
      const item = await itemModel.findById(itemId);
      if (!item) return callback({ success: false, error: 'Item not found' });

      const totalCost = item.price * quantity;
      if (player.money < totalCost) {
        return callback({ success: false, error: 'Insufficient funds' });
      }

      // Deduct money
      player.money -= totalCost;
      await player.save();

      // Update inventory
      if (itemType === 'bomb') {
        let inventory = await PlayerBombInventory.findOne({ playerId });
        if (!inventory) inventory = await PlayerBombInventory.create({ playerId, bombs: new Map() });

        const current = inventory.bombs.get(itemId) || 0;
        inventory.bombs.set(itemId, current + quantity);
        await inventory.save();
      } else {
        let inventory = await PlayerDefenseInventory.findOne({ playerId });
        if (!inventory) inventory = await PlayerDefenseInventory.create({ playerId, defense: new Map() });

        const current = inventory.defense.get(itemId) || 0;
        inventory.defense.set(itemId, current + quantity);
        await inventory.save();
      }

      // Log transaction
      await StoreTransaction.create({
        playerId,
        itemType,
        itemId,
        quantity,
        totalCost,
        purchasedAt: new Date()
      });

      callback({
        success: true,
        newBalance: player.money,
        message: `${quantity} ${item.name}(s) purchased`
      });
    } catch (err) {
      console.error('❌ buyItem error:', err);
      callback({ success: false, error: 'Store error' });
    }
  });

  // 📦 GET STORE ITEMS (optional, for frontend)
  socket.on('getStoreItems', async (_, callback) => {
    try {
      const [bombs, defenses] = await Promise.all([
        Bomb.find(),
        DefenseItem.find()
      ]);

      callback({
        success: true,
        store: {
          bombs,
          defenseItems: defenses
        }
      });
    } catch (err) {
      console.error('❌ getStoreItems error:', err);
      callback({ success: false, error: 'Failed to load store items' });
    }
  });
};
