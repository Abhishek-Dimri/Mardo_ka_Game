const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  basePrice: { type: Number, required: true },
  baseRent: { type: Number, required: true },
  upgradeCostPerLevel: { type: Number, required: true },
  hotelCost: { type: Number, required: true },
  country: { type: String, required: true } // e.g., 'Italy', 'India'
}, { timestamps: true });

module.exports = mongoose.model('Property', PropertySchema);