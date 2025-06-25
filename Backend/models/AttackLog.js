const mongoose = require('mongoose');

const AttackLogSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  attackerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  targetPlayerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  targetPropertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  bombId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bomb', required: true },
  defenseUsedId: { type: mongoose.Schema.Types.ObjectId, ref: 'DefenseItem' },
  damageAbsorbed: { type: Number, default: 0 },
  levelsDestroyed: { type: Number, default: 0 },
  blastTargets: { type: Array, default: [] }, // Array of affected tile indexes or IDs
  defenseDestroyed: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AttackLog', AttackLogSchema);