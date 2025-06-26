const Game = require('../models/Game');
const Board = require('../models/Board');
const Player = require('../models/Player');

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

exports.joinGame = async (req, res) => {
  try {
    const { gameId, username, color } = req.body;

    if (!gameId || !username || !color) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    if (game.status !== 'waiting') return res.status(403).json({ error: 'Game already started or ended' });

    const existingPlayers = await Player.find({ gameId });

    // Username + color must be unique in room
    const isNameTaken = existingPlayers.some(p => p.username === username);
    const isColorTaken = existingPlayers.some(p => p.color === color);
    if (isNameTaken) return res.status(409).json({ error: 'Username already taken in this game' });
    if (isColorTaken) return res.status(409).json({ error: 'Color already taken in this game' });

    // Optional: limit to 6 players
    if (existingPlayers.length >= 6) {
      return res.status(403).json({ error: 'Game room is full' });
    }

    // Create new player
    const newPlayer = await Player.create({
      username,
      color,
      gameId
    });

    // Update playerOrder in Game
    game.playerOrder.push(newPlayer._id);
    await game.save();

    return res.status(200).json({
      message: 'Joined game successfully',
      playerId: newPlayer._id,
      gameId: game._id
    });

  } catch (err) {
    console.error('Error in joinGame:', err);
    return res.status(500).json({ error: 'Server error while joining game' });
  }
};
