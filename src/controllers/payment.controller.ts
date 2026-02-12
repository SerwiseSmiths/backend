import { Request, Response } from "express";
import { ComplaintModel } from "../models/schema/Complaint.schema";
import emailService from "../services/email.service";
import socketService from "../services/socket.service";
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
