"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Notification_schema_1 = require("../models/schema/Notification.schema");
const DeviceToken_schema_1 = require("../models/schema/DeviceToken.schema");
const AbandonedDeviceToken_schema_1 = require("../models/schema/AbandonedDeviceToken.schema");
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
        const { token, user: incomingUserId, deviceType } = data;
        if (!token)
            throw new Error("Token is required");
        // Check if the token already exists
        const existingToken = await DeviceToken_schema_1.default.findOne({ token });
        if (existingToken) {
            // Case 1: Token exists but belongs to a different user, or the user is now null/logged out
            if (String(existingToken.user) !== String(incomingUserId) || !incomingUserId) {
                // If it belonged to a user before, that binding is considered abandoned
                if (existingToken.user) {
                    await this.saveAbandonedDeviceToken(token, existingToken.deviceType);
                }
            }
        }
        else if (!incomingUserId) {
            // Case 2: New token, but without a user (user opened app without logging in)
            await this.saveAbandonedDeviceToken(token, deviceType || "android");
        }
        // If no incoming user, we don't save to the main DeviceTokenModel, it's just tracked as abandoned
        if (!incomingUserId) {
            // Alternatively, some apps keep it active without user id. By our definition, 
            // tokens without users go to abandoned for promotional messaging.
            return null;
        }
        // Otherwise, upsert the token for the incoming user
        return await DeviceToken_schema_1.default.findOneAndUpdate({ token }, { user: incomingUserId, deviceType, isActive: true }, { new: true, upsert: true });
    }
    async saveAbandonedDeviceToken(token, deviceType) {
        await AbandonedDeviceToken_schema_1.default.updateOne({ token }, { token, deviceType, abandonedAt: new Date() }, { upsert: true });
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
        const existingToken = await DeviceToken_schema_1.default.findOne({ token });
        if (existingToken) {
            await this.saveAbandonedDeviceToken(token, existingToken.deviceType);
            return await DeviceToken_schema_1.default.deleteOne({ token });
        }
        return null; // Token didn't exist
    }
}
exports.default = new NotificationRepository();
//# sourceMappingURL=notification.repository.js.map