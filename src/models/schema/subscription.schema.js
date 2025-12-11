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
});
exports.SubscriptionModel = (0, mongoose_1.model)("Subscription", subscriptionSchema);
//# sourceMappingURL=subscription.schema.js.map