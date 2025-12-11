"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DeviceSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    deviceType: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "deviceType",
        required: true,
    },
    description: { type: mongoose_1.Schema.Types.Mixed, required: false, default: {} },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    address: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Address", // <-- references Address collection
        required: true,
    },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Device", DeviceSchema);
//# sourceMappingURL=Device.schema.js.map