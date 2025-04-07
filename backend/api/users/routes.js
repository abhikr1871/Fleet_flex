const express = require("express");
const {
  signup,
  login,
  getProfile,
  updateUsername,
  updateProfileImage,
} = require("./controller");
const { authenticate } = require("../../middleware/auth");
const upload = require("../../middleware/uploadImage");

const router = express.Router();

// Auth routes
router.post("/signup", signup);
router.post("/login", login);

// Protected routes
router.get("/profile", authenticate, getProfile);
router.put("/update-username", authenticate, updateUsername);
router.post(
  "/update-profile-image",
  authenticate,
  upload.single("profileImage"),
  updateProfileImage
);

module.exports = router;
