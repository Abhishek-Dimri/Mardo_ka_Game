const mongoose = require('mongoose');

const RepairLogSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  defenseItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'DefenseItem', required: true },
  repairCost: { type: Number, required: true },
  repairedFromStatus: { type: String, enum: ['damaged', 'destroyed'], required: true },
  repairedToStatus: { type: String, enum: ['intact', 'damaged'], required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RepairLog', RepairLogSchema);