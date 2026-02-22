"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DeviceTypeSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    is_deleted: { type: Boolean, default: false },
}, { timestamps: true });
const DeviceTypeModel = (0, mongoose_1.model)("DeviceType", DeviceTypeSchema);
exports.default = DeviceTypeModel;
//# sourceMappingURL=DeviceType.schema.js.map