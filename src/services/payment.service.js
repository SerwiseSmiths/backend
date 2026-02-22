"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Transection_schema_1 = require("../models/schema/Transection.schema");
const walletService = require("./wallet.services"); // Import wallet service
const wallet_type_1 = require("../types/wallet.type");
const subscription_schema_1 = require("../models/schema/subscription.schema");
const Complaint_schema_1 = require("../models/schema/Complaint.schema");
const Quote_schema_1 = require("../models/schema/Quote.schema");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
class PaymentService {
    razorpay;
    constructor() {
        this.razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || "",
            key_secret: process.env.RAZORPAY_KEY_SECRET || "",
        });
    }
    async createOrder(data) {
        // Razorpay expects amount in paise
        const options = {
            amount: Math.round(data.amount * 100),
            currency: "INR",
            receipt: "rcpt_" + Date.now(),
            notes: {
                userId: data.userId,
                type: data.type,
                subscriptionId: data.subscriptionId || "",
                complaintId: data.complaintId || "",
            },
        };
        try {
            const order = await this.razorpay.orders.create(options);
            console.log("Razorpay Order Created:", order);
            // Save Initial Transaction
            await Transection_schema_1.default.create({
                orderId: order.id,
                userId: data.userId,
                amount: data.amount,
                paymentType: data.type,
                subscriptionId: data.subscriptionId,
                complaintId: data.complaintId,
                status: "PENDING",
                meta: order,
            });
            return order;
        }
        catch (error) {
            console.error("Razorpay Create Order Error:", error);
            throw new ApiError_api_util_1.default(500, "Failed to create payment order");
        }
    }
    verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!keySecret) {
            throw new ApiError_api_util_1.default(500, "Razorpay key secret not configured");
        }
        const generatedSignature = crypto
            .createHmac("sha256", keySecret)
            .update(razorpayOrderId + "|" + razorpayPaymentId)
            .digest("hex");
        return generatedSignature === razorpaySignature;
    }
    async handlePaymentSuccess(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
        const isSignatureValid = this.verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
        if (!isSignatureValid) {
            throw new ApiError_api_util_1.default(400, "Invalid payment signature");
        }
        const transaction = await Transection_schema_1.default.findOne({ orderId: razorpayOrderId });
        if (!transaction) {
            throw new ApiError_api_util_1.default(404, "Transaction not found");
        }
        if (transaction.status === "SUCCESS") {
            return { message: "Payment already processed", transaction };
        }
        // Update Transaction
        transaction.status = "SUCCESS";
        transaction.meta = {
            ...transaction.meta,
            razorpayPaymentId,
            razorpaySignature,
        };
        await transaction.save();
        // Handle Logic Based on Type
        if (transaction.paymentType === "wallet_recharge") {
            await walletService.creditWallet(transaction.userId, transaction.amount, wallet_type_1.WalletLedgerSource.RECHARGE, razorpayPaymentId, // Use Payment ID as ref
            { orderId: razorpayOrderId });
        }
        else if (transaction.paymentType === "order_payment") {
            // Logic for order payment success (e.g., notify order service)
            console.log(`Order Payment Successful for user ${transaction.userId}`);
        }
        else if (transaction.paymentType === "subscription") {
            if (transaction.subscriptionId) {
                const subscription = await subscription_schema_1.SubscriptionModel.findById(transaction.subscriptionId);
                if (subscription) {
                    const newRemaining = Math.max(0, subscription.payment_remaining - transaction.amount);
                    const updates = { payment_remaining: newRemaining };
                    if (newRemaining <= 0) {
                        updates.state = "active";
                    }
                    await subscription_schema_1.SubscriptionModel.findByIdAndUpdate(transaction.subscriptionId, updates);
                }
            }
        }
        else if (transaction.paymentType === "complaint") {
            if (transaction.complaintId) {
                // Find complaint to get the quote
                const complaint = await Complaint_schema_1.ComplaintModel.findById(transaction.complaintId);
                if (complaint && complaint.quote) {
                    await Quote_schema_1.QuoteModel.findByIdAndUpdate(complaint.quote, {
                        isPaid: true,
                    });
                    // Optionally update complaint stage if needed, e.g. to 'Payment' or 'Completed'
                    // await ComplaintModel.findByIdAndUpdate(transaction.complaintId, { stage: 'Payment' });
                }
            }
        }
        return { message: "Payment verified and processed", transaction };
    }
}
exports.default = new PaymentService();
//# sourceMappingURL=payment.service.js.map