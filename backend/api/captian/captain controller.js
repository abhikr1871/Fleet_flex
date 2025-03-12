const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Captain = require("./captain_model"); // Adjust path as needed

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
    // Verify that the captain exists
    const captain = await Captain.findById(req.user.id);
    if (!captain) {
      return res.status(404).json({ status: 0, message: "Captain not found" });
    }

    // Extract flat keys from req.body
    const {
      name,
      model,
      capacity,
      perKmRate,
      numberplate,
      type,
      fuelType,
      weightCapacity,
      acAvailable,
    } = req.body;

    // Reconstruct dimensions and driver objects from flat keys
    const dimensions = {
      length: req.body["dimensions.length"] || 0,
      width: req.body["dimensions.width"] || 0,
      height: req.body["dimensions.height"] || 0,
    };

    const driver = {
      name: req.body["driver.name"],
      contact: req.body["driver.contact"],
      licenseNumber: req.body["driver.licenseNumber"],
    };

    // Validate required fields for the new vehicle only
    if (
      !name ||
      !model ||
      !capacity ||
      !perKmRate ||
      !numberplate ||
      !type ||
      !fuelType ||
      !driver.name ||
      !driver.contact ||
      !driver.licenseNumber
    ) {
      return res
        .status(400)
        .json({ status: 0, message: "Missing required fields" });
    }

    console.log(
      "Request Driver Details:",
      driver.name,
      driver.contact,
      driver.licenseNumber
    );

    // Check if a file was uploaded
    const photograph = req.file ? `/uploads/${req.file.filename}` : null;

    // Create the new vehicle object
    const newVehicle = {
      name,
      model,
      capacity,
      perKmRate,
      numberplate,
      type,
      fuelType,
      weightCapacity: weightCapacity || 0,
      acAvailable: acAvailable || false,
      photo: photograph,
      isLive: false,
      dimensions,
      driver,
    };

    // Instead of pushing and then saving (which revalidates all vehicles),
    // use an atomic update so only the new vehicle is validated.
    await Captain.updateOne(
      { _id: req.user.id },
      { $push: { vehicles: newVehicle } },
      { runValidators: true }
    );

    console.log("New Vehicle:", newVehicle);

    res.status(200).json({
      status: 1,
      message: "Vehicle added successfully",
      data: newVehicle,
    });
  } catch (error) {
    console.error("Error adding vehicle:", error);
    res.status(500).json({ status: 0, message: error.message });
  }
};

// Update Vehicle Status (Go Live / Go Offline)
const updateVehicleStatus = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { isLive } = req.body;
    // Use an atomic update to modify just the vehicle's isLive field
    const result = await Captain.updateOne(
      { _id: req.user.id, "vehicles._id": vehicleId },
      { $set: { "vehicles.$.isLive": isLive } },
      { runValidators: true }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ status: 0, message: "Vehicle not found or not updated" });
    }

    console.log("Update Vehicle Status Request:", req.body);
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
