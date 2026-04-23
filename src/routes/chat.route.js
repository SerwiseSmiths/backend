"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const chatController = require("../controllers/chat.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.auth);
router.get("/history", chatController.getChatHistory);
router.post("/share-complaint", chatController.shareComplaint);
router.post("/username", chatController.updateUsername);
router.get("/mutual-friends", chatController.getMutualFriends);
exports.default = router;
//# sourceMappingURL=chat.route.js.map