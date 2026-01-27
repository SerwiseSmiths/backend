import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
    sender: mongoose.Types.ObjectId;
    recipientType: "User" | "Circle";
    recipientId: mongoose.Types.ObjectId;
    content: string;
    type: "text" | "image" | "complaint" | "call_log";
    complaintId?: mongoose.Types.ObjectId;
    readBy: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
    {
        sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
        recipientType: {
            type: String,
            enum: ["User", "Circle"],
            required: true,
        },
        recipientId: {
            type: Schema.Types.ObjectId,
            required: true,
            // Dynamic ref based on recipientType
            refPath: "recipientType",
        },
        content: { type: String, required: true },
        type: {
            type: String,
            enum: ["text", "image", "complaint", "call_log"],
            default: "text",
        },
        complaintId: { type: Schema.Types.ObjectId, ref: "Complaint" },
        readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    {
        timestamps: true,
    }
);

MessageSchema.index({ recipientId: 1, createdAt: -1 });

const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);
export default MessageModel;
