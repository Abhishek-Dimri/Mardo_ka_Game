const Game = require('../models/Game');
const Board = require('../models/Board');

exports.createGame = async (req, res) => {
  try {
    const board = await Board.create({ name: 'Default Board', tiles: [] });
    const game = await Game.create({ boardId: board._id, status: 'waiting' });

    return res.status(201).json({
      message: 'Game created successfully',
      gameId: game._id,
      joinLink: `https://your-frontend-url.com/join/${game._id}`
    });
  } catch (error) {
    console.error('Error creating game:', error);
    return res.status(500).json({ error: 'Failed to create game' });
  }
};
