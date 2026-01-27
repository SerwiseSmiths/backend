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
        if (!fcm) return;

        const message = {
            notification: {
                title: notification.title,
                body: notification.body,
            },
            data: {
                ...notification.metadata,
                notificationId: notification._id.toString(),
                type: notification.type
            },
            tokens: tokens,
        };

        const response = await fcm.sendEachForMulticast(message);
        console.log(`Sent to ${response.successCount} devices, failed: ${response.failureCount}`);
    }

    private async sendToTopic(topic: string, notification: INotification) {
        if (!fcm) return;

        const message = {
            notification: {
                title: notification.title,
                body: notification.body,
            },
            data: {
                ...notification.metadata,
                notificationId: notification._id.toString(),
                type: notification.type
            },
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
