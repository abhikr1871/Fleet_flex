const express = require("express");
const {
  signup,
  login,
  getVehicles,
  addVehicle,
  updateVehicleStatus,
} = require("./captain controller");
const auth = require("../../middleware/auth"); // Use require here

const router = express.Router();

router.post("/captain_sign_up", signup);
router.post("/captain_login", login);
router.get("/vehicles", auth, getVehicles); // Use auth middleware
router.post("/add_vehicle", auth, addVehicle); // Use auth middleware

// New route to update vehicle status (Go Live / Go Offline)
router.patch("/update_vehicle_status/:vehicleId", auth, updateVehicleStatus);

module.exports = router;
