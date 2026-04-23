"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AbandonedDeviceTokenSchema = new mongoose_1.Schema({
    token: { type: String, required: true, unique: true, trim: true },
    deviceType: { type: String, required: true },
    abandonedAt: { type: Date, default: Date.now },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("AbandonedDeviceToken", AbandonedDeviceTokenSchema);
//# sourceMappingURL=AbandonedDeviceToken.schema.js.map