const mongoose = require('mongoose');

const TileSchema = new mongoose.Schema({
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  index: { type: Number, required: true, unique: true }, // Tile position on board
  type: {
    type: String,
    enum: ['property', 'start', 'jail', 'vacation', 'tax', 'surprise', 'airbase'],
    required: true
  },
  propertyRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' }, // optional
  taxAmount: { type: Number },          // if type === tax
  surpriseCardType: { type: String },   // e.g., 'gainMoney', 'loseMoney', etc.
}, { timestamps: true });

module.exports = mongoose.model('Tile', TileSchema);