const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Vehicle",
    },
    captainId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Captain",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    username: {
      type: String,
      required: true,
    },
    userPhone: {
      type: String,
      required: true,
    },
    pickup: { type: Object, required: true },
    drop: { type: Object, required: true },
    distance: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    dateTime: { type: Date, default: Date.now },
    vehicleDetails: { type: Object, required: true },
    driverDetails: { type: Object, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);
