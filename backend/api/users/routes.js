const express = require("express");
const { signup, login, getProfile, updateUsername,updateProfileImage } = require("./controller");
const authenticate = require("../../middleware/auth");
const upload = require("../s3Uploader"); // Import S3 configuration
const router = express.Router();
const { getUpcomingRides } = require("./controller");
router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authenticate, getProfile);
router.put("/update-username", authenticate, updateUsername);
router.post(
  "/update-profile-image",
  authenticate,
  upload.single("profileImage"),
  updateProfileImage
);
router.get("/upcoming-rides", authenticate, getUpcomingRides);
module.exports = router;
