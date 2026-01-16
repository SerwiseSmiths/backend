import { Document, Schema } from "mongoose";

export interface IDeviceToken extends Document {
    token: string;
    user?: Schema.Types.ObjectId;
    deviceType: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
