// scripts/seedStore.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Bomb = require('../models/Bomb');
const DefenseItem = require('../models/DefenseItem');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mardo';

const bombs = [
  { name: 'Sutli Bomb', intensity: 1, blastRadius: 1, price: 80 }, 
  { name: 'Tsar Bomba', intensity: 2, blastRadius: 1, price: 180 }, 
  { name: 'Hellfire Strike', intensity: 3, blastRadius: 2, price: 300 },
  { name: 'BrahMos Missile', intensity: 4, blastRadius: 2, price: 400 }, 
  { name: 'Nuke', intensity: 5, blastRadius: 3, price: 600 }
];

const defenseItems = [
  { name: 'HQ9', strength: 1, price: 100 }, 
  { name: 'Drum', strength: 2, price: 200 },
  { name: 'Iron Dome', strength: 3, price: 350 },
  { name: 'Aakash', strength: 4, price: 500 }, 
  { name: 'S400', strength: 5, price: 700 } 
];

async function seedStore() {
  await mongoose.connect(MONGO_URI);
  console.log('🟢 Connected to MongoDB');

  await Bomb.deleteMany({});
  await DefenseItem.deleteMany({});

  await Bomb.insertMany(bombs);
  await DefenseItem.insertMany(defenseItems);

  console.log('✅ Store items seeded successfully!');
  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB');
}

seedStore().catch(err => {
  console.error('❌ Error seeding store:', err);
});