"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.razorpayWebhook = exports.bypassZeroPayment = exports.collectCashPayment = exports.calculatePayment = exports.getPaymentQRCode = exports.rejectPayment = exports.verifyPayment = exports.requestPaymentVerification = void 0;
const Complaint_schema_1 = require("../models/schema/Complaint.schema");
const email_service_1 = require("../services/email.service");
const socket_service_1 = require("../services/socket.service");
const paymentCalculation_service_1 = require("../services/paymentCalculation.service");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
const ApiSuccess_api_util_1 = require("../utils/api/ApiSuccess.api.util");
const crypto = require("crypto");
const wallet_type_1 = require("../types/wallet.type");
const wallet_services_1 = require("../services/wallet.services");
const UserSubscription_schema_1 = require("../models/schema/UserSubscription.schema");
const SubscriptionPayment_schema_1 = require("../models/schema/SubscriptionPayment.schema");
const telegram_service_1 = require("../services/telegram.service");
/**
 * Customer triggers payment verification request
 * POST /api/v2/payment/request-verification
 */
const requestPaymentVerification = async (req, res) => {
    try {
        const { complaintId } = req.body;
        if (!complaintId) {
            throw new ApiError_api_util_1.default(400, "Complaint ID is required");
        }
        const complaint = await Complaint_schema_1.ComplaintModel.findById(complaintId)
            .populate("user")
            .populate("quote");
        if (!complaint) {
            throw new ApiError_api_util_1.default(404, "Complaint not found");
        }
        // Check if complaint is in APPROVAL or PAYMENT stage
        if (complaint.stage !== "APPROVAL" && complaint.stage !== "PAYMENT") {
            throw new ApiError_api_util_1.default(400, "Complaint must be in APPROVAL or PAYMENT stage");
        }
        // Generate verification token
        const verificationToken = email_service_1.default.generateVerificationToken();
        // Update complaint with verification status
        complaint.paymentVerificationStatus = "pending";
        complaint.paymentVerificationToken = verificationToken;
        complaint.paymentRequestedAt = new Date();
        complaint.stage = "PAYMENT"; // Move to PAYMENT stage if in APPROVAL
        await complaint.save();
        // Get customer name and quote amount
        const customerName = complaint.user?.firstName
            ? `${complaint.user.firstName} ${complaint.user.lastName}`
            : "Customer";
        const amount = complaint.quote?.total || 0;
        // Send verification email to admin
        await email_service_1.default.sendPaymentVerificationEmail(complaint._id.toString(), customerName, amount, verificationToken);
        // Emit socket event to customer
        const userId = typeof complaint.user === 'object' && complaint.user?._id
            ? complaint.user._id.toString()
            : complaint.user?.toString() || "";
        socket_service_1.default.emitToUser(userId, "payment:verification_requested", { complaintId: complaint._id }, "Payment Verification Requested", "Your payment verification request has been sent to admin");
        const result = new ApiSuccess_api_util_1.default(200, "Payment verification email sent to admin", {
            complaint,
            message: "Admin will verify your payment shortly",
        });
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        console.error("Payment verification request error:", error);
        const err = error instanceof ApiError_api_util_1.default ? error : new ApiError_api_util_1.default(500, error.message);
        res.status(err.statusCode).json(err);
    }
};
exports.requestPaymentVerification = requestPaymentVerification;
/**
 * Admin verifies payment (clicks link in email)
 * GET /api/v2/payment/verify/:token
 */
const verifyPayment = async (req, res) => {
    try {
        const { token } = req.params;
        const complaint = await Complaint_schema_1.ComplaintModel.findOne({
            paymentVerificationToken: token,
            paymentVerificationStatus: "pending",
        }).populate("user provider");
        if (!complaint) {
            return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1 style="color: #EF4444;">❌ Invalid or Expired Link</h1>
          <p>This verification link is invalid or has already been used.</p>
        </body>
        </html>
      `);
        }
        // Update complaint status
        complaint.paymentVerificationStatus = "verified";
        complaint.stage = "COMPLETED";
        complaint.paymentVerificationToken = null;
        await complaint.save();
        // Process EMI & Provider Cut
        await paymentCalculation_service_1.default.processPaymentCompletion(complaint._id.toString());
        // Emit completion events
        const userId = typeof complaint.user === 'object' && complaint.user?._id
            ? complaint.user._id.toString()
            : complaint.user?.toString() || "";
        const providerId = typeof complaint.provider === 'object' && complaint.provider?._id
            ? complaint.provider._id.toString()
            : complaint.provider?.toString() || null;
        socket_service_1.default.emitStageChanged(userId, providerId, complaint, "PAYMENT", "COMPLETED");
        res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial; text-align: center; padding: 50px;">
        <h1 style="color: #22C55E;">✓ Payment Verified</h1>
        <p>The payment has been successfully verified.</p>
        <p>Complaint <strong>#${complaint._id}</strong> is now marked as <strong>COMPLETED</strong>.</p>
        <p>Customer has been notified.</p>
      </body>
      </html>
    `);
    }
    catch (error) {
        console.error("Payment verification error:", error);
        res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial; text-align: center; padding: 50px;">
        <h1 style="color: #EF4444;">Error</h1>
        <p>${error.message}</p>
      </body>
      </html>
    `);
    }
};
exports.verifyPayment = verifyPayment;
/**
 * Admin rejects payment request (clicks link in email)
 * GET /api/v2/payment/reject/:token
 */
const rejectPayment = async (req, res) => {
    try {
        const { token } = req.params;
        const complaint = await Complaint_schema_1.ComplaintModel.findOne({
            paymentVerificationToken: token,
            paymentVerificationStatus: "pending",
        }).populate("user");
        if (!complaint) {
            return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1 style="color: #EF4444;">❌ Invalid or Expired Link</h1>
          <p>This verification link is invalid or has already been used.</p>
        </body>
        </html>
      `);
        }
        // Update complaint status
        complaint.paymentVerificationStatus = "rejected";
        complaint.paymentVerificationToken = null;
        await complaint.save();
        // Emit rejection event to customer
        const userId = typeof complaint.user === 'object' && complaint.user?._id
            ? complaint.user._id.toString()
            : complaint.user?.toString() || "";
        socket_service_1.default.emitToUser(userId, "payment:verification_rejected", { complaintId: complaint._id }, "Payment Verification Failed", "Your payment could not be verified. Please try again or contact support.");
        res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial; text-align: center; padding: 50px;">
        <h1 style="color: #EF4444;">Payment Rejected</h1>
        <p>The payment verification has been rejected.</p>
        <p>Complaint <strong>#${complaint._id}</strong> remains in <strong>PAYMENT</strong> stage.</p>
        <p>Customer has been notified to retry payment.</p>
      </body>
      </html>
    `);
    }
    catch (error) {
        console.error("Payment rejection error:", error);
        res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial; text-align: center; padding: 50px;">
        <h1 style="color: #EF4444;">Error</h1>
        <p>${error.message}</p>
      </body>
      </html>
    `);
    }
};
exports.rejectPayment = rejectPayment;
/**
 * Get payment QR code data for complaint
 * GET /api/v2/payment/qr/:complaintId
 */
const getPaymentQRCode = async (req, res) => {
    try {
        const { complaintId } = req.params;
        if (!complaintId) {
            throw new ApiError_api_util_1.default(400, "Complaint ID is required");
        }
        const complaint = await Complaint_schema_1.ComplaintModel.findById(complaintId)
            .populate("user")
            .populate("provider");
        if (!complaint) {
            throw new ApiError_api_util_1.default(404, "Complaint not found");
        }
        // Check if complaint is in PAYMENT stage
        if (complaint.stage !== "PAYMENT" && complaint.stage !== "APPROVAL") {
            throw new ApiError_api_util_1.default(400, "Complaint must be in PAYMENT or APPROVAL stage");
        }
        // Calculate remaining payment amount
        const remainingAmount = await paymentCalculation_service_1.default.getRemainingPaymentAmount(complaintId);
        if (remainingAmount <= 0) {
            return res.status(200).json(new ApiSuccess_api_util_1.default(200, "Payment already completed", {
                amount: 0,
                qrCode: null,
                upiLink: null,
                message: "No payment required",
            }));
        }
        // Get default UPI details for backward compatibility
        const upiId = process.env.UPI_ID || "9824157811@upi";
        const payeeName = process.env.UPI_PAYEE_NAME || "Serwise";
        const transactionNote = `Payment for Complaint #${complaintId.slice(-6)}`;
        // Generate Razorpay link for QR code
        const paymentRef = `PAY-C-${complaintId}`;
        const razorpayLink = `https://razorpay.me/@radixtechnologies?amount=${remainingAmount.toFixed(2)}&notes=${encodeURIComponent(paymentRef)}`;
        const upiLink = razorpayLink; // Swap UPI variable to Razorpay link to leverage existing frontend params
        // Generate QR code data
        // Frontend will generate the actual QR code image from this data
        const qrCodeData = razorpayLink;
        const result = new ApiSuccess_api_util_1.default(200, "Payment QR code generated", {
            complaintId: complaint._id.toString(),
            amount: remainingAmount,
            qrCode: qrCodeData,
            upiLink: upiLink,
            upiId: upiId,
            payeeName: payeeName,
            transactionNote: transactionNote,
        });
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        console.error("Get payment QR code error:", error);
        const err = error instanceof ApiError_api_util_1.default ? error : new ApiError_api_util_1.default(500, error.message);
        res.status(err.statusCode).json(err);
    }
};
exports.getPaymentQRCode = getPaymentQRCode;
/**
 * Calculate payment amount for complaint
 * POST /api/v2/payment/calculate/:complaintId
 */
const calculatePayment = async (req, res) => {
    try {
        const { complaintId } = req.params;
        if (!complaintId) {
            throw new ApiError_api_util_1.default(400, "Complaint ID is required");
        }
        const amount = await paymentCalculation_service_1.default.calculatePaymentAmount(complaintId);
        const remainingAmount = await paymentCalculation_service_1.default.getRemainingPaymentAmount(complaintId);
        const result = new ApiSuccess_api_util_1.default(200, "Payment calculated", {
            totalAmount: amount,
            remainingAmount: remainingAmount,
        });
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        console.error("Calculate payment error:", error);
        const err = error instanceof ApiError_api_util_1.default ? error : new ApiError_api_util_1.default(500, error.message);
        res.status(err.statusCode).json(err);
    }
};
exports.calculatePayment = calculatePayment;
/**
 * Collect cash payment (deduct from provider wallet)
 * POST /api/v2/payment/cash-collect/:complaintId
 */
const collectCashPayment = async (req, res) => {
    try {
        const { complaintId } = req.params;
        const providerId = req.user?._id || req.user?.id;
        if (!providerId) {
            throw new ApiError_api_util_1.default(401, "Unauthorized");
        }
        if (!complaintId) {
            throw new ApiError_api_util_1.default(400, "Complaint ID is required");
        }
        const complaint = await Complaint_schema_1.ComplaintModel.findById(complaintId);
        if (!complaint) {
            throw new ApiError_api_util_1.default(404, "Complaint not found");
        }
        // Verify provider is assigned to this complaint
        const complaintProviderId = typeof complaint.provider === 'object' && complaint.provider?._id
            ? complaint.provider._id.toString()
            : complaint.provider?.toString() || null;
        if (complaintProviderId !== providerId.toString()) {
            throw new ApiError_api_util_1.default(403, "Unauthorized: You are not assigned to this complaint");
        }
        // Check if already collected
        if (complaint.cashCollected) {
            throw new ApiError_api_util_1.default(400, "Cash already collected for this complaint");
        }
        // Calculate remaining payment amount
        const remainingAmount = await paymentCalculation_service_1.default.getRemainingPaymentAmount(complaintId);
        if (remainingAmount <= 0) {
            throw new ApiError_api_util_1.default(400, "No payment required for this complaint");
        }
        // Deduct from provider wallet
        const walletService = await Promise.resolve().then(() => require("./wallet.controller"));
        // We need to use the wallet service directly
        const { debitWallet } = await Promise.resolve().then(() => require("../services/wallet.services"));
        const { WalletLedgerSource } = await Promise.resolve().then(() => require("../types/wallet.type"));
        await debitWallet(providerId.toString(), remainingAmount, WalletLedgerSource.ORDER_PAYMENT, complaintId, { type: "cash_collection", complaintId: complaintId });
        // Update complaint
        complaint.cashCollected = true;
        complaint.cashCollectedAt = new Date();
        complaint.stage = "COMPLETED";
        // Track the cash payment
        complaint.payments.push({
            method: "cash",
            amount: remainingAmount,
            referenceId: `CASH-${Date.now()}`,
            date: new Date()
        });
        complaint.remainingAmount = 0;
        await complaint.save();
        // Process EMI & Provider Cut
        await paymentCalculation_service_1.default.processPaymentCompletion(complaint._id.toString());
        // Emit completion events
        const userId = typeof complaint.user === 'object' && complaint.user?._id
            ? complaint.user._id.toString()
            : complaint.user?.toString() || "";
        socket_service_1.default.emitStageChanged(userId, providerId.toString(), complaint, "PAYMENT", "COMPLETED");
        const result = new ApiSuccess_api_util_1.default(200, "Cash payment collected successfully", {
            complaint: complaint,
            amount: remainingAmount,
        });
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        console.error("Collect cash payment error:", error);
        const err = error instanceof ApiError_api_util_1.default ? error : new ApiError_api_util_1.default(500, error.message);
        res.status(err.statusCode).json(err);
    }
};
exports.collectCashPayment = collectCashPayment;
/**
 * Bypass payment if remaining amount is zero
 * POST /api/v2/payment/bypass/:complaintId
 */
const bypassZeroPayment = async (req, res) => {
    try {
        const { complaintId } = req.params;
        const providerId = req.user?._id || req.user?.id;
        if (!providerId) {
            throw new ApiError_api_util_1.default(401, "Unauthorized");
        }
        if (!complaintId) {
            throw new ApiError_api_util_1.default(400, "Complaint ID is required");
        }
        const complaint = await Complaint_schema_1.ComplaintModel.findById(complaintId);
        if (!complaint) {
            throw new ApiError_api_util_1.default(404, "Complaint not found");
        }
        // Verify provider is assigned to this complaint
        const complaintProviderId = typeof complaint.provider === 'object' && complaint.provider?._id
            ? complaint.provider._id.toString()
            : complaint.provider?.toString() || null;
        if (complaintProviderId !== providerId.toString()) {
            throw new ApiError_api_util_1.default(403, "Unauthorized: You are not assigned to this complaint");
        }
        const remainingAmount = await paymentCalculation_service_1.default.getRemainingPaymentAmount(complaintId);
        if (remainingAmount > 0) {
            throw new ApiError_api_util_1.default(400, "Cannot bypass: Payment is still required (Amount > 0)");
        }
        // Update complaint
        complaint.stage = "COMPLETED";
        await complaint.save();
        // Process EMI & Provider Cut
        await paymentCalculation_service_1.default.processPaymentCompletion(complaint._id.toString());
        // Emit completion events
        const userId = typeof complaint.user === 'object' && complaint.user?._id
            ? complaint.user._id.toString()
            : complaint.user?.toString() || "";
        socket_service_1.default.emitStageChanged(userId, providerId.toString(), complaint, "PAYMENT", "COMPLETED");
        const result = new ApiSuccess_api_util_1.default(200, "Payment bypassed successfully (Zero amount)", {
            complaint: complaint,
        });
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        console.error("Bypass zero payment error:", error);
        const err = error instanceof ApiError_api_util_1.default ? error : new ApiError_api_util_1.default(500, error.message);
        res.status(err.statusCode).json(err);
    }
};
exports.bypassZeroPayment = bypassZeroPayment;
/**
 * Handle Razorpay Webhooks (Server-to-Server)
 * POST /api/v2/payment/razorpay/webhook
 */
