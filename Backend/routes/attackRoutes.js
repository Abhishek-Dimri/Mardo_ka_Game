const router = require('express').Router();
const attackController = require('../controllers/attackController');

router.post('/use-bomb', attackController.useBomb);
router.post('/repair', attackController.repairDefense);
router.post('/assign-defense', attackController.assignDefenseToProperty);
router.get('/inventory/bombs/:playerId', attackController.getPlayerBombs);
router.get('/inventory/defense/:playerId', attackController.getPlayerDefenses);

module.exports = router;
