const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const authenticate = require("../middleware/auth");

router.get("/", authenticate, chatController.getChatHistory);

module.exports = router;
