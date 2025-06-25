const mongoose = require('mongoose');

const GameActionLogSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  actionType: { type: String, required: true }, // e.g. 'roll', 'buy', 'attack'
  targetEntityId: { type: mongoose.Schema.Types.ObjectId },
  details: { type: Object }, // flexible details about action
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GameActionLog', GameActionLogSchema);