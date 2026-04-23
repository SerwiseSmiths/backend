import { INotification } from "../types/notification.type";
declare class NotificationService {
    registerDeviceToken(userId: string | undefined, token: string, deviceType: string): Promise<import("../types/deviceToken.type").IDeviceToken | null>;
    sendNotification(data: Partial<INotification>): Promise<INotification>;
    private sendToTokens;
    private sendToTopic;
    getUserNotifications(userId: string, limit: number, skip: number): Promise<(import("mongoose").Document<unknown, {}, INotification, {}, {}> & INotification & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getUnseenNotificationCount(userId: string): Promise<number>;
    markAsRead(notificationId: string, userId: string): Promise<INotification | null>;
}
declare const _default: NotificationService;
export default _default;
//# sourceMappingURL=notification.service.d.ts.map