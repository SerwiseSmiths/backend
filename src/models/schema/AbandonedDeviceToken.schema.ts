import { Schema, model } from "mongoose";

export interface IAbandonedDeviceToken extends Document {
    token: string;
    deviceType: string;
    abandonedAt: Date;
}

const AbandonedDeviceTokenSchema = new Schema<IAbandonedDeviceToken>(
    {
        token: { type: String, required: true, unique: true, trim: true },
        deviceType: { type: String, required: true },
        abandonedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default model<IAbandonedDeviceToken>("AbandonedDeviceToken", AbandonedDeviceTokenSchema);
