const Booking = require("./Booking");
const Captain = require("../captian/captain_model");
const User = require("../users/model"); // Import User model

const createBooking = async (req, res) => {
  try {
    const {
      vehicleId,
      captainId,
      pickup,
      drop,
      distance,
      totalPrice,
      dateTime,
      vehicleDetails,
      driverDetails,
    } = req.body;

    // Get the logged-in user (assumed to be set by the auth middleware)
    const userId = req.user.id;

    // Fetch user details for username and phone
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 0, message: "User not found" });
    }

    const booking = await Booking.create({
      vehicleId,
      captainId,
      userId,
      username: user.username, // Add username
      userPhone: user.phone, // Add user phone
      pickup,
      drop,
      distance,
      totalPrice,
      dateTime,
      vehicleDetails,
      driverDetails,
      status: "pending",
    });

    // Add this booking to the captain's ride requests
    await Captain.updateOne(
      { _id: captainId },
      { $push: { rideRequests: booking._id } }
    );

    res.status(201).json({
      status: 1,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ status: 0, message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ status: 0, message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    if (status === "accepted") {
      // Add to upcomingrides for both captain and user if not already present
      await Captain.updateOne(
        { _id: booking.captainId },
        {
          $addToSet: { upcomingrides: booking._id },
          $pull: { rideRequests: booking._id }, // Remove from rideRequests
        }
      );
      await User.updateOne(
        { _id: booking.userId },
        { $addToSet: { upcomingrides: booking._id } }
      );
    } else if (status === "rejected") {
      // Remove from captain's rideRequests if rejected as well
      await Captain.updateOne(
        { _id: booking.captainId },
        { $pull: { rideRequests: booking._id } }
      );
    }

    res.json({ status: 1, message: "Booking status updated", data: booking });
  } catch (error) {
    res.status(500).json({ status: 0, message: error.message });
  }
};

module.exports = { createBooking, updateBookingStatus };
