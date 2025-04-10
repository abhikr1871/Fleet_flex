const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Captain = require("./captain_model"); // Adjust path as needed

// Generate JWT Token
const generateToken = (id, username, email) => {
  return jwt.sign({ id, username, email }, process.env.JWT_Secret, {
    expiresIn: "30d",
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

    const hashedPassword = await bcrypt.hash(password, 10);
    const captainCount = await Captain.countDocuments();
    const captainId = captainCount + 1;

    const captain = await Captain.create({
      username,
      email,
      password: hashedPassword,
      captain_id: captainId,
    });

    result.status = 1;
    result.data = {
      _id: captain._id,
      captain_id: captainId,
      username: captain.username,
      email: captain.email,
      token: generateToken(captain._id, captain.username, captain.email),
    };

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
      result.status = 1;
      result.data = {
        _id: captain._id,
        // captain_id: captain.captain_id,
        username: captain.username,
        email: captain.email,
        vehicle: captain.vehicles || [],
        token: generateToken(captain._id, captain.username, captain.email),
      };
      return res.status(200).json(result);
    } else {
      result.message = "Invalid email or password";
      return res.status(401).json(result);
    }
  } catch (error) {
    result.message = error.message;
    res.status(500).json(result);
  }
};

// Get Vehicles
const getVehicles = async (req, res) => {
  try {
    const captain = await Captain.findById(req.user.id).lean();
    res.status(200).json({ status: 1, data: captain.vehicles || [] });
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

    const photograph = req.file?.location;
    if (!photograph) {
      return res
        .status(400)
        .json({ status: 0, message: "Image upload failed" });
      return res
        .status(400)
        .json({ status: 0, message: "Image upload failed" });
    }

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

    captain.vehicles.push(newVehicle);
    await captain.save();

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

// Delete Vehicle
const delete_vehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const result = await Captain.updateOne(
      { _id: req.user.id },
      { $pull: { vehicles: { _id: vehicleId } } }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ status: 0, message: "Vehicle not found or not deleted" });
    }

    res.status(200).json({ status: 1, message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    res.status(500).json({ status: 0, message: error.message });
  }
};

// Update Vehicle Status (Live/Offline)
const updateVehicleStatus = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { isLive, latitude, longitude, bookingType } = req.body;

    const updateQuery = { "vehicles.$.isLive": isLive };

    if (isLive && latitude && longitude) {
      updateQuery["vehicles.$.location"] = {
        type: "Point",
        coordinates: [longitude, latitude],
      };
      if (bookingType) {
        updateQuery["vehicles.$.bookingType"] = bookingType;
      }
    }

    const result = await Captain.updateOne(
      { _id: req.user.id, "vehicles._id": vehicleId },
      { $set: updateQuery },
      { runValidators: true }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ status: 0, message: "Vehicle not found or not updated" });
    }

    const message = isLive
      ? `Vehicle is now live with ${bookingType} booking type and location updated`
      : "Vehicle is now offline";

    res.status(200).json({ status: 1, message });
  } catch (error) {
    console.error("Error updating vehicle status:", error);
    res.status(500).json({ status: 0, message: error.message });
  }
};

// Search Vehicles Within Radius (Geo Search)
const searchVehicles = async (req, res) => {
  try {
    const { pickup, searchRadius } = req.body;

    if (!pickup || !pickup.coordinates || !searchRadius) {
      return res.status(400).json({
        status: 0,
        message: "Invalid pickup location or radius",
      });
    }

    // Flatten all captain vehicles & filter
    const captains = await Captain.find({
      vehicles: { $exists: true, $ne: [] },
    });

    const matchingVehicles = [];

    for (const captain of captains) {
      for (const vehicle of captain.vehicles) {
        if (
          vehicle.isLive &&
          vehicle.location &&
          vehicle.location.coordinates
        ) {
          const [lng, lat] = vehicle.location.coordinates;

          const R = 6371; // Earth radius in km
          const toRad = (val) => (val * Math.PI) / 180;

          const dLat = toRad(pickup.coordinates.lat - lat);
          const dLng = toRad(pickup.coordinates.lng - lng);
          const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat)) *
              Math.cos(toRad(pickup.coordinates.lat)) *
              Math.sin(dLng / 2) ** 2;

          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * c;

          if (distance <= searchRadius) {
            matchingVehicles.push(vehicle);
          }
        }
      }
    }

    res.status(200).json({ status: 1, data: matchingVehicles });
  } catch (error) {
    console.error("Error searching vehicles:", error);
    res.status(500).json({ status: 0, message: error.message });
  }
};
const getCaptainProfile = async (req, res) => {
  const result = {
    status: 0,
    message: "Profile fetched successfully",
    data: {},
  };

  try {
    const captain = await Captain.findById(req.user.id).select("-password");

    if (!captain) {
      result.message = "Captain not found";
      return res.status(404).json(result);
    }

    result.status = 1;
    result.data = {
      _id: captain._id,
      captain_id: captain.captain_id,
      username: captain.username,
      email: captain.email,
      profileImage:
        captain.profileImage ||
        "https://dummyimage.com/150x150/cccccc/000000&text=No+Image",
    };

    res.status(200).json(result);
  } catch (error) {
    result.message = error.message;
    res.status(500).json(result);
  }
};

const updateCaptainUsername = async (req, res) => {
  const result = {
    status: 0,
    message: "Username updated successfully",
    data: {},
  };

  try {
    const captainId = req.user.id;

    const captain = await Captain.findById(captainId).select("-password");

    if (!captain) {
      result.message = "Captain not found";
      return res.status(404).json(result);
    }

    // Update the username
    captain.username = req.body.username;
    await captain.save();

    result.status = 1;
    result.data = {
      _id: captain._id,
      username: captain.username,
      email: captain.email,
      profileImage:
        captain.profileImage ||
        "https://dummyimage.com/150x150/cccccc/000000&text=No+Image",
    };

    res.status(200).json(result);
  } catch (error) {
    result.message = error.message;
    res.status(500).json(result);
  }
};

const updateCaptainProfileImage = async (req, res) => {
  try {
    const photograph = req.file ? req.file.location : null;

    if (!photograph) {
      return res.status(400).json({
        status: 0,
        message: "Image upload failed",
      });
    }

    console.log("Uploaded Profile Image URL:", photograph);

    const captain = await Captain.findByIdAndUpdate(
      req.user.id,
      { profileImage: photograph },
      { new: true }
    ).select("-password");

    if (!captain) {
      return res.status(404).json({
        status: 0,
        message: "Captain not found",
      });
    }

    res.status(200).json({
      status: 1,
      message: "Profile image updated successfully",
      data: {
        _id: captain._id,
        username: captain.username,
        email: captain.email,
        profileImage: captain.profileImage,
      },
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

module.exports = {
  signup,
  login,
  getVehicles,
  addVehicle,
  updateVehicleStatus,
  delete_vehicle,
  searchVehicles,
  getCaptainProfile,
  updateCaptainUsername,
  updateCaptainProfileImage,
};
