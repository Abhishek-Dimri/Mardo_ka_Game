const mongoose = require('mongoose');

const PlayerPropertySchema = new mongoose.Schema({
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  level: { type: Number, default: 0, min: 0, max: 4 },
  hasHotel: { type: Boolean, default: false },
  isMortgaged: { type: Boolean, default: false },
  defenseItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'DefenseItem' },
  defenseStatus: { type: String, enum: ['intact', 'damaged', 'destroyed'], default: 'intact' }
}, { timestamps: true });

module.exports = mongoose.model('PlayerProperty', PlayerPropertySchema);
