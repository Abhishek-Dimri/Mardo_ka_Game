const mongoose = require('mongoose');

const PlayerBombInventorySchema = new mongoose.Schema({
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  bombId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bomb', required: true },
  quantity: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('PlayerBombInventory', PlayerBombInventorySchema);