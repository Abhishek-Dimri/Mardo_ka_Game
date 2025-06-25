const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tiles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tile'
  }],
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Board', BoardSchema);