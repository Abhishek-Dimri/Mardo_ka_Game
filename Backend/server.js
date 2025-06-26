const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const routes = require('./routes');
const connectDB = require('./config/db');
const cors = require('cors')

// Load environment variables from .env file
require('dotenv').config();

// Middleware to parse JSON
app.use(express.json());

// Connect to the database
connectDB();

// Use the routes defined in the routes directory
app.use('/api', routes);

// Middleware for CORS
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

