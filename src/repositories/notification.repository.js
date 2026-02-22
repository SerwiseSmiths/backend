"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Notification_schema_1 = require("../models/schema/Notification.schema");
const DeviceToken_schema_1 = require("../models/schema/DeviceToken.schema");
class NotificationRepository {
    // --- Notification CRUD ---
    async createNotification(data) {
        return await Notification_schema_1.default.create(data);
    }
    async getUserNotifications(userId, limit = 20, skip = 0) {
        return await Notification_schema_1.default.find({
            $or: [
                { target: "ALL" },
                { target: "USER", userId: userId }
                // TODO: Group logic if needed
            ]
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
    }
    async getUnseenNotificationCount(userId) {
        return await Notification_schema_1.default.countDocuments({
            $or: [
                { target: "ALL" },
                { target: "USER", userId: userId }
            ],
            isRead: false
        });
    }
    async markAsRead(notificationId, userId) {
        return await Notification_schema_1.default.findOneAndUpdate({
            _id: notificationId,
            $or: [
                { target: "ALL" },
                { target: "USER", userId: userId }
            ]
        }, { isRead: true }, { new: true });
    }
    // --- Device Token CRUD ---
    async registerToken(data) {
        // If token exists, update it. If not, create it.
        // Ensure we don't have duplicates for the same token.
        const { token, ...updateData } = data;
        if (!token)
            throw new Error("Token is required");
        return await DeviceToken_schema_1.default.findOneAndUpdate({ token }, { ...updateData, token, isActive: true }, { new: true, upsert: true });
    }
    async getTokensByUser(userId) {
        const devices = await DeviceToken_schema_1.default.find({ user: userId, isActive: true });
        return devices.map(d => d.token);
    }
    async getAllActiveTokens() {
        const devices = await DeviceToken_schema_1.default.find({ isActive: true });
        return devices.map(d => d.token);
    }
    async getTokensByDeviceType(type) {
        const devices = await DeviceToken_schema_1.default.find({ deviceType: type, isActive: true });
        return devices.map(d => d.token);
    }
    async removeToken(token) {
        return await DeviceToken_schema_1.default.updateOne({ token }, { isActive: false });
    }
}
exports.default = new NotificationRepository();
//# sourceMappingURL=notification.repository.js.map