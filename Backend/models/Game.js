const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  status: { type: String, enum: ['waiting', 'active', 'ended'], default: 'waiting' },
  startTime: { type: Date },
  currentTurnPlayerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  playerOrder: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }], // Circular order
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' }, // Can start game, manage settings
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' } // Reference to Board layout
}, { timestamps: true });

module.exports = mongoose.model('Game', GameSchema);