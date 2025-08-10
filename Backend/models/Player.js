const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  username: { type: String, required: true },
  money: { type: Number, default: 1500 },
  socketId: { type: String },
  currentPosition: { type: Number, default: 0 },
  isInJail: { type: Boolean, default: false },
  isVacation: { type: Boolean, default: false }, // Skip one turn if landed on vacation
  color: { type: String, required:true }, // Unique player color for board UI
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true, index: true },
  properties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }]
}, { timestamps: true });

// Enforce per-game uniqueness of username & color at DB level (prevents race duplicates)
PlayerSchema.index({ gameId: 1, username: 1 }, { unique: true });
PlayerSchema.index({ gameId: 1, color: 1 }, { unique: true });

// Quick lookup by socketId
PlayerSchema.index({ socketId: 1 });

module.exports = mongoose.model('Player', PlayerSchema);