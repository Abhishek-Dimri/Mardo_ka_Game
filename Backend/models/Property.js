const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  colorGroup: { type: String, required: true }, // Used to determine if a player owns all in a group
  boardIndex: { type: Number, required: true }, // Tile position on board
  basePrice: { type: Number, required: true },
  baseRent: { type: Number, required: true },
  upgradeCostPerLevel: { type: Number, required: true },
  hotelCost: { type: Number, required: true },
  isAirBase: { type: Boolean, default: false }, // Allows bomb usage if player lands here
  country: { type: String, required: true } // e.g., 'Italy', 'India'

}, { timestamps: true });

module.exports = mongoose.model('Property', PropertySchema);