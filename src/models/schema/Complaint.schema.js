"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintModel = void 0;
const mongoose_1 = require("mongoose");
const mediaSchema = new mongoose_1.Schema({
    publicUrl: { type: String, required: true },
    type: { type: String, required: true },
}, { _id: false });
const complaintSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", default: null },
    addressId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Complaint",
        default: null,
    },
    quote: { type: mongoose_1.Schema.Types.ObjectId, ref: "Quote", default: null },
    deviceId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Device", default: null },
    // Strapi CMS ID for device type (not MongoDB ObjectId)
    deviceTypeId: { type: String, default: null },
    notes: { type: String, default: "" },
    media: { type: [mediaSchema], default: [] },
    subscriptionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Subscription",
        default: null,
    },
    // Rejection tracking
    rejectionReason: { type: String, default: null },
    rejectionMetadata: {
        type: {
            rejectedAt: Date,
            rejectedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
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
    rejectedProviderIds: { type: [mongoose_1.Schema.Types.ObjectId], default: [] },
    payment: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { timestamps: true });
// Indexes for faster queries
complaintSchema.index({ user: 1, createdAt: -1 });
complaintSchema.index({ provider: 1, createdAt: -1 });
complaintSchema.index({ stage: 1 });
complaintSchema.index({ parentId: 1 });
exports.ComplaintModel = (0, mongoose_1.model)("Complaint", complaintSchema);
//# sourceMappingURL=Complaint.schema.js.map