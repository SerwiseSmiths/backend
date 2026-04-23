"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPaymentModel = void 0;
const mongoose_1 = require("mongoose");
const subscriptionPaymentSchema = new mongoose_1.Schema({
    subscription: { type: mongoose_1.Schema.Types.ObjectId, ref: "UserSubscription", required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    paymentType: {
        type: String,
        enum: ["upfront", "metered_emi", "metered_completion"],
        required: true,
    },
    transactionRef: { type: String, required: true },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
    },
    paidAt: { type: Date },
}, { timestamps: true });
subscriptionPaymentSchema.index({ subscription: 1 });
subscriptionPaymentSchema.index({ user: 1 });
exports.SubscriptionPaymentModel = (0, mongoose_1.model)("SubscriptionPayment", subscriptionPaymentSchema);
//# sourceMappingURL=SubscriptionPayment.schema.js.map