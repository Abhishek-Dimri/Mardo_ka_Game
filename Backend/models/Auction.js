const mongoose = require('mongoose');

const AuctionSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  highestBid: { type: Number, default: 0 },
  highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  lastBidder: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  isActive: { type: Boolean, default: true },
  startedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Auction', AuctionSchema);
