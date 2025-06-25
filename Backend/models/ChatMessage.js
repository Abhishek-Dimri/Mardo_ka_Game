const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  messageText: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);