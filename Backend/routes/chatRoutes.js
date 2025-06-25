const router = require('express').Router();
const chatController = require('../controllers/chatController');

router.post('/send', chatController.sendMessage);
router.get('/history/:gameId', chatController.getChatHistory);

module.exports = router;
