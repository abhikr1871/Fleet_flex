const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const vehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    model: { type: String, required: true },
    capacity: { type: Number, required: true },
    perKmRate: { type: Number, required: true },
    numberplate: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ["transport", "passenger travel"],
      required: true,
    },
    fuelType: {
      type: String,
      enum: ["petrol", "diesel", "CNG", "electric"],
      required: true,
    },
    dimensions: {
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
    },
    weightCapacity: { type: Number, default: 0 },
    acAvailable: { type: Boolean, default: false },
    photo: { type: String, required: true },
    isLive: { type: Boolean, default: false },
    driver: {
      name: { type: String, required: true },
      contact: { type: String, required: true },
      licenseNumber: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const captainSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    vehicles: [vehicleSchema],
    createdAt: { type: Date, default: Date.now },
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
