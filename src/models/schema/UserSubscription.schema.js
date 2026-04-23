"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSubscriptionModel = void 0;
const mongoose_1 = require("mongoose");
const userSubscriptionSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    plan_snapshot: { type: mongoose_1.Schema.Types.Mixed, required: true },
    addons_snapshot: { type: mongoose_1.Schema.Types.Mixed, default: [] },
    startDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ["pending", "scheduled", "active", "expired", "cancelled"],
        default: "pending",
    },
    paymentModel: {
        type: String,
        enum: ["flat", "metered"],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "partial", "completed"],
        default: "pending",
    },
    totalPaid: { type: Number, default: 0 },
    remainingAmount: { type: Number, required: true },
}, { timestamps: true });
userSubscriptionSchema.index({ user: 1 });
userSubscriptionSchema.index({ status: 1 });
userSubscriptionSchema.index({ expiryDate: 1 });
exports.UserSubscriptionModel = (0, mongoose_1.model)("UserSubscription", userSubscriptionSchema);
//# sourceMappingURL=UserSubscription.schema.js.map