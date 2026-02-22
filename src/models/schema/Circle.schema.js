"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CircleSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    admins: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true }],
    members: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true }],
    invitationCode: { type: String, unique: true, required: true },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
const CircleModel = mongoose_1.default.model("Circle", CircleSchema);
exports.default = CircleModel;
//# sourceMappingURL=Circle.schema.js.map