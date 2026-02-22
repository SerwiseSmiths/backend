"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const NotificationSchema = new mongoose_1.Schema({
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
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    groupId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Group" }, // Assuming Group schema exists or will be added, purely optional for now
    status: {
        type: String,
        enum: ["PENDING", "SENT", "FAILED"],
        default: "PENDING",
    },
    metadata: { type: mongoose_1.Schema.Types.Mixed }, // Arbitrary payload
    isRead: { type: Boolean, default: false },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Notification", NotificationSchema);
//# sourceMappingURL=Notification.schema.js.map