import { Request, Response } from "express";
/**
 * Customer triggers payment verification request
 * POST /api/v2/payment/request-verification
 */
export declare const requestPaymentVerification: (req: Request, res: Response) => Promise<void>;
/**
 * Admin verifies payment (clicks link in email)
 * GET /api/v2/payment/verify/:token
 */
export declare const verifyPayment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Admin rejects payment request (clicks link in email)
 * GET /api/v2/payment/reject/:token
 */
export declare const rejectPayment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get payment QR code data for complaint
 * GET /api/v2/payment/qr/:complaintId
 */
export declare const getPaymentQRCode: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Calculate payment amount for complaint
 * POST /api/v2/payment/calculate/:complaintId
 */
export declare const calculatePayment: (req: Request, res: Response) => Promise<void>;
/**
 * Collect cash payment (deduct from provider wallet)
 * POST /api/v2/payment/cash-collect/:complaintId
 */
export declare const collectCashPayment: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=payment.controller.d.ts.map