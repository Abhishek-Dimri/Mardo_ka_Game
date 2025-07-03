// /sockets/handlers/attackSocket.js

const Game = require('../../models/Game');
const Player = require('../../models/Player');
const Property = require('../../models/Property');
const PlayerProperty = require('../../models/PlayerProperty');
const Bomb = require('../../models/Bomb');
const DefenseItem = require('../../models/DefenseItem');
const PlayerBombInventory = require('../../models/PlayerBombInventory');
const PlayerDefenseInventory = require('../../models/PlayerDefenseInventory');
const AttackLog = require('../../models/AttackLog');

module.exports = (io, socket) => {
  // 💣 USE BOMB
  socket.on('useBomb', async ({ gameId, attackerId, targetPropertyId, bombId }, callback) => {
    try {
      const [game, bomb, attacker, property] = await Promise.all([
        Game.findById(gameId),
        Bomb.findById(bombId),
        Player.findById(attackerId),
        Property.findById(targetPropertyId),
      ]);
      if (!game || !bomb || !attacker || !property) {
        return callback({ success: false, error: 'Invalid data' });
      }

      const inventory = await PlayerBombInventory.findOne({ playerId: attackerId });
      if (!inventory || !inventory.bombs.get(bombId)) {
        return callback({ success: false, error: 'Bomb not in inventory' });
      }

      const playerProperty = await PlayerProperty.findOne({ propertyId: targetPropertyId });
      if (!playerProperty) {
        return callback({ success: false, error: 'Target property not owned' });
      }

      const defense = playerProperty.defense;
      let damage = bomb.intensity;
      let defenseUsed = false;

      // Defense logic
      if (defense && defense.status !== 'destroyed') {
        const defItem = await DefenseItem.findById(defense.defenseItemId);
        if (defItem) {
          damage -= defItem.strength;
          defenseUsed = true;

          // Update defense status
          if (damage > 0) {
            playerProperty.defense.status = 'damaged';
          } else {
            playerProperty.defense.status = 'intact';
            damage = 0;
          }
          await playerProperty.save();
        }
      }

      // Apply damage (simplified: reduce level)
      if (damage > 0 && playerProperty.level > 0) {
        playerProperty.level = Math.max(0, playerProperty.level - 1);
        await playerProperty.save();
      }

      // Reduce bomb count
      inventory.bombs.set(bombId, inventory.bombs.get(bombId) - 1);
      if (inventory.bombs.get(bombId) <= 0) {
        inventory.bombs.delete(bombId);
      }
      await inventory.save();

      // Log attack
      await AttackLog.create({
        gameId,
        attackerId,
        targetPlayerId: playerProperty.playerId,
        propertyId: targetPropertyId,
        bombUsed: bombId,
        defenseUsed,
        damageDealt: damage
      });

      io.to(gameId).emit('propertyAttacked', {
        attackerId,
        targetPlayerId: playerProperty.playerId,
        propertyId: targetPropertyId,
        damageDealt: damage,
        defenseUsed
      });

      callback({ success: true });
    } catch (err) {
      console.error('❌ useBomb error:', err);
      callback({ success: false, error: 'Attack failed' });
    }
  });

  // 🛡 ASSIGN DEFENSE
  socket.on('assignDefense', async ({ playerId, propertyId, defenseItemId }, callback) => {
    try {
      const inventory = await PlayerDefenseInventory.findOne({ playerId });
      if (!inventory || !inventory.defense.get(defenseItemId)) {
        return callback({ success: false, error: 'No defense item available' });
      }

      const property = await PlayerProperty.findOne({ playerId, propertyId });
      if (!property) {
        return callback({ success: false, error: 'Property not owned' });
      }

      // Assign defense
      property.defense = {
        defenseItemId,
        status: 'intact'
      };
      await property.save();

      // Update inventory
      inventory.defense.set(defenseItemId, inventory.defense.get(defenseItemId) - 1);
      if (inventory.defense.get(defenseItemId) <= 0) {
        inventory.defense.delete(defenseItemId);
      }
      await inventory.save();

      callback({ success: true });
    } catch (err) {
      console.error('❌ assignDefense error:', err);
      callback({ success: false, error: 'Assignment failed' });
    }
  });

  // 🧰 REPAIR DEFENSE
  socket.on('repairDefense', async ({ playerId, propertyId }, callback) => {
    try {
      const property = await PlayerProperty.findOne({ playerId, propertyId });
      if (!property || !property.defense || property.defense.status !== 'damaged') {
        return callback({ success: false, error: 'Nothing to repair' });
      }

      const defItem = await DefenseItem.findById(property.defense.defenseItemId);
      const player = await Player.findById(playerId);

      if (player.money < defItem.repairCost) {
        return callback({ success: false, error: 'Not enough money' });
      }

      player.money -= defItem.repairCost;
      property.defense.status = 'intact';

      await Promise.all([player.save(), property.save()]);

      callback({ success: true, newBalance: player.money });
    } catch (err) {
      console.error('❌ repairDefense error:', err);
      callback({ success: false, error: 'Repair failed' });
    }
  });
};
