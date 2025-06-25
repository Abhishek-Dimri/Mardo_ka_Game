const express = require('express');
const router = express.Router();

router.use('/game', require('./gameRoutes'));
// router.use('/player', require('./playerRoutes'));
// router.use('/property', require('./propertyRoutes'));
// router.use('/attack', require('./attackRoutes'));
// router.use('/store', require('./storeRoutes'));
// router.use('/chat', require('./chatRoutes'));
// router.use('/trade', require('./tradeRoutes'));
// router.use('/log', require('./logRoutes'));

module.exports = router;