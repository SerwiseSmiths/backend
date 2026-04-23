export interface IAbandonedDeviceToken extends Document {
    token: string;
    deviceType: string;
    abandonedAt: Date;
}
declare const _default: import("mongoose").Model<IAbandonedDeviceToken, {}, {}, {}, import("mongoose").Document<unknown, {}, IAbandonedDeviceToken, {}, {}> & IAbandonedDeviceToken & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=AbandonedDeviceToken.schema.d.ts.map