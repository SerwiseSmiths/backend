import notificationRepository from "../repositories/notification.repository";
import { fcm } from "../config/firebase.config";
import { INotification } from "../types/notification.type";
import ApiError from "../utils/api/ApiError.api.util"; // Assuming this exists based on User.schema.ts

class NotificationService {

    // --- Token Management ---

    async registerDeviceToken(userId: string | undefined, token: string, deviceType: string) {
        if (!token) throw new ApiError(400, "Token is required");
        return await notificationRepository.registerToken({ user: userId as any, token, deviceType });
    }

    // --- Sending Logic ---

    async sendNotification(data: Partial<INotification>) {
        // 1. Save to DB
        const notification = await notificationRepository.createNotification(data);

        // 2. Send via FCM
        try {
            if (data.target === "ALL") {
                await this.sendToTopic("all_users", notification); // Assuming app subscribes to 'all_users'
            } else if (data.target === "USER" && data.userId) {
                // Find user tokens
                const tokens = await notificationRepository.getTokensByUser(data.userId.toString());
                if (tokens.length > 0) {
                    await this.sendToTokens(tokens, notification);
                }
            } else if (data.target === "GROUP") {
                // TODO: Implement Group logic
            }

            // Update status to SENT
            notification.status = "SENT";
            await notification.save();

        } catch (error: any) {
            console.error("FCM Send Error:", error);
            notification.status = "FAILED";
            await notification.save();
            // We don't throw here to ensure the notification is at least recorded as FAILED
        }

        return notification;
    }

    // --- FCM Helpers ---

    private async sendToTokens(tokens: string[], notification: INotification) {
        if (!fcm) {
            console.warn("FCM not initialized. Cannot send push notification.");
            throw new Error("FCM not initialized. Please configure Firebase credentials.");
        }

        // FCM requires all data values to be strings
        const dataPayload: Record<string, string> = {
            notificationId: notification._id.toString(),
            type: notification.type || ''
        };
        
        // Convert all metadata values to strings
        if (notification.metadata) {
            Object.keys(notification.metadata).forEach(key => {
                const value = notification.metadata[key];
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

        const response = await fcm.sendEachForMulticast(message);
        console.log(`[FCM] Sent to ${response.successCount} devices, failed: ${response.failureCount}`);
        
        // Log detailed error information for failed tokens
        if (response.failureCount > 0) {
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    console.error(`[FCM] Token ${idx} (${tokens[idx].substring(0, 20)}...) failed:`, {
                        error: resp.error?.code || 'UNKNOWN',
                        message: resp.error?.message || 'No error message',
                        token: tokens[idx].substring(0, 30) + '...'
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

    private async sendToTopic(topic: string, notification: INotification) {
        if (!fcm) {
            console.warn("FCM not initialized. Cannot send push notification.");
            throw new Error("FCM not initialized. Please configure Firebase credentials.");
        }

        // FCM requires all data values to be strings
        const dataPayload: Record<string, string> = {
            notificationId: notification._id.toString(),
            type: notification.type || ''
        };
        
        // Convert all metadata values to strings
        if (notification.metadata) {
            Object.keys(notification.metadata).forEach(key => {
                const value = notification.metadata[key];
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

        await fcm.send(message);
    }

    // --- Retrieval ---

    async getUserNotifications(userId: string, limit: number, skip: number) {
        return await notificationRepository.getUserNotifications(userId, limit, skip);
    }

    async getUnseenNotificationCount(userId: string) {
        return await notificationRepository.getUnseenNotificationCount(userId);
    }

    async markAsRead(notificationId: string, userId: string) {
        return await notificationRepository.markAsRead(notificationId, userId);
    }
}



export default new NotificationService();
