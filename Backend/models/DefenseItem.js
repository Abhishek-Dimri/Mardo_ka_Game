const mongoose = require('mongoose');

const DefenseItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  strength: { type: Number, required: true }, // Max damage it can absorb
  price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('DefenseItem', DefenseItemSchema);