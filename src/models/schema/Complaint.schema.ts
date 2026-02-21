import { Schema, model } from "mongoose";
import { IComplaint } from "../../types/comlpaint.type";

const mediaSchema = new Schema(
  {
    publicUrl: { type: String, required: true },
    type: { type: String, required: true },
  },
  { _id: false }
);

const complaintSchema = new Schema<IComplaint>(
  {
    title: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: Schema.Types.ObjectId, ref: "User", default: null },

    addressId: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    stage: {
      type: String,
      enum: [
        "ENTRANCE",
        "QR_VALIDATED",
        "ESTIMATION",
        "APPROVAL",
        "PAYMENT",
        "COMPLETED",
        "REJECTED",
      ],
      default: "ENTRANCE",
    },

    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Complaint",
      default: null,
    },

    quote: { type: Schema.Types.ObjectId, ref: "Quote", default: null },

    deviceId: { type: Schema.Types.ObjectId, ref: "Device", default: null },

    // Strapi CMS ID for device type (not MongoDB ObjectId)
    deviceTypeId: { type: String, default: null },

    notes: { type: String, default: "" },

    media: { type: [mediaSchema], default: [] },

    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },

    // Rejection tracking
    rejectionReason: { type: String, default: null },
    rejectionMetadata: {
      type: {
        rejectedAt: Date,
        rejectedBy: { type: Schema.Types.ObjectId, ref: "User" },
      },
      default: null,
    },

    // Payment verification (admin email verification)
    paymentVerificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: null,
    },
    paymentVerificationToken: { type: String, default: null },
    paymentRequestedAt: { type: Date, default: null },

    // Provider acceptance tracking
    providerAccepted: { type: Boolean, default: false },
    providerAcceptedAt: { type: Date, default: null },
    providerAssignmentExpiry: { type: Date, default: null },

    payment: {
      type: Schema.Types.ObjectId,
      ref: "WalletLedger",
      default: null,
    },
    // Calculated payment amount (cached to avoid recalculation)
    calculatedPaymentAmount: { type: Number, default: null },
    calculatedPaymentAt: { type: Date, default: null },
    // Cash collection tracking
    cashCollected: { type: Boolean, default: false },
    cashCollectedAt: { type: Date, default: null },
    // Entry QR validation (provider must scan customer's QR to start service)
    entryQrToken: { type: String, default: null },
    entryQrExpiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Indexes for faster queries
complaintSchema.index({ user: 1, createdAt: -1 });
complaintSchema.index({ provider: 1, createdAt: -1 });
complaintSchema.index({ stage: 1 });
complaintSchema.index({ parentId: 1 });

export const ComplaintModel = model<IComplaint>("Complaint", complaintSchema);
