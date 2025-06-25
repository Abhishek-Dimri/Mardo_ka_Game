const mongoose = require('mongoose');

const BombSchema = new mongoose.Schema({
  name: { type: String, required: true },
  intensity: { type: Number, required: true }, // Level reduction power
  blastRadius: { type: Number, required: true }, // Number of tiles affected around target
  price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Bomb', BombSchema);