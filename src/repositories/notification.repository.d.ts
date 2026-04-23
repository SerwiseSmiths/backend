import { INotification } from "../types/notification.type";
import { IDeviceToken } from "../types/deviceToken.type";
declare class NotificationRepository {
    createNotification(data: Partial<INotification>): Promise<INotification>;
    getUserNotifications(userId: string, limit?: number, skip?: number): Promise<(import("mongoose").Document<unknown, {}, INotification, {}, {}> & INotification & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getUnseenNotificationCount(userId: string): Promise<number>;
    markAsRead(notificationId: string, userId: string): Promise<INotification | null>;
    registerToken(data: Partial<IDeviceToken>): Promise<IDeviceToken | null>;
    private saveAbandonedDeviceToken;
    getTokensByUser(userId: string): Promise<string[]>;
    getAllActiveTokens(): Promise<string[]>;
    getTokensByDeviceType(type: string): Promise<string[]>;
    removeToken(token: string): Promise<any>;
}
declare const _default: NotificationRepository;
export default _default;
//# sourceMappingURL=notification.repository.d.ts.map