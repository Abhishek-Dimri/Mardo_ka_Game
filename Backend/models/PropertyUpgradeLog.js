const mongoose = require('mongoose');

const PropertyUpgradeLogSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  previousLevel: { type: Number },
  newLevel: { type: Number },
  isHotelBuilt: { type: Boolean },
  upgradeCost: { type: Number },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PropertyUpgradeLog', PropertyUpgradeLogSchema);