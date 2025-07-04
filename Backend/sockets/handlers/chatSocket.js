// /sockets/handlers/chatSocket.js

const ChatMessage = require('../../models/ChatMessage');
const Player = require('../../models/Player');

module.exports = (io, socket) => {
  // 📤 SEND MESSAGE
  socket.on('sendMessage', async ({ gameId, playerId, message }, callback) => {
    try {
      if (!message || message.trim() === '') {
        return callback({ success: false, error: 'Empty message' });
      }

      const player = await Player.findById(playerId);
      if (!player) return callback({ success: false, error: 'Player not found' });

      const chat = await ChatMessage.create({
        gameId,
        senderId: player._id,
        messageText: message,
        timestamp: new Date()
      });

      io.to(gameId).emit('newMessage', {
        username: player.username,
        playerId: player._id,
        color: player.color,
        message: message,
        sentAt: chat.timestamp
      });


      callback({ success: true });
    } catch (err) {
      console.error('❌ sendMessage error:', err);
      callback({ success: false, error: 'Message failed' });
    }
  });

  // 📥 GET CHAT HISTORY
  socket.on('getChatHistory', async ({ gameId }, callback) => {
    try {
      const history = await ChatMessage.find({ gameId }).sort({ timestamp: 1 }).limit(100)
        .populate('senderId', 'username color'); // Add username & color

      const formatted = history.map(msg => ({
        playerId: msg.senderId._id,
        username: msg.senderId.username,
        color: msg.senderId.color,
        message: msg.messageText,
        sentAt: msg.timestamp
      }));

      callback({ success: true, messages: formatted });

    } catch (err) {
      console.error('❌ getChatHistory error:', err);
      callback({ success: false, error: 'Failed to load chat' });
    }
  });
};
