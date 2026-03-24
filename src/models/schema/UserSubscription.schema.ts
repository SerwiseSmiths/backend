import { Schema, model, Document } from "mongoose";

export interface IUserSubscription extends Document {
  user: mongodbId;
  plan_snapshot: {
    name: string;
    plan_type: "Basic" | "Standard" | "Addon";
    totalServices: number;
    serviceMapping: {
      usageIndex: number;
      allowedServiceId: string; // Strapi documentId
      includedParts: string[]; // Strapi documentIds
      providerPayout: number;
    }[];
    pricing: {
      cost: number;
      sub_sales: number;
      non_sub_sales: number;
      sub_profit: number;
      non_sub_profit: number;
    };
    maxDiscount: number;
    lockInPeriod: number;
    validityDuration: number;
  };
  addons_snapshot?: {
    name: string;
    pricing: {
      cost: number;
      sub_sales: number;
      non_sub_sales: number;
      sub_profit: number;
    };
  }[];
  startDate: Date;
  expiryDate: Date;
  status: "pending" | "active" | "expired" | "cancelled";
  paymentModel: "flat" | "metered";
  paymentStatus: "pending" | "partial" | "completed";
  totalPaid: number;
  remainingAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSubscriptionSchema = new Schema<IUserSubscription>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    plan_snapshot: { type: Schema.Types.Mixed, required: true },
    addons_snapshot: { type: Schema.Types.Mixed, default: [] },
    startDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "active", "expired", "cancelled"],
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
  },
  { timestamps: true }
);

userSubscriptionSchema.index({ user: 1 });
userSubscriptionSchema.index({ status: 1 });
userSubscriptionSchema.index({ expiryDate: 1 });

export const UserSubscriptionModel = model<IUserSubscription>(
  "UserSubscription",
  userSubscriptionSchema
);
