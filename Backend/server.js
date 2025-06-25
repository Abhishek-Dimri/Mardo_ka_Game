const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const routes = require('./routes');
const connectDB = require('./config/db');
// Load environment variables from .env file
require('dotenv').config();

// Middleware to parse JSON
app.use(express.json());

// Connect to the database
connectDB();

// Use the routes defined in the routes directory
app.use('/api', routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

