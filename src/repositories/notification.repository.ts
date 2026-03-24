import NotificationModel from "../models/schema/Notification.schema";
import DeviceTokenModel from "../models/schema/DeviceToken.schema";
import AbandonedDeviceTokenModel from "../models/schema/AbandonedDeviceToken.schema";
import { INotification } from "../types/notification.type";
import { IDeviceToken } from "../types/deviceToken.type";

class NotificationRepository {
    // --- Notification CRUD ---

    async createNotification(data: Partial<INotification>): Promise<INotification> {
        return await NotificationModel.create(data);
    }

    async getUserNotifications(userId: string, limit: number = 20, skip: number = 0) {
        return await NotificationModel.find({
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

    async getUnseenNotificationCount(userId: string): Promise<number> {
        return await NotificationModel.countDocuments({
            $or: [
                { target: "ALL" },
                { target: "USER", userId: userId }
            ],
            isRead: false
        });
    }

    async markAsRead(notificationId: string, userId: string): Promise<INotification | null> {
        return await NotificationModel.findOneAndUpdate(
            {
                _id: notificationId,
                $or: [
                    { target: "ALL" },
                    { target: "USER", userId: userId }
                ]
            },
            { isRead: true },
            { new: true }
        );
    }



    // --- Device Token CRUD ---

    async registerToken(data: Partial<IDeviceToken>): Promise<IDeviceToken | null> {
        const { token, user: incomingUserId, deviceType } = data;

        if (!token) throw new Error("Token is required");

        // Check if the token already exists
        const existingToken = await DeviceTokenModel.findOne({ token });

        if (existingToken) {
            // Case 1: Token exists but belongs to a different user, or the user is now null/logged out
            if (String(existingToken.user) !== String(incomingUserId) || !incomingUserId) {
                // If it belonged to a user before, that binding is considered abandoned
                if (existingToken.user) {
                    await this.saveAbandonedDeviceToken(token, existingToken.deviceType);
                }
            }
        } else if (!incomingUserId) {
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
        return await DeviceTokenModel.findOneAndUpdate(
            { token },
            { user: incomingUserId, deviceType, isActive: true },
            { new: true, upsert: true }
        );
    }

    private async saveAbandonedDeviceToken(token: string, deviceType: string) {
        await AbandonedDeviceTokenModel.updateOne(
            { token },
            { token, deviceType, abandonedAt: new Date() },
            { upsert: true }
        );
    }

    async getTokensByUser(userId: string): Promise<string[]> {
        const devices = await DeviceTokenModel.find({ user: userId, isActive: true });
        return devices.map(d => d.token);
    }

    async getAllActiveTokens(): Promise<string[]> {
        const devices = await DeviceTokenModel.find({ isActive: true });
        return devices.map(d => d.token);
    }

    async getTokensByDeviceType(type: string): Promise<string[]> {
        const devices = await DeviceTokenModel.find({ deviceType: type, isActive: true });
        return devices.map(d => d.token);
    }

    async removeToken(token: string) {
        const existingToken = await DeviceTokenModel.findOne({ token });
        if (existingToken) {
             await this.saveAbandonedDeviceToken(token, existingToken.deviceType);
             return await DeviceTokenModel.deleteOne({ token });
        }
        return null; // Token didn't exist
    }
}

export default new NotificationRepository();
