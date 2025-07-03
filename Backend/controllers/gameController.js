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
    const { gameId, username, color, socketId } = req.body;

    if (!gameId || !username || !color || !socketId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    if (game.status !== 'waiting') return res.status(403).json({ error: 'Game already started or ended' });

    const existingPlayers = await Player.find({ gameId });

    const isNameTaken = existingPlayers.some(p => p.username === username);
    const isColorTaken = existingPlayers.some(p => p.color === color);
    if (isNameTaken) return res.status(409).json({ error: 'Username already taken' });
    if (isColorTaken) return res.status(409).json({ error: 'Color already taken' });

    if (existingPlayers.length >= 6) return res.status(403).json({ error: 'Room full' });

    const newPlayer = await Player.create({
      username,
      color,
      gameId,
      socketId
    });

    if (existingPlayers.length === 0) {
      game.ownerId = newPlayer._id;
    }

    // Update playerOrder in Game
    game.playerOrder.push(newPlayer._id);
    await game.save();

    // 🧠 Broadcast to all sockets in that game room
    global.io.to(game._id.toString()).emit('playerJoined', {
      player: {
        username: newPlayer.username,
        color: newPlayer.color,
        playerId: newPlayer._id
      },
      gameId: game._id,
      currentPlayers: [
        ...existingPlayers.map(p => ({ username: p.username, color: p.color })),
        { username: newPlayer.username, color: newPlayer.color }
      ]
    });

    return res.status(200).json({
      message: 'Joined game successfully',
      playerId: newPlayer._id,
      gameId: game._id,
      gameOwner: game.ownerId
    });

  } catch (err) {
    console.error('Error in joinGame:', err);
    return res.status(500).json({ error: 'Server error while joining game' });
  }
};


exports.startGame = async (req, res) => {
  const { gameId, playerId } = req.body;

  const game = await Game.findById(gameId);
  if (!game || game.status !== 'waiting') return res.status(400).json({ error: 'Game not found or already started' });

  if (!game.ownerId.equals(playerId)) return res.status(403).json({ error: 'Only game owner can start' });

  const players = await Player.find({ gameId });
  if (players.length < 2) return res.status(400).json({ error: 'Need at least 2 players to start' });

  // Utility function to shuffle an array
  const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
  };

  // Apply shuffle before assigning playerOrder
  const playerIds = players.map(p => p._id);
  const shuffledPlayerOrder = shuffleArray([...playerIds]);

  game.status = 'active';
  game.playerOrder = shuffledPlayerOrder;
  game.currentTurnPlayerId = shuffledPlayerOrder[0];
  game.startTime = new Date();
  await game.save();

  res.json({ message: 'Game started', currentTurnPlayerId: game.currentTurnPlayerId, playerOrder: game.playerOrder });
};