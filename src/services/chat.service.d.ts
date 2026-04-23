declare class ChatService {
    getChatHistory(userId: string, targetId: string, targetType: "User" | "Circle", limit?: number, skip?: number): Promise<(import("mongoose").Document<unknown, {}, import("../models/schema/Message.schema").IMessage, {}, {}> & import("../models/schema/Message.schema").IMessage & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    shareComplaint(senderId: string, recipientId: string, recipientType: "User" | "Circle", complaintId: string): Promise<import("mongoose").Document<unknown, {}, import("../models/schema/Message.schema").IMessage, {}, {}> & import("../models/schema/Message.schema").IMessage & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getTemporaryChat(userId: string, providerId: string, complaintId: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/schema/Message.schema").IMessage, {}, {}> & import("../models/schema/Message.schema").IMessage & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getMutualFriends(user1Id: string, user2Id: string): Promise<(import("mongoose").Document<unknown, {}, import("../types/user.type").IUser, {}, {}> & import("../types/user.type").IUser & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
}
declare const _default: ChatService;
export default _default;
//# sourceMappingURL=chat.service.d.ts.map