const router = require('express').Router();
const tradeController = require('../controllers/tradeController');

router.post('/offer', tradeController.sendTradeOffer);
router.post('/accept', tradeController.acceptTradeOffer);
router.post('/decline', tradeController.declineTradeOffer);
router.get('/list/:playerId', tradeController.getPlayerTradeOffers);

module.exports = router;
