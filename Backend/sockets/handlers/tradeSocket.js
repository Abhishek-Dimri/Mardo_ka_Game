// /sockets/handlers/tradeSocket.js

const TradeOffer = require('../../models/TradeOffer');
const Player = require('../../models/Player');

module.exports = (io, socket) => {
  
  // Offer a trade
  socket.on('offerTrade', async ({ gameId, fromPlayerId, toPlayerId, offerDetails }, callback) => {
    try {
      if (!gameId || !fromPlayerId || !toPlayerId || !offerDetails) {
        return callback({ success: false, error: 'Missing trade data' });
      }

      // Basic check: players exist
      const fromPlayer = await Player.findById(fromPlayerId);
      const toPlayer = await Player.findById(toPlayerId);
      if (!fromPlayer || !toPlayer) {
        return callback({ success: false, error: 'Invalid players' });
      }

      // Create trade offer document
      const trade = await TradeOffer.create({
        gameId,
        fromPlayerId,
        toPlayerId,
        offerDetails,
        status: 'pending',
        createdAt: new Date()
      });

      // Notify the recipient
      io.to(toPlayer.socketId).emit('newTradeOffer', { tradeId: trade._id, fromPlayerId, offerDetails });

      callback({ success: true, tradeId: trade._id });

    } catch (err) {
      console.error('❌ offerTrade error:', err);
      callback({ success: false, error: 'Failed to send trade offer' });
    }
  });

  // Accept a trade
  socket.on('acceptTrade', async ({ tradeId, playerId }, callback) => {
    try {
      const trade = await TradeOffer.findById(tradeId);
      if (!trade) return callback({ success: false, error: 'Trade not found' });
      if (trade.toPlayerId.toString() !== playerId) {
        return callback({ success: false, error: 'Not authorized to accept' });
      }
      if (trade.status !== 'pending') {
        return callback({ success: false, error: 'Trade already resolved' });
      }

      trade.status = 'accepted';
      trade.resolvedAt = new Date();
      await trade.save();

      // Notify involved players
      io.to(trade.fromPlayerId.toString()).emit('tradeAccepted', { tradeId });
      io.to(trade.toPlayerId.toString()).emit('tradeAccepted', { tradeId });

      callback({ success: true });
    } catch (err) {
      console.error('❌ acceptTrade error:', err);
      callback({ success: false, error: 'Failed to accept trade' });
    }
  });

  // Decline a trade
  socket.on('declineTrade', async ({ tradeId, playerId }, callback) => {
    try {
      const trade = await TradeOffer.findById(tradeId);
      if (!trade) return callback({ success: false, error: 'Trade not found' });
      if (trade.toPlayerId.toString() !== playerId) {
        return callback({ success: false, error: 'Not authorized to decline' });
      }
      if (trade.status !== 'pending') {
        return callback({ success: false, error: 'Trade already resolved' });
      }

      trade.status = 'declined';
      trade.resolvedAt = new Date();
      await trade.save();

      // Notify involved players
      io.to(trade.fromPlayerId.toString()).emit('tradeDeclined', { tradeId });
      io.to(trade.toPlayerId.toString()).emit('tradeDeclined', { tradeId });

      callback({ success: true });
    } catch (err) {
      console.error('❌ declineTrade error:', err);
      callback({ success: false, error: 'Failed to decline trade' });
    }
  });

  // Get all trades for a player
  socket.on('getTrades', async ({ playerId }, callback) => {
    try {
      const trades = await TradeOffer.find({
        $or: [{ fromPlayerId: playerId }, { toPlayerId: playerId }],
        status: 'pending'
      }).sort({ createdAt: -1 });

      callback({ success: true, trades });
    } catch (err) {
      console.error('❌ getTrades error:', err);
      callback({ success: false, error: 'Failed to load trades' });
    }
  });

};
