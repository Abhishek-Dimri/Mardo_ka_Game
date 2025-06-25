const express = require('express');
const router = express.Router();

// Placeholder imports (controllers will be added later)
const gameController = require('../controllers/gameController');

router.post('/create', gameController.createGame);
// router.post('/join', gameController.joinGame);
// router.post('/start', gameController.startGame);
// router.get('/state/:gameId', gameController.getGameState);
// router.post('/leave', gameController.leaveGame);

module.exports = router;
