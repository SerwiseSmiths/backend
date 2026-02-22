declare class CircleService {
    createCircle(userId: string, name: string, description?: string): Promise<import("mongoose").Document<unknown, {}, import("../models/schema/Circle.schema").ICircle, {}, {}> & import("../models/schema/Circle.schema").ICircle & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    addMember(circleId: string, memberId: string): Promise<import("mongoose").Document<unknown, {}, import("../models/schema/Circle.schema").ICircle, {}, {}> & import("../models/schema/Circle.schema").ICircle & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    joinByLink(userId: string, invitationCode: string): Promise<import("mongoose").Document<unknown, {}, import("../models/schema/Circle.schema").ICircle, {}, {}> & import("../models/schema/Circle.schema").ICircle & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    makeAdmin(circleId: string, adminId: string, targetUserId: string): Promise<import("mongoose").Document<unknown, {}, import("../models/schema/Circle.schema").ICircle, {}, {}> & import("../models/schema/Circle.schema").ICircle & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getMutualCircles(user1Id: string, user2Id: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/schema/Circle.schema").ICircle, {}, {}> & import("../models/schema/Circle.schema").ICircle & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
declare const _default: CircleService;
export default _default;
//# sourceMappingURL=circle.service.d.ts.map