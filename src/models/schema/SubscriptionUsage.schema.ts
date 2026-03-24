import { Schema, model, Document } from "mongoose";

export interface ISubscriptionUsage extends Document {
  subscription: mongodbId;
  user: mongodbId;
  complaint: mongodbId;
  serviceIndex: number; // 1-based index
  usedAt: Date;
}

const subscriptionUsageSchema = new Schema<ISubscriptionUsage>(
  {
    subscription: { type: Schema.Types.ObjectId, ref: "UserSubscription", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    complaint: { type: Schema.Types.ObjectId, ref: "Complaint", required: true },
    serviceIndex: { type: Number, required: true },
    usedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

subscriptionUsageSchema.index({ subscription: 1 });
subscriptionUsageSchema.index({ user: 1 });
subscriptionUsageSchema.index({ complaint: 1 }, { unique: true });

export const SubscriptionUsageModel = model<ISubscriptionUsage>(
  "SubscriptionUsage",
  subscriptionUsageSchema
);
