const express = require("express");
const router = express.Router();
const { createBooking, updateBookingStatus } = require("./bookingController");
const authMiddleware = require("../../middleware/auth"); // Ensure this exists

// POST /api/bookings will create a booking
router.post("/", authMiddleware, createBooking);
router.patch("/:id", authMiddleware, updateBookingStatus);

module.exports = router;