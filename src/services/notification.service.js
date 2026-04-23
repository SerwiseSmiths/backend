"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notification_repository_1 = require("../repositories/notification.repository");
const firebase_config_1 = require("../config/firebase.config");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util"); // Assuming this exists based on User.schema.ts
class NotificationService {
    // --- Token Management ---
    async registerDeviceToken(userId, token, deviceType) {
        if (!token)
            throw new ApiError_api_util_1.default(400, "Token is required");
        return await notification_repository_1.default.registerToken({ user: userId, token, deviceType });
    }
    // --- Sending Logic ---
    async sendNotification(data) {
        // 1. Save to DB
        const notification = await notification_repository_1.default.createNotification(data);
        // 2. Send via FCM
        try {
            if (data.target === "ALL") {
                await this.sendToTopic("all_users", notification); // Assuming app subscribes to 'all_users'
            }
            else if (data.target === "USER" && data.userId) {
                // Find user tokens
                const tokens = await notification_repository_1.default.getTokensByUser(data.userId.toString());
                if (tokens.length > 0) {
                    await this.sendToTokens(tokens, notification);
                }
            }
            else if (data.target === "GROUP") {
                // TODO: Implement Group logic
            }
            // Update status to SENT
            notification.status = "SENT";
            await notification.save();
        }
        catch (error) {
            console.error("FCM Send Error:", error);
            notification.status = "FAILED";
            await notification.save();
            // We don't throw here to ensure the notification is at least recorded as FAILED
        }
        return notification;
    }
    // --- FCM Helpers ---
    async sendToTokens(tokens, notification) {
        if (!firebase_config_1.fcm) {
            console.warn("FCM not initialized. Cannot send push notification.");
            throw new Error("FCM not initialized. Please configure Firebase credentials.");
        }
        // FCM requires all data values to be strings
        const dataPayload = {
            notificationId: notification._id.toString(),
            type: notification.type || ''
        };
        // Convert all metadata values to strings
        const metadata = notification.metadata;
        if (metadata) {
            Object.keys(metadata).forEach(key => {
                const value = metadata[key];
                if (value !== null && value !== undefined) {
                    dataPayload[key] = typeof value === 'string' ? value : JSON.stringify(value);
                }
            });
        }
        const message = {
            notification: {
                title: notification.title,
                body: notification.body,
            },
            data: dataPayload,
            tokens: tokens,
        };
        const response = await firebase_config_1.fcm.sendEachForMulticast(message);
        console.log(`[FCM] Sent to ${response.successCount} devices, failed: ${response.failureCount}`);
        // Log detailed error information for failed tokens
        if (response.failureCount > 0) {
            response.responses.forEach((resp, idx) => {
                const token = tokens[idx];
                if (!resp.success && token) {
                    console.error(`[FCM] Token ${idx} (${token.substring(0, 20)}...) failed:`, {
                        error: resp.error?.code || 'UNKNOWN',
                        message: resp.error?.message || 'No error message',
                        token: token.substring(0, 30) + '...'
                    });
                    // Handle specific error codes
                    if (resp.error?.code === 'messaging/invalid-registration-token' ||
                        resp.error?.code === 'messaging/registration-token-not-registered') {
                        console.warn(`[FCM] Token ${idx} is invalid or unregistered. Consider removing it from database.`);
                    }
                }
            });
        }
    }
    async sendToTopic(topic, notification) {
        if (!firebase_config_1.fcm) {
            console.warn("FCM not initialized. Cannot send push notification.");
            throw new Error("FCM not initialized. Please configure Firebase credentials.");
        }
        // FCM requires all data values to be strings
        const dataPayload = {
            notificationId: notification._id.toString(),
            type: notification.type || ''
        };
        // Convert all metadata values to strings
        const metadata = notification.metadata;
        if (metadata) {
            Object.keys(metadata).forEach(key => {
                const value = metadata[key];
                if (value !== null && value !== undefined) {
                    dataPayload[key] = typeof value === 'string' ? value : JSON.stringify(value);
                }
            });
        }
        const message = {
            notification: {
                title: notification.title,
                body: notification.body,
            },
            data: dataPayload,
            topic: topic,
        };
        await firebase_config_1.fcm.send(message);
    }
    // --- Retrieval ---
    async getUserNotifications(userId, limit, skip) {
        return await notification_repository_1.default.getUserNotifications(userId, limit, skip);
    }
    async getUnseenNotificationCount(userId) {
        return await notification_repository_1.default.getUnseenNotificationCount(userId);
    }
    async markAsRead(notificationId, userId) {
        return await notification_repository_1.default.markAsRead(notificationId, userId);
    }
}
exports.default = new NotificationService();
//# sourceMappingURL=notification.service.js.map