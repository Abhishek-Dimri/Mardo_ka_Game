const mongoose = require('mongoose');

const TileSchema = new mongoose.Schema({
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  index: { type: Number, required: true}, // Tile position on board
  type: {
    type: String,
    enum: [
      'property',   // regular property tile
      'start',      // starting tile
      'jail',       // jail tile
      'vacation',   // vacation tile (skip turn)
      'tax',        // tax tile (pay money)
      'surprise',   // surprise tile (random card)
      'airbase',    // special airbase tile
      'treasure',   // treasure tile (special rewards)
      'freeNuke',   // free nuke tile (special power-up)
      'goToJail'    // tile that sends player to jail (like "Go to jail")
    ],
    required: true
  },
  propertyRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
}, { timestamps: true });

module.exports = mongoose.model('Tile', TileSchema);