const express = require('express');
const connectDB = require('./api/config/db');
const userRoutes = require('./api/users/routes');
const captainRoutes = require("./api/captian/routes");
const path = require("path");
const cors = require('cors');
require('dotenv').config();

// Import the upload middleware
const { uploadImageToS3 } = require('./middleware/uploadImage');

connectDB();
const app = express();
app.use(express.json());
app.use(cors());

// Upload route (Accepts Base64 images)
app.post('/upload', async (req, res) => {
    try {
        const { base64String, fileName, mimeType } = req.body;

        if (!base64String || !fileName || !mimeType) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const uploadResponse = await uploadImageToS3(base64String, fileName, mimeType);
        return res.json({ imageUrl: uploadResponse.Location });

    } catch (error) {
        console.error("S3 Upload Error:", error);
        res.status(500).json({ error: "Image upload failed" });
    }
});

// Register API routes
app.use('/api/users', userRoutes);
app.use('/api/captain', captainRoutes);

module.exports = app;
