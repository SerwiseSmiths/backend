import { Schema, model, Document } from "mongoose";

export interface ISubscriptionPayment extends Document {
  subscription: mongodbId;
  user: mongodbId;
  amount: number;
  paymentType: "upfront" | "metered_emi" | "metered_completion";
  transactionRef: string; // Internal or external reference
  status: "pending" | "completed" | "failed";
  paidAt: Date;
}

const subscriptionPaymentSchema = new Schema<ISubscriptionPayment>(
  {
    subscription: { type: Schema.Types.ObjectId, ref: "UserSubscription", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
  },
  { timestamps: true }
);

subscriptionPaymentSchema.index({ subscription: 1 });
subscriptionPaymentSchema.index({ user: 1 });

export const SubscriptionPaymentModel = model<ISubscriptionPayment>(
  "SubscriptionPayment",
  subscriptionPaymentSchema
);