const razorpayWebhook = async (req, res) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        // Skip validation if secret is not set (e.g. local dev), but log a warning
        if (webhookSecret) {
            const signature = req.headers["x-razorpay-signature"];
            // Re-create the raw body exactly as received for HMAC verification. 
            // In express, req.body is already parsed if body-parser is used.
            const payload = JSON.stringify(req.body);
            const expectedSignature = crypto
                .createHmac("sha256", webhookSecret)
                .update(payload)
                .digest("hex");
            if (expectedSignature !== signature) {
                console.error("Razorpay Webhook verification failed. Signature mismatch.");
                return res.status(400).send("Invalid signature");
            }
        }
        else {
            console.warn("RAZORPAY_WEBHOOK_SECRET is not set. Skipping signature verification (danger!).");
        }
        const { event, payload } = req.body;
        if (event === "payment.captured" || event === "payment_link.paid" || event === "order.paid") {
            // Locate the paymentRef from the notes (which the app pre-fills in the comment box)
            // Razorpay puts this under payload.payment.entity.notes.comment or similar
            const paymentEntity = payload?.payment?.entity || payload?.payment_link?.entity || payload?.order?.entity;
            const notes = paymentEntity?.notes || {};
            // The RazorpayWebViewModal injects `paymentRef` into the "comment" input fields.
            const paymentRef = notes.comment || notes.notes || "";
            const amountRupees = (paymentEntity?.amount || 0) / 100; // Razorpay amounts are in paise
            console.log(`Webhook received for paymentRef: ${paymentRef}, amount: ${amountRupees}`);
            if (paymentRef.startsWith("PAY-W-")) {
                // Wallet Recharge Flow
                const parts = paymentRef.split("-");
                if (parts.length >= 3) {
                    const userId = parts[2]; // PAY-W-<userId>-<timestamp>
                    console.log(`Processing Wallet Recharge for user: ${userId}, amount: ${amountRupees}`);
                    await (0, wallet_services_1.creditWallet)(userId, amountRupees, wallet_type_1.WalletLedgerSource.RECHARGE, paymentEntity?.id || paymentRef, { description: "Wallet Recharge via Razorpay", paymentId: paymentEntity?.id });
                    // Notify user via sockets
                    socket_service_1.default.emitToUser(userId, "wallet:recharge_success", { balanceAdded: amountRupees, paymentId: paymentEntity?.id }, "Wallet Recharged", `₹${amountRupees} added to your wallet successfully.`);
                }
            }
            else if (paymentRef.startsWith("PAY-SM-")) {
                // Metered Subscription Remaining Balance Payment
                // Clears the outstanding balance on an active metered subscription
                const subscriptionId = paymentRef.slice("PAY-SM-".length);
                const sub = await UserSubscription_schema_1.UserSubscriptionModel.findById(subscriptionId);
                if (sub) {
                    if (sub.remainingAmount <= 0) {
                        console.log(`Subscription ${subscriptionId} remaining balance already cleared. Skipping.`);
                    }
                    else {
                        console.log(`Clearing metered remaining balance for subscription ${subscriptionId}, ₹${amountRupees}`);
                        sub.totalPaid = (sub.totalPaid || 0) + amountRupees;
                        sub.remainingAmount = Math.max(0, (sub.remainingAmount || 0) - amountRupees);
                        sub.paymentStatus = sub.remainingAmount <= 0 ? "completed" : "partial";
                        await sub.save();
                        await SubscriptionPayment_schema_1.SubscriptionPaymentModel.create({
                            subscription: sub._id,
                            user: sub.user,
                            amount: amountRupees,
                            paymentType: "metered_completion",
                            transactionRef: paymentEntity?.id || paymentRef,
                            status: "completed",
                            paidAt: new Date(),
                        });
                        socket_service_1.default.emitToUser(sub.user.toString(), "subscription:remaining_paid", {
                            subscriptionId: sub._id,
                            amountPaid: amountRupees,
                            remainingAmount: sub.remainingAmount,
                        }, "Subscription Updated", `₹${amountRupees} received. Remaining services are now unlocked.`);
                    }
                }
                else {
                    console.error(`Subscription not found for paymentRef: ${paymentRef}`);
                }
            }
            else if (paymentRef.startsWith("PAY-S-")) {
                // Subscription Payment Flow — activate the pending subscription
                const subscriptionId = paymentRef.slice("PAY-S-".length);
                const sub = await UserSubscription_schema_1.UserSubscriptionModel.findById(subscriptionId);
                if (sub) {
                    if (sub.paymentStatus === "completed") {
                        console.log(`Subscription ${subscriptionId} is already paid. Skipping.`);
                    }
                    else {
                        console.log(`Activating subscription ${subscriptionId} for ₹${amountRupees}`);
                        const addonsTotalSales = (sub.addons_snapshot || []).reduce((sum, a) => sum + (a.pricing?.sub_sales || 0), 0);
                        const totalRequired = (sub.plan_snapshot?.pricing?.sub_sales || 0) + addonsTotalSales;
                        sub.totalPaid = (sub.totalPaid || 0) + amountRupees;
                        sub.remainingAmount = Math.max(0, totalRequired - sub.totalPaid);
                        sub.paymentStatus =
                            sub.totalPaid >= totalRequired ? "completed" : sub.totalPaid > 0 ? "partial" : "pending";
                        // Only upgrade status, never downgrade
                        if (sub.status === "pending" || sub.status === "scheduled") {
                            sub.status = sub.startDate <= new Date() ? "active" : "scheduled";
                        }
                        await sub.save();
                        await SubscriptionPayment_schema_1.SubscriptionPaymentModel.create({
                            subscription: sub._id,
                            user: sub.user,
                            amount: amountRupees,
                            paymentType: "upfront",
                            transactionRef: paymentEntity?.id || paymentRef,
                            status: "completed",
                            paidAt: new Date(),
                        });
                        // Cashback bonus — min ₹5, max up to maxDiscount
                        const maxDiscount = sub.plan_snapshot?.maxDiscount || 0;
                        if (maxDiscount > 0) {
                            const rawCashback = Math.round(Math.min(Math.random(), Math.random(), Math.random()) * maxDiscount);
                            const cashback = Math.max(5, rawCashback);
                            try {
                                await (0, wallet_services_1.creditWallet)(sub.user.toString(), cashback, wallet_type_1.WalletLedgerSource.CASHBACK, sub._id.toString(), { description: `Subscription cashback bonus — ₹${cashback}` });
                            }
                            catch (err) {
                                console.error("Failed to credit subscription cashback:", err);
                            }
                        }
                        (0, telegram_service_1.notifyPaymentVerified)({
                            sub,
                            amountRupees,
                            paymentId: paymentEntity?.id || paymentRef,
                            paymentRef,
                        }).catch(() => { });
                        socket_service_1.default.emitToUser(sub.user.toString(), "subscription:activated", { subscriptionId: sub._id, status: sub.status, amountPaid: amountRupees }, "Subscription Activated", `Your subscription is now ${sub.status}.`);
                    }
                }
                else {
                    console.error(`Subscription not found for paymentRef: ${paymentRef}`);
                }
            }
            else if (paymentRef.startsWith("PAY-C-") || paymentRef.startsWith("PAY-")) {
                // Complaint Booking Payment Flow
                const complaint = await Complaint_schema_1.ComplaintModel.findOne({ paymentRef });
                if (complaint) {
                    if (complaint.stage !== "COMPLETED") {
                        console.log(`Processing Complaint Payment for complaint: ${complaint._id}`);
                        complaint.cashCollected = false; // It's online
                        complaint.stage = "COMPLETED";
                        complaint.calculatedPaymentAmount = amountRupees;
                        complaint.calculatedPaymentAt = new Date();
                        // Track the online payment
                        complaint.payments.push({
                            method: "online",
                            amount: amountRupees,
                            referenceId: paymentEntity?.id || paymentRef,
                            date: new Date()
                        });
                        const totalPaid = complaint.payments.reduce((sum, p) => sum + p.amount, 0);
                        complaint.remainingAmount = Math.max(0, (complaint.totalAmount || 0) - totalPaid);
                        await complaint.save();
                        // Process EMI & Provider Cut
                        await paymentCalculation_service_1.default.processPaymentCompletion(complaint._id.toString());
                        // Emit completion events
                        const userId = typeof complaint.user === 'object' && complaint.user?._id
                            ? complaint.user._id.toString()
                            : complaint.user?.toString() || "";
                        const providerId = typeof complaint.provider === 'object' && complaint.provider?._id
                            ? complaint.provider._id.toString()
                            : complaint.provider?.toString() || null;
                        socket_service_1.default.emitStageChanged(userId, providerId, complaint, "PAYMENT", "COMPLETED");
                    }
                    else {
                        console.log(`Complaint ${complaint._id} is already marked COMPLETED.`);
                    }
                }
                else {
                    console.error(`Complaint not found for paymentRef: ${paymentRef}`);
                }
            }
        }
        // Razorpay expects a 200 OK fast
        res.status(200).send("OK");
    }
    catch (error) {
        console.error("Razorpay webhook error:", error);
        res.status(500).send("Webhook Error");
    }
};
exports.razorpayWebhook = razorpayWebhook;
//# sourceMappingURL=payment.controller.js.map