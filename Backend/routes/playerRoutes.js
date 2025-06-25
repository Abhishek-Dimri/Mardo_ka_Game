const router = require('express').Router();
const playerController = require('../controllers/playerController');

router.post('/roll', playerController.rollDice);
router.post('/end-turn', playerController.endTurn);
router.post('/jail/pay', playerController.payJailFine);
router.post('/jail/roll', playerController.tryJailRoll);
router.get('/status/:playerId', playerController.getPlayerStatus);

module.exports = router;
