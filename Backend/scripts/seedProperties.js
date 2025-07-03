// scripts/seedProperties.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Property = require('../models/Property');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mardo';

const properties = [
  // Pakistan (cheapest)
  {
    name: 'Lahore',
    basePrice: 60,
    baseRent: 6,
    upgradeCostPerLevel: 30,
    hotelCost: 120,
    country: 'Pakistan'
  },
  {
    name: 'Karachi',
    basePrice: 65,
    baseRent: 7,
    upgradeCostPerLevel: 32,
    hotelCost: 125,
    country: 'Pakistan'
  },

  // Canada
  {
    name: 'Toronto',
    basePrice: 70,
    baseRent: 8,
    upgradeCostPerLevel: 34,
    hotelCost: 135,
    country: 'Canada'
  },
  {
    name: 'Vancouver',
    basePrice: 75,
    baseRent: 9,
    upgradeCostPerLevel: 36,
    hotelCost: 140,
    country: 'Canada'
  },
  {
    name: 'Montreal',
    basePrice: 78,
    baseRent: 9,
    upgradeCostPerLevel: 37,
    hotelCost: 145,
    country: 'Canada'
  },

  // Iran
  {
    name: 'Tehran',
    basePrice: 80,
    baseRent: 10,
    upgradeCostPerLevel: 38,
    hotelCost: 150,
    country: 'Iran'
  },
  {
    name: 'Isfahan',
    basePrice: 85,
    baseRent: 10,
    upgradeCostPerLevel: 40,
    hotelCost: 155,
    country: 'Iran'
  },
  {
    name: 'Shiraz',
    basePrice: 88,
    baseRent: 11,
    upgradeCostPerLevel: 41,
    hotelCost: 160,
    country: 'Iran'
  },

  // Ukraine (new addition)
  {
    name: 'Kyiv',
    basePrice: 90,
    baseRent: 11,
    upgradeCostPerLevel: 42,
    hotelCost: 165,
    country: 'Ukraine'
  },
  {
    name: 'Kharkiv',
    basePrice: 95,
    baseRent: 12,
    upgradeCostPerLevel: 43,
    hotelCost: 170,
    country: 'Ukraine'
  },
  {
    name: 'Odesa',
    basePrice: 98,
    baseRent: 12,
    upgradeCostPerLevel: 44,
    hotelCost: 175,
    country: 'Ukraine'
  },

  // Israel
  {
    name: 'Tel Aviv',
    basePrice: 100,
    baseRent: 12,
    upgradeCostPerLevel: 45,
    hotelCost: 180,
    country: 'Israel'
  },
  {
    name: 'Jerusalem',
    basePrice: 105,
    baseRent: 13,
    upgradeCostPerLevel: 47,
    hotelCost: 185,
    country: 'Israel'
  },
  {
    name: 'Haifa',
    basePrice: 108,
    baseRent: 13,
    upgradeCostPerLevel: 48,
    hotelCost: 190,
    country: 'Israel'
  },

  // Russia
  {
    name: 'Moscow',
    basePrice: 110,
    baseRent: 13,
    upgradeCostPerLevel: 49,
    hotelCost: 195,
    country: 'Russia'
  },
  {
    name: 'Saint Petersburg',
    basePrice: 115,
    baseRent: 14,
    upgradeCostPerLevel: 51,
    hotelCost: 200,
    country: 'Russia'
  },
  {
    name: 'Kazan',
    basePrice: 118,
    baseRent: 14,
    upgradeCostPerLevel: 52,
    hotelCost: 205,
    country: 'Russia'
  },

  // India
  {
    name: 'Mumbai',
    basePrice: 130,
    baseRent: 16,
    upgradeCostPerLevel: 55,
    hotelCost: 215,
    country: 'India'
  },
  {
    name: 'Delhi',
    basePrice: 135,
    baseRent: 17,
    upgradeCostPerLevel: 57,
    hotelCost: 220,
    country: 'India'
  },
  {
    name: 'Bangalore',
    basePrice: 138,
    baseRent: 18,
    upgradeCostPerLevel: 58,
    hotelCost: 225,
    country: 'India'
  },

  // China
  {
    name: 'Beijing',
    basePrice: 140,
    baseRent: 18,
    upgradeCostPerLevel: 60,
    hotelCost: 230,
    country: 'China'
  },
  {
    name: 'Shanghai',
    basePrice: 145,
    baseRent: 19,
    upgradeCostPerLevel: 62,
    hotelCost: 235,
    country: 'China'
  },
  {
    name: 'Guangzhou',
    basePrice: 148,
    baseRent: 20,
    upgradeCostPerLevel: 63,
    hotelCost: 240,
    country: 'China'
  },

  // USA
  {
    name: 'New York',
    basePrice: 150,
    baseRent: 20,
    upgradeCostPerLevel: 65,
    hotelCost: 250,
    country: 'USA'
  },
  {
    name: 'Los Angeles',
    basePrice: 155,
    baseRent: 21,
    upgradeCostPerLevel: 67,
    hotelCost: 255,
    country: 'USA'
  },
  {
    name: 'Chicago',
    basePrice: 160,
    baseRent: 22,
    upgradeCostPerLevel: 70,
    hotelCost: 260,
    country: 'USA'
  },

  // Space (most expensive)
  {
    name: 'International Space Station',
    basePrice: 230,
    baseRent: 35,
    upgradeCostPerLevel: 90,
    hotelCost: 360,
    country: 'Space'
  },
  {
    name: 'Moon Base Alpha',
    basePrice: 240,
    baseRent: 38,
    upgradeCostPerLevel: 100,
    hotelCost: 400,
    country: 'Space'
  }
];



async function seedProperties() {
  await mongoose.connect(MONGO_URI);
  console.log('🟢 Connected to MongoDB');

  // Clear existing properties (optional)
  await Property.deleteMany({});

  await Property.insertMany(properties);
  console.log('✅ Properties seeded successfully!');

  await mongoose.disconnect();
}

seedProperties().catch(err => {
  console.error('❌ Error seeding properties:', err);
});
