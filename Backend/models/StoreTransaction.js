const mongoose = require('mongoose');

const StoreTransactionSchema = new mongoose.Schema({
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  itemType: { type: String, enum: ['bomb', 'defense'], required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
  quantity: { type: Number, default: 1 },
  totalCost: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StoreTransaction', StoreTransactionSchema);