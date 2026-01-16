import { Schema, model } from "mongoose";
import { IDeviceToken } from "../../types/deviceToken.type";

const DeviceTokenSchema = new Schema<IDeviceToken>(
    {
        token: { type: String, required: true, unique: true, trim: true },
        user: { type: Schema.Types.ObjectId, ref: "User" },
        deviceType: { type: String, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default model<IDeviceToken>("DeviceToken", DeviceTokenSchema);
