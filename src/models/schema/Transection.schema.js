"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    orderId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    paymentType: { type: String, enum: ["subscription", "regular"], required: true },
    status: { type: String, default: "PENDING" },
    meta: { type: Object },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Transaction", transactionSchema);
//# sourceMappingURL=Transection.schema.js.map