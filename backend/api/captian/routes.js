const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  signup,
  login,
  getVehicles,
  addVehicle,
  updateVehicleStatus,
  delete_vehicle
} = require("./captain controller");
const auth = require("../../middleware/auth");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const suffix = Date.now();
    cb(null, suffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/captain_sign_up", signup);
router.post("/captain_login", login);
router.get("/vehicles", auth, getVehicles);
router.post("/add_vehicle", auth, upload.single("photo"), addVehicle);
router.patch("/update_vehicle_status/:vehicleId", auth, updateVehicleStatus);
router.patch("/delete_vehicle/:vehicleId", auth, delete_vehicle);

module.exports = router;
