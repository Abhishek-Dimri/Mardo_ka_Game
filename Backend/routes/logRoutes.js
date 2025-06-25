const router = require('express').Router();
const logController = require('../controllers/logController');

router.get('/game/:gameId', logController.getGameLogs);
router.get('/player/:playerId', logController.getPlayerLogs);
router.get('/attacks/:gameId', logController.getAttackLogs);

module.exports = router;
