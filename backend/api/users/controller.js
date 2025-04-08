const User = require("./model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id, username, email) => {
  return jwt.sign({ id, username, email }, process.env.JWT_Secret, {
    expiresIn: "1h",
  });
};

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

    const user = await User.create({
      username,
      email,
      password,
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

const getProfile = async (req, res) => {
  const result = {
    status: 0,
    message: "Profile fetched successfully",
    data: {},
  };

  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      result.message = "User not found";
      return res.status(404).json(result);
    }

    result.status = 1;
    result.data = {
      _id: user._id,
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      profileImage:
        user.profileImage ||
        "https://dummyimage.com/150x150/cccccc/000000&text=No+Image",
    };

    res.status(200).json(result);
  } catch (error) {
    result.message = error.message;
    res.status(500).json(result);
  }
};

const updateUsername = async (req, res) => {
  const result = {
    status: 0,
    message: "Username updated successfully",
    data: {},
  };

  try {
    // Replace the hardcoded user ID with the desired ID
    const userId = req.user._id;

    // Find the user by ID
    const user = await User.findById(userId).select("-password");

    if (!user) {
      result.message = "User not found";
      return res.status(404).json(result);
    }

    // Populate the response with user data
    result.status = 1;
    result.data = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profileImage:
        user.profileImage ||
        "https://dummyimage.com/150x150/cccccc/000000&text=No+Image",
    };

    res.status(200).json(result);
  } catch (error) {
    result.message = error.message;
    res.status(500).json(result);
  }
};

const updateProfileImage = async (req, res) => {
  try {
    // Check if file is uploaded
    const photograph = req.file ? req.file.location : null;

    if (!photograph) {
      return res.status(400).json({
        status: 0,
        message: "Image upload failed",
      });
    }

    console.log("Uploaded Profile Image URL:", photograph);

    // Update user profile image
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: photograph }, // <-- Make sure field matches your schema (profileImage)
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        status: 0,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: 1,
      message: "Profile image updated successfully",
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage, // <- Consistent key
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
  getProfile,
  updateUsername,
  updateProfileImage,
};
