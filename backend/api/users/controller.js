const User = require("./model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Function to generate JWT token
const generateToken = (id, username, email) => {
  return jwt.sign({ id, username, email }, process.env.JWT_Secret, {
    expiresIn: "1h",
  });
};

// Signup function
const signup = async (req, res) => {
  const { username, email, password } = req.body;

  const result = {
    status: 0,
    message: "User successfully registered",
    data: {},
  };

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      result.message = "User already exists";
      return res.status(400).json(result);
    }

    const userCount = await User.countDocuments();
    const userId = userCount + 1;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      user_id: userId,
    });

    const resp_data = {
      _id: user._id,
      user_id: userId,
      username: user.username,
      email: user.email,
      token: generateToken(user._id, user.username, user.email),
    };

    result.data = resp_data;
    result.status = 1;
    res.status(200).json(result);
  } catch (error) {
    result.message = error.message;
    res.status(500).json(result);
  }
};

// Login function
const login = async (req, res) => {
  const { email, password } = req.body;

  const result = {
    status: 0,
    message: "User successfully logged in",
    data: {},
  };

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const resp_data = {
        _id: user._id,
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id, user.username, user.email),
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

// Get Profile function
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        status: 0,
        message: "User not found",
      });
    }
    res.json({
      status: 1,
      data: user,
    });
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({
      status: 0,
      message: "Server error while fetching profile",
    });
  }
};

// Update Username function
const updateUsername = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({
        status: 0,
        message: "Username is required",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username },
      { new: true }
    ).select("-password");

    res.json({
      status: 1,
      message: "Username updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error in updateUsername:", error);
    res.status(500).json({
      status: 0,
      message: "Server error while updating username",
    });
  }
};

// Update Profile Image function
const updateProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        status: 0,
        message: "User not found",
      });
    }

    // Check if file exists and get S3 URL
    let profileImage = req.file ? req.file.location : null;
    if (!profileImage) {
      return res.status(400).json({
        status: 0,
        message: "Image upload failed",
      });
    }

    // Update user with new profile image
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: profileImage },
      { new: true }
    ).select("-password");

    res.status(200).json({
      status: 1,
      message: "Profile image updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({
      status: 0,
      message: "Server error while updating profile image",
    });
  }
};

module.exports = {
  signup,
  login,
  getProfile,
  updateUsername,
  updateProfileImage,
};
