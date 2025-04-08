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
} = require("./captain controller");

const router = express.Router();

router.post("/captain_sign_up", signup);
router.post("/captain_login", login);
router.get("/vehicles", auth, getVehicles);
router.post("/add_vehicle", auth, upload.single("photo"), addVehicle); // Updated for AWS S3
router.patch("/update_vehicle_status/:vehicleId", auth, updateVehicleStatus);
router.patch("/delete_vehicle/:vehicleId", auth, delete_vehicle);
router.post("/search_vehicles", auth, searchVehicles);

module.exports = router;
