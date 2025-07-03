const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  username: { type: String, required: true },
  money: { type: Number, default: 1500 },
  socketId: { type: String },
  currentPosition: { type: Number, default: 0 },
  isInJail: { type: Boolean, default: false },
  isVacation: { type: Boolean, default: false }, // Skip one turn if landed on vacation
  color: { type: String, required:true }, // Unique player color for board UI
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  properties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }]
}, { timestamps: true });

module.exports = mongoose.model('Player', PlayerSchema);