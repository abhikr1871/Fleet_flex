const express = require('express');
const connectDB = require('./api/config/db');
const userRoutes = require('./api/users/routes');
const captainRoutes=require("./api/captian/routes");
const path = require("path");
require('dotenv').config();
const cors = require('cors');

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Enable CORS only for frontend origin
app.use(cors());
console.log("Uploads directory:", path.join(__dirname, "uploads"));
// Register routes for each module
app.use('/api/users', userRoutes);
app.use('/api/captain', captainRoutes);
module.exports = app;
