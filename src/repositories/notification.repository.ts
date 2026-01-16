import NotificationModel from "../models/schema/Notification.schema";
import DeviceTokenModel from "../models/schema/DeviceToken.schema";
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

    // --- Device Token CRUD ---

    async registerToken(data: Partial<IDeviceToken>): Promise<IDeviceToken | null> {
        // If token exists, update it. If not, create it.
        // Ensure we don't have duplicates for the same token.
        const { token, ...updateData } = data;

        if (!token) throw new Error("Token is required");

        return await DeviceTokenModel.findOneAndUpdate(
            { token },
            { ...updateData, token, isActive: true },
            { new: true, upsert: true }
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
        return await DeviceTokenModel.updateOne({ token }, { isActive: false });
    }
}

export default new NotificationRepository();
