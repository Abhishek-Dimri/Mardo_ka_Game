const router = require('express').Router();
const propertyController = require('../controllers/propertyController');

router.post('/buy', propertyController.buyProperty);
router.post('/auction/start', propertyController.startAuction);
router.post('/auction/bid', propertyController.placeBid);
router.post('/auction/end', propertyController.endAuction);
router.post('/upgrade', propertyController.upgradeProperty);
router.post('/mortgage', propertyController.mortgageProperty);
router.post('/unmortgage', propertyController.unmortgageProperty);
router.get('/list/:gameId', propertyController.listProperties);

module.exports = router;
