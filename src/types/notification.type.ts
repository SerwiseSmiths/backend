import { Document, Schema } from "mongoose";

export interface INotification extends Document {
    title: string;
    body: string;
    type: "Promotional" | "Service" | "Circles" | "Security";

    target: string;
    userId?: Schema.Types.ObjectId;
    groupId?: Schema.Types.ObjectId;
    status: string;
    metadata?: Record<string, any>;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}
