const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  status: { type: String, enum: ['waiting', 'active', 'ended'], default: 'waiting', index: true },
  startTime: { type: Date },
  currentTurnPlayerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  playerOrder: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }], // Circular order
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', index: true },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', index: true }
}, { timestamps: true });

// Compound index to quickly find active games (future scalability)
GameSchema.index({ status: 1, startTime: 1 });

module.exports = mongoose.model('Game', GameSchema);