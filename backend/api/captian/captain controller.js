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


const getVehicles = async (req, res) => {
  try {
    const captain = await Captain.findById(req.user.id);
    res.status(200).json({ status: 1, data: captain.vehicles });
  } catch (error) {
    res.status(500).json({ status: 0, message: error.message });
  }
};

const addVehicle = async (req, res) => {
  try {
    const captain = await Captain.findById(req.user.id);
    const newVehicle = req.body;
    captain.vehicles.push(newVehicle);
    await captain.save();
    res
      .status(200)
      .json({ status: 1, message: "Vehicle added", data: captain.vehicles });
  } catch (error) {
    res.status(500).json({ status: 0, message: error.message });
  }
};

const goLive = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const captain = await Captain.findById(req.user.id);
    const vehicle = captain.vehicles.find(
      (v) => v._id.toString() === vehicleId
    );

    if (!vehicle)
      return res.status(404).json({ status: 0, message: "Vehicle not found" });

    vehicle.isLive = true;
    await captain.save();

    res.status(200).json({ status: 1, message: "Vehicle is now live" });
  } catch (error) {
    res.status(500).json({ status: 0, message: error.message });
  }
};




module.exports = { signup, login , getVehicles, addVehicle };
