"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DeviceTokenSchema = new mongoose_1.Schema({
    token: { type: String, required: true, unique: true, trim: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    deviceType: { type: String, required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("DeviceToken", DeviceTokenSchema);
//# sourceMappingURL=DeviceToken.schema.js.map