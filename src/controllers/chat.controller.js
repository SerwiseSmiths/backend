"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMutualFriends = exports.updateUsername = exports.shareComplaint = exports.getChatHistory = void 0;
const chat_service_1 = require("../services/chat.service");
const username_service_1 = require("../services/username.service");
const asyncHandler_util_1 = require("../utils/asyncHandler.util");
exports.getChatHistory = (0, asyncHandler_util_1.asyncHandler)(async (req, res) => {
    const { targetId, targetType } = req.query;
    const userId = req.user.id;
    const history = await chat_service_1.default.getChatHistory(userId, targetId, targetType);
    res.status(200).json({ success: true, data: history });
});
exports.shareComplaint = (0, asyncHandler_util_1.asyncHandler)(async (req, res) => {
    const { recipientId, recipientType, complaintId } = req.body;
    const senderId = req.user.id;
    const message = await chat_service_1.default.shareComplaint(senderId, recipientId, recipientType, complaintId);
    res.status(200).json({ success: true, data: message });
});
exports.updateUsername = (0, asyncHandler_util_1.asyncHandler)(async (req, res) => {
    const { newUsername } = req.body;
    const userId = req.user.id;
    const user = await username_service_1.default.updateUsername(userId, newUsername);
    res.status(200).json({ success: true, data: user });
});
exports.getMutualFriends = (0, asyncHandler_util_1.asyncHandler)(async (req, res) => {
    const { otherUserId } = req.query;
    const userId = req.user.id;
    const friends = await chat_service_1.default.getMutualFriends(userId, otherUserId);
    res.status(200).json({ success: true, data: friends });
});
//# sourceMappingURL=chat.controller.js.map