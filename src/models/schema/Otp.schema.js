"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const OtpSchema = new mongoose_1.Schema({
    phoneNo: { type: String, required: true, index: true, trim: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    consumed: { type: Boolean, default: false },
    attempts: { type: Number, default: 0 },
}, { timestamps: true });
OtpSchema.index({ phoneNo: 1, consumed: 1, expiresAt: 1 });
const OtpModel = (0, mongoose_1.model)("Otp", OtpSchema);
exports.default = OtpModel;
//# sourceMappingURL=Otp.schema.js.map