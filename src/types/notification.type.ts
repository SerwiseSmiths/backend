import { Document, Schema } from "mongoose";

export interface INotification extends Document {
    title: string;
    body: string;
    type: "Promotional" | "Service" | "Circles" | "Security";

    target: string;
    userId?: string | Schema.Types.ObjectId;
    groupId?: string | Schema.Types.ObjectId;
    status: string;
    metadata?: Record<string, any>;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

