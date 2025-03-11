const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const vehicleSchema = new mongoose.Schema({
  name: String,
  model: String,
  capacity: Number,
  perKmRate: Number,
  numberplate: String,
  type: String,
  photo: String, // Added field for vehicle image URL
  isLive: { type: Boolean, default: false },
});

const captainSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    vehicles: [vehicleSchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

captainSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("Captain", captainSchema);
