"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintModel = void 0;
const mongoose_1 = require("mongoose");
const complaintSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    address: { type: mongoose_1.Schema.Types.ObjectId, ref: "Address", required: true },
    stage: {
        type: String,
        enum: ["Entrance", "Estimation", "Approval", "Payment"],
        default: "Entrance",
    },
    parent: { type: mongoose_1.Schema.Types.ObjectId, ref: "Complaint", default: null },
    quote: { type: mongoose_1.Schema.Types.ObjectId, ref: "Quote", default: null },
    device: { type: mongoose_1.Schema.Types.ObjectId, ref: "Device", default: null },
});
exports.ComplaintModel = (0, mongoose_1.model)("Complaint", complaintSchema);
//# sourceMappingURL=Complaint.schema.js.map