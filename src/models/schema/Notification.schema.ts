import { Schema, model } from "mongoose";
import { INotification } from "../../types/notification.type";

const NotificationSchema = new Schema<INotification>(
    {
        title: { type: String, required: true },
        body: { type: String, required: true },
        type: {
            type: String,
            enum: ["Promotional", "Service", "Circles", "Security"],
            default: "Service",
        },

        target: {
            type: String,
            enum: ["ALL", "USER", "GROUP"],
            required: true,
        },
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        groupId: { type: Schema.Types.ObjectId, ref: "Group" }, // Assuming Group schema exists or will be added, purely optional for now
        status: {
            type: String,
            enum: ["PENDING", "SENT", "FAILED"],
            default: "PENDING",
        },
        metadata: { type: Schema.Types.Mixed }, // Arbitrary payload
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default model<INotification>("Notification", NotificationSchema);
