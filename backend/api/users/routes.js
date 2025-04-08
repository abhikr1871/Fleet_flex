const express = require("express");
const { signup, login, getProfile, updateUsername,updateProfileImage } = require("./controller");
const authenticate = require("../../middleware/auth");
const upload = require("../s3Uploader"); // Import S3 configuration
const router = express.Router();

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
module.exports = router;
