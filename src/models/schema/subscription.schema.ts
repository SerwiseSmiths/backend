import { Schema, model, Document } from "mongoose";

export interface ISubscription extends Document {
  user: mongodbId;
  created_at: Date;
  end_at: Date;
  remaining_service: number;
  used_service: number;
  state: "active" | "expired" | "completed" | "cancelled" | "pending";
  auto_renew: boolean;
  payment_remaining: number;
  type: string;
  payments: mongodbId[]; // Array of WalletLedger IDs
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },

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
    payments: [{ type: Schema.Types.ObjectId, ref: "WalletLedger" }],
  },
  { timestamps: true }
);

// Indexes
subscriptionSchema.index({ user: 1 });
subscriptionSchema.index({ state: 1 });
subscriptionSchema.index({ end_at: 1 });

export const SubscriptionModel = model<ISubscription>(
  "Subscription",
  subscriptionSchema
);
