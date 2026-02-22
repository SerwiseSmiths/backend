"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    recipientType: {
        type: String,
        enum: ["User", "Circle"],
        required: true,
    },
    recipientId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
    complaintId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Complaint" },
    readBy: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
}, {
    timestamps: true,
});
MessageSchema.index({ recipientId: 1, createdAt: -1 });
const MessageModel = mongoose_1.default.model("Message", MessageSchema);
exports.default = MessageModel;
//# sourceMappingURL=Message.schema.js.map