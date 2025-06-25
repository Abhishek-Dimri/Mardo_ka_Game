const router = require('express').Router();
const storeController = require('../controllers/storeController');

router.get('/items', storeController.getStoreItems);
router.post('/buy', storeController.buyItem);

module.exports = router;
