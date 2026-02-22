"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionModel = void 0;
const mongoose_1 = require("mongoose");
const subscriptionSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    created_at: { type: Date, required: true },
    end_at: { type: Date, required: true },
    remaining_service: { type: Number, required: true },
    used_service: { type: Number, default: 0 },
    state: {
        type: String,
        enum: ["active", "expired", "completed", "cancelled", "pending"],
        default: "pending",
    },
    auto_renew: { type: Boolean, default: false },
    payment_remaining: { type: Number, required: true },
    type: {
        type: String,
        required: true,
        enum: ["A3", "A4", "A6", "B3", "B4", "B6", "C"],
    },
    // Array of payment references (WalletLedger)
    payments: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "WalletLedger" }],
}, { timestamps: true });
// Indexes
subscriptionSchema.index({ user: 1 });
subscriptionSchema.index({ state: 1 });
subscriptionSchema.index({ end_at: 1 });
exports.SubscriptionModel = (0, mongoose_1.model)("Subscription", subscriptionSchema);
//# sourceMappingURL=subscription.schema.js.map