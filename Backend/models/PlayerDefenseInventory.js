const mongoose = require('mongoose');

const PlayerDefenseInventorySchema = new mongoose.Schema({
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  defenseId: { type: mongoose.Schema.Types.ObjectId, ref: 'DefenseItem', required: true },
  quantity: { type: Number, default: 0 },
  defenseStatus: { type: String, enum: ['intact', 'damaged', 'destroyed'], default: 'intact' }
}, { timestamps: true });

module.exports = mongoose.model('PlayerDefenseInventory', PlayerDefenseInventorySchema);