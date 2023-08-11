// conversationRoutes.js
const express = require("express");
const router = express.Router();
const protect = require("../../middlewares/authentication");
const conversationController = require("../../controllers/conversationController");

// POST /api/conversations
router.post("/createConv", protect, conversationController.createConversation);

router.get("/getConv", protect, conversationController.getUserConversations);

router.get(
  "/:conversationId/getMessages",
  protect,
  conversationController.getMessages
);

router.post(
  "/:conversationId/sendMessage",
  protect,
  conversationController.sendMessage
);

module.exports = router;
