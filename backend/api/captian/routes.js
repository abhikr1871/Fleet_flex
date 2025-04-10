const express = require("express");
const auth = require("../../middleware/auth");
const upload = require("../s3Uploader"); // Import S3 configuration
const {
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
} = require("./captain controller");

const router = express.Router();

// Authentication routes
router.post("/captain_sign_up", signup);
router.post("/captain_login", login);

// Vehicle routes
router.get("/vehicles", auth, getVehicles);
router.post("/add_vehicle", auth, upload.single("photo"), addVehicle); // Updated for AWS S3
router.patch("/update_vehicle_status/:vehicleId", auth, updateVehicleStatus);
router.patch("/delete_vehicle/:vehicleId", auth, delete_vehicle);
router.post("/search_vehicles", auth, searchVehicles);

// Captain profile routes
router.get("/profile", auth, getCaptainProfile); // Fetch captain profile
router.put("/update-username", auth, updateCaptainUsername); // Update captain username
router.post(
  "/update-profile-image",
  auth,
  upload.single("profileImage"), // Middleware for handling file uploads
  updateCaptainProfileImage
); // Update captain profile image

module.exports = router;
