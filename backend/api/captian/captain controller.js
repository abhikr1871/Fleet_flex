const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Captain = require("./captain_model"); // Assuming Captain model is in `models/Captain.js`

// Generate JWT Token
const generateToken = (id, username, email) => {
  return jwt.sign({ id, username, email }, process.env.JWT_Secret, {
    expiresIn: "1h",
  });
};

// Captain Signup
const signup = async (req, res) => {
  const { username, email, password } = req.body;

  const result = {
    status: 0,
    message: "Captain successfully registered",
    data: {},
  };

  try {
    const existingCaptain = await Captain.findOne({ email });

    if (existingCaptain) {
      result.message = "Captain already exists";
      return res.status(400).json(result);
    }

    const captainCount = await Captain.countDocuments();
    const captainId = captainCount + 1;

    const captain = await Captain.create({
      username,
      email,
      password,
      captain_id: captainId,
    });

    const resp_data = {
      _id: captain._id,
      captain_id: captainId,
      username: captain.username,
      email: captain.email,
      token: generateToken(captain._id, captain.username, captain.email),
    };

    result.data = resp_data;
    result.status = 1;
    res.status(200).json(result);
  } catch (error) {
    result.message = error.message;
    res.status(500).json(result);
  }
};

// Captain Login
const login = async (req, res) => {
  const { email, password } = req.body;

  const result = {
    status: 0,
    message: "Captain successfully logged in",
    data: {},
  };

  try {
    const captain = await Captain.findOne({ email });

    if (captain && (await bcrypt.compare(password, captain.password))) {
      const resp_data = {
        _id: captain._id,
        captain_id: captain.captain_id,
        username: captain.username,
        email: captain.email,
        vehicle: captain.vehicle, // Return vehicle details if available
        token: generateToken(captain._id, captain.username, captain.email),
      };

      result.data = resp_data;
      result.status = 1;
      res.status(200).json(result);
    } else {
      result.message = "Invalid email or password";
      res.status(401).json(result);
    }
  } catch (error) {
    result.message = error.message;
    res.status(500).json(result);
  }
};

// Get Vehicles
const getVehicles = async (req, res) => {
  try {
    const captain = await Captain.findById(req.user.id);
    res.status(200).json({ status: 1, data: captain.vehicles });
  } catch (error) {
    res.status(500).json({ status: 0, message: error.message });
  }
};

// Add Vehicle
const addVehicle = async (req, res) => {
  try {
    const captain = await Captain.findById(req.user.id);
    if (!captain) {
      return res.status(404).json({ status: 0, message: "Captain not found" });
    }

    // Extract vehicle details
    const { name, model, capacity, perKmRate, numberplate, type } = req.body;
    console.log("Uploaded File:", req.file);

    // Check if a file was uploaded
    const photograph = req.file ? `/uploads/${req.file.filename}` : null;


    // Create a new vehicle object
    const newVehicle = {
      name,
      model,
      capacity,
      perKmRate,
      numberplate,
      type,
      photo:photograph, // Save image URL
      isLive: false, // Default status
    };

    // Add vehicle to captain's profile
    captain.vehicles.push(newVehicle);
    await captain.save();

    res.status(200).json({
      status: 1,
      message: "Vehicle added successfully",
      data: newVehicle,
    });
  } catch (error) {
    res.status(500).json({ status: 0, message: error.message });
  }
};

// Update Vehicle Status (Go Live / Go Offline)
// This function updates the "isLive" property of a specific vehicle.
// The new status is provided in the request body (e.g., { isLive: true } or { isLive: false }).
const updateVehicleStatus = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { isLive } = req.body; // expect a boolean value
    const captain = await Captain.findById(req.user.id);
    const vehicle = captain.vehicles.find(
      (v) => v._id.toString() === vehicleId
    );

    if (!vehicle) {
      return res.status(404).json({ status: 0, message: "Vehicle not found" });
    }

    // Update the vehicle's live status
    vehicle.isLive = isLive;
    await captain.save();

    const message = isLive ? "Vehicle is now live" : "Vehicle is now offline";
    res.status(200).json({ status: 1, message });
  } catch (error) {
    res.status(500).json({ status: 0, message: error.message });
  }
};

module.exports = {
  signup,
  login,
  getVehicles,
  addVehicle,
  updateVehicleStatus,
};
