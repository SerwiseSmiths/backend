"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionUsageModel = void 0;
const mongoose_1 = require("mongoose");
const subscriptionUsageSchema = new mongoose_1.Schema({
    subscription: { type: mongoose_1.Schema.Types.ObjectId, ref: "UserSubscription", required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    complaint: { type: mongoose_1.Schema.Types.ObjectId, ref: "Complaint", required: true },
    serviceIndex: { type: Number, required: true },
    usedAt: { type: Date, default: Date.now },
}, { timestamps: true });
subscriptionUsageSchema.index({ subscription: 1 });
subscriptionUsageSchema.index({ user: 1 });
subscriptionUsageSchema.index({ complaint: 1 }, { unique: true });
exports.SubscriptionUsageModel = (0, mongoose_1.model)("SubscriptionUsage", subscriptionUsageSchema);
//# sourceMappingURL=SubscriptionUsage.schema.js.map