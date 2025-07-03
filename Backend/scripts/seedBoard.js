const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Board = require('../models/Board');
const Tile = require('../models/Tile');
const Property = require('../models/Property');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mardo';

async function seedBoard() {
  await mongoose.connect(MONGO_URI);
  console.log('🟢 Connected to MongoDB');

  await Board.deleteMany({});
  await Tile.deleteMany({});

  const board = new Board({ name: 'Classic Board', tiles: [] });
  await board.save();

  const boardId = board._id;

  // Map of property names in the desired order (30 total)
  const propertyNames = [
    "Lahore", "Karachi",
    "Toronto", "Vancouver", "Montreal",
    "Tehran", "Isfahan", "Shiraz",
    "Kyiv", "Kharkiv", "Odesa",
    "Tel Aviv", "Jerusalem", "Haifa",
    "Moscow", "Saint Petersburg", "Kazan",
    "Mumbai", "Delhi", "Bangalore",
    "Beijing", "Shanghai", "Guangzhou",
    "New York", "Los Angeles", "Chicago",
    "International Space Station", "Moon Base Alpha"
  ];

  const propertyMap = {};
  for (const name of propertyNames) {
    const prop = await Property.findOne({ name });
    if (!prop) {
      console.warn(`⚠️ Property not found: ${name}`);
    } else {
      propertyMap[name] = prop._id;
    }
  }

  const tileDefs = [
    { index: 0, type: 'start' },
    { index: 1, type: 'property', propertyName: 'Lahore' },
    { index: 2, type: 'property', propertyName: 'Karachi' },
    { index: 3, type: 'treasure' },
    { index: 4, type: 'property', propertyName: 'Toronto' },
    { index: 5, type: 'airbase' },
    { index: 6, type: 'property', propertyName: 'Vancouver' },
    { index: 7, type: 'surprise', surpriseCardType: 'gainMoney' },
    { index: 8, type: 'property', propertyName: 'Montreal' },
    { index: 9, type: 'treasure' },
    { index: 10, type: 'property', propertyName: 'Tehran' },
    { index: 11, type: 'jail' },
    { index: 12, type: 'property', propertyName: 'Isfahan' },
    { index: 13, type: 'property', propertyName: 'Shiraz' },
    { index: 14, type: 'property', propertyName: 'Kyiv' },
    { index: 15, type: 'surprise', surpriseCardType: 'loseMoney' },
    { index: 16, type: 'airbase' },
    { index: 17, type: 'property', propertyName: 'Kharkiv' },
    { index: 18, type: 'property', propertyName: 'Odesa' },
    { index: 19, type: 'property', propertyName: 'Tel Aviv' },
    { index: 20, type: 'freeNuke', surpriseCardType: 'freeNuke' },
    { index: 21, type: 'property', propertyName: 'Jerusalem' },
    { index: 22, type: 'vacation' },
    { index: 23, type: 'property', propertyName: 'Haifa' },
    { index: 24, type: 'property', propertyName: 'Moscow' },
    { index: 25, type: 'property', propertyName: 'Saint Petersburg' },
    { index: 26, type: 'property', propertyName: 'Kazan' },
    { index: 27, type: 'airbase' },
    { index: 28, type: 'surprise', surpriseCardType: 'gainMoney' },
    { index: 29, type: 'property', propertyName: 'Mumbai' },
    { index: 30, type: 'property', propertyName: 'Delhi' },
    { index: 31, type: 'property', propertyName: 'Bangalore' },
    { index: 32, type: 'treasure' },
    { index: 33, type: 'goToJail' },
    { index: 34, type: 'property', propertyName: 'Beijing' },
    { index: 35, type: 'property', propertyName: 'Shanghai' },
    { index: 36, type: 'property', propertyName: 'Guangzhou' },
    { index: 37, type: 'treasure' },
    { index: 38, type: 'airbase' },
    { index: 39, type: 'property', propertyName: 'New York' },
    { index: 40, type: 'property', propertyName: 'Los Angeles' },
    { index: 41, type: 'property', propertyName: 'Chicago' },
    { index: 42, type: 'property', propertyName: 'International Space Station' },
    { index: 43, type: 'property', propertyName: 'Moon Base Alpha' }
  ];

  const boardTiles = [];

  for (const def of tileDefs) {
    const tile = await Tile.create({
      boardId,
      index: def.index,
      type: def.type,
      propertyRef: def.propertyName ? propertyMap[def.propertyName] : undefined,
      taxAmount: def.taxAmount || undefined,
      surpriseCardType: def.surpriseCardType || undefined
    });
    boardTiles.push(tile._id);
  }

  board.tiles = boardTiles;
  await board.save();

  console.log(`✅ Board "${board.name}" seeded successfully with ${tileDefs.length} tiles.`);

  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB');
}

seedBoard().catch(err => {
  console.error('❌ Error seeding board:', err);
});
