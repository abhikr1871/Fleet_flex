const express = require('express');
const connectDB = require('./api/config/db');
const userRoutes = require('./api/users/routes');
const captainRoutes=require("./api/captian/routes");
require('dotenv').config();
const cors = require('cors');

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json());

// Enable CORS only for frontend origin
app.use(cors({ origin: 'http://localhost:3000' }));

// Register routes for each module
app.use('/api/users', userRoutes);
app.use('/api/captain', captainRoutes);
module.exports = app;
