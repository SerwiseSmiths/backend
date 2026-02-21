import { Request, Response } from "express";
import { ComplaintModel } from "../models/schema/Complaint.schema";
import emailService from "../services/email.service";
import socketService from "../services/socket.service";
import paymentCalculationService from "../services/paymentCalculation.service";
import ApiError from "../utils/api/ApiError.api.util";
import ApiSuccess from "../utils/api/ApiSuccess.api.util";

/**
 * Customer triggers payment verification request
 * POST /api/v2/payment/request-verification
 */
export const requestPaymentVerification = async (req: Request, res: Response) => {
    try {
        const { complaintId } = req.body;

        if (!complaintId) {
            throw new ApiError(400, "Complaint ID is required");
        }

        const complaint = await ComplaintModel.findById(complaintId)
            .populate("user")
            .populate("quote");

        if (!complaint) {
            throw new ApiError(404, "Complaint not found");
        }

        // Check if complaint is in APPROVAL or PAYMENT stage
        if (complaint.stage !== "APPROVAL" && complaint.stage !== "PAYMENT") {
            throw new ApiError(400, "Complaint must be in APPROVAL or PAYMENT stage");
        }

        // Generate verification token
        const verificationToken = emailService.generateVerificationToken();

        // Update complaint with verification status
        complaint.paymentVerificationStatus = "pending";
        complaint.paymentVerificationToken = verificationToken;
        complaint.paymentRequestedAt = new Date();
        complaint.stage = "PAYMENT"; // Move to PAYMENT stage if in APPROVAL
        await complaint.save();

        // Get customer name and quote amount
        const customerName = (complaint.user as any)?.firstName
            ? `${(complaint.user as any).firstName} ${(complaint.user as any).lastName}`
            : "Customer";
        const amount = (complaint.quote as any)?.total || 0;

        // Send verification email to admin
        await emailService.sendPaymentVerificationEmail(
            complaint._id.toString(),
            customerName,
            amount,
            verificationToken
        );

        // Emit socket event to customer
        const userId = typeof complaint.user === 'object' && (complaint.user as any)?._id
            ? (complaint.user as any)._id.toString()
            : complaint.user?.toString() || "";

        socketService.emitToUser(
            userId,
            "payment:verification_requested",
            { complaintId: complaint._id },
            "Payment Verification Requested",
            "Your payment verification request has been sent to admin"
        );

        const result = new ApiSuccess(200, "Payment verification email sent to admin", {
            complaint,
            message: "Admin will verify your payment shortly",
        });
        res.status(result.statusCode).json(result);
    } catch (error: any) {
        console.error("Payment verification request error:", error);
        const err = error instanceof ApiError ? error : new ApiError(500, error.message);
        res.status(err.statusCode).json(err);
    }
};

/**
 * Admin verifies payment (clicks link in email)
 * GET /api/v2/payment/verify/:token
 */
export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;

        const complaint = await ComplaintModel.findOne({
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

        // Emit completion events
        const userId = typeof complaint.user === 'object' && (complaint.user as any)?._id
            ? (complaint.user as any)._id.toString()
            : complaint.user?.toString() || "";
        const providerId = typeof complaint.provider === 'object' && (complaint.provider as any)?._id
            ? (complaint.provider as any)._id.toString()
            : complaint.provider?.toString() || null;

        socketService.emitStageChanged(
            userId,
            providerId,
            complaint,
            "PAYMENT",
            "COMPLETED"
        );

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
    } catch (error: any) {
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

/**
 * Admin rejects payment request (clicks link in email)
 * GET /api/v2/payment/reject/:token
 */
export const rejectPayment = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;

        const complaint = await ComplaintModel.findOne({
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
        const userId = typeof complaint.user === 'object' && (complaint.user as any)?._id
            ? (complaint.user as any)._id.toString()
            : complaint.user?.toString() || "";

        socketService.emitToUser(
            userId,
            "payment:verification_rejected",
            { complaintId: complaint._id },
            "Payment Verification Failed",
            "Your payment could not be verified. Please try again or contact support."
        );

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
    } catch (error: any) {
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

/**
 * Get payment QR code data for complaint
 * GET /api/v2/payment/qr/:complaintId
 */
export const getPaymentQRCode = async (req: Request, res: Response) => {
    try {
        const { complaintId } = req.params;

        if (!complaintId) {
            throw new ApiError(400, "Complaint ID is required");
        }

        const complaint = await ComplaintModel.findById(complaintId)
            .populate("user")
            .populate("provider");

        if (!complaint) {
            throw new ApiError(404, "Complaint not found");
        }

        // Check if complaint is in PAYMENT stage
        if (complaint.stage !== "PAYMENT" && complaint.stage !== "APPROVAL") {
            throw new ApiError(400, "Complaint must be in PAYMENT or APPROVAL stage");
        }

        // Calculate remaining payment amount
        const remainingAmount = await paymentCalculationService.getRemainingPaymentAmount(complaintId);

        if (remainingAmount <= 0) {
            return res.status(200).json(
                new ApiSuccess(200, "Payment already completed", {
                    amount: 0,
                    qrCode: null,
                    upiLink: null,
                    message: "No payment required",
                })
            );
        }

        // Get UPI ID from environment or use default
        const upiId = process.env.UPI_ID || "servicesmith@upi";
        const payeeName = process.env.UPI_PAYEE_NAME || "ServiceSmith";
        const transactionNote = `Payment for Complaint #${complaintId.slice(-6)}`;

        // Generate UPI deep link
        const transactionRef = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
        const upiLink = `upi://pay?` +
            `pa=${encodeURIComponent(upiId)}&` +
            `pn=${encodeURIComponent(payeeName)}&` +
            `tn=${encodeURIComponent(transactionNote)}&` +
            `tr=${encodeURIComponent(transactionRef)}&` +
            `am=${remainingAmount.toFixed(2)}&` +
            `cu=INR`;

        // Generate QR code data (UPI link as QR code content)
        // Frontend will generate the actual QR code image from this data
        const qrCodeData = upiLink;

        const result = new ApiSuccess(200, "Payment QR code generated", {
            complaintId: complaint._id.toString(),
            amount: remainingAmount,
            qrCode: qrCodeData,
            upiLink: upiLink,
            upiId: upiId,
            payeeName: payeeName,
            transactionNote: transactionNote,
        });

        res.status(result.statusCode).json(result);
    } catch (error: any) {
        console.error("Get payment QR code error:", error);
        const err = error instanceof ApiError ? error : new ApiError(500, error.message);
        res.status(err.statusCode).json(err);
    }
};

/**
 * Calculate payment amount for complaint
 * POST /api/v2/payment/calculate/:complaintId
 */
export const calculatePayment = async (req: Request, res: Response) => {
    try {
        const { complaintId } = req.params;

        if (!complaintId) {
            throw new ApiError(400, "Complaint ID is required");
        }

        const amount = await paymentCalculationService.calculatePaymentAmount(complaintId);
        const remainingAmount = await paymentCalculationService.getRemainingPaymentAmount(complaintId);

        const result = new ApiSuccess(200, "Payment calculated", {
            totalAmount: amount,
            remainingAmount: remainingAmount,
        });

        res.status(result.statusCode).json(result);
    } catch (error: any) {
        console.error("Calculate payment error:", error);
        const err = error instanceof ApiError ? error : new ApiError(500, error.message);
        res.status(err.statusCode).json(err);
    }
};

/**
 * Collect cash payment (deduct from provider wallet)
 * POST /api/v2/payment/cash-collect/:complaintId
 */
export const collectCashPayment = async (req: Request, res: Response) => {
    try {
        const { complaintId } = req.params;
        const providerId = (req as any).user?._id || (req as any).user?.id;

        if (!providerId) {
            throw new ApiError(401, "Unauthorized");
        }

        if (!complaintId) {
            throw new ApiError(400, "Complaint ID is required");
        }

        const complaint = await ComplaintModel.findById(complaintId);

        if (!complaint) {
            throw new ApiError(404, "Complaint not found");
        }

        // Verify provider is assigned to this complaint
        const complaintProviderId = typeof complaint.provider === 'object' && (complaint.provider as any)?._id
            ? (complaint.provider as any)._id.toString()
            : complaint.provider?.toString() || null;

        if (complaintProviderId !== providerId.toString()) {
            throw new ApiError(403, "Unauthorized: You are not assigned to this complaint");
        }

        // Check if already collected
        if (complaint.cashCollected) {
            throw new ApiError(400, "Cash already collected for this complaint");
        }

        // Calculate remaining payment amount
        const remainingAmount = await paymentCalculationService.getRemainingPaymentAmount(complaintId);

        if (remainingAmount <= 0) {
            throw new ApiError(400, "No payment required for this complaint");
        }

        // Deduct from provider wallet
        const walletService = await import("./wallet.controller");
        // We need to use the wallet service directly
        const { debitWallet } = await import("../services/wallet.services");
        const { WalletLedgerSource } = await import("../types/wallet.type");

        await debitWallet(
            providerId.toString(),
            remainingAmount,
            WalletLedgerSource.ORDER_PAYMENT,
            complaintId,
            { type: "cash_collection", complaintId: complaintId }
        );

        // Update complaint
        complaint.cashCollected = true;
        complaint.cashCollectedAt = new Date();
        complaint.stage = "COMPLETED";
        await complaint.save();

        // Emit completion events
        const userId = typeof complaint.user === 'object' && (complaint.user as any)?._id
            ? (complaint.user as any)._id.toString()
            : complaint.user?.toString() || "";

        socketService.emitStageChanged(
            userId,
            providerId.toString(),
            complaint,
            "PAYMENT",
            "COMPLETED"
        );

        const result = new ApiSuccess(200, "Cash payment collected successfully", {
            complaint: complaint,
            amount: remainingAmount,
        });

        res.status(result.statusCode).json(result);
    } catch (error: any) {
        console.error("Collect cash payment error:", error);
        const err = error instanceof ApiError ? error : new ApiError(500, error.message);
        res.status(err.statusCode).json(err);
    }
};
