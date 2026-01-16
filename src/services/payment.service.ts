import Razorpay = require("razorpay");
import * as crypto from "crypto";
import Transaction from "../models/schema/Transection.schema";
import * as walletService from "./wallet.services"; // Import wallet service
import { WalletLedgerSource } from "../types/wallet.type";
import { SubscriptionModel } from "../models/schema/subscription.schema";
import { ComplaintModel } from "../models/schema/Complaint.schema";
import { QuoteModel } from "../models/schema/Quote.schema";
import ApiError from "../utils/api/ApiError.api.util";


class PaymentService {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "",
    });
  }

  async createOrder(data: {
    amount: number;
    userId: string;
    type: "wallet_recharge" | "order_payment" | "subscription" | "complaint";
    subscriptionId?: string;
    complaintId?: string;
  }) {
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
      await Transaction.create({
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
    } catch (error) {
      console.error("Razorpay Create Order Error:", error);
      throw new ApiError(500, "Failed to create payment order");
    }
  }

  verifyPaymentSignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): boolean {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      throw new ApiError(500, "Razorpay key secret not configured");
    }

    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(razorpayOrderId + "|" + razorpayPaymentId)
      .digest("hex");

    return generatedSignature === razorpaySignature;
  }

  async handlePaymentSuccess(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ) {
    const isSignatureValid = this.verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isSignatureValid) {
      throw new ApiError(400, "Invalid payment signature");
    }

    const transaction = await Transaction.findOne({ orderId: razorpayOrderId });
    if (!transaction) {
      throw new ApiError(404, "Transaction not found");
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
      await walletService.creditWallet(
        transaction.userId,
        transaction.amount,
        WalletLedgerSource.RECHARGE,
        razorpayPaymentId, // Use Payment ID as ref
        { orderId: razorpayOrderId }
      );
    } else if (transaction.paymentType === "order_payment") {
      // Logic for order payment success (e.g., notify order service)
      console.log(`Order Payment Successful for user ${transaction.userId}`);
    } else if (transaction.paymentType === "subscription") {
      if (transaction.subscriptionId) {
        const subscription = await SubscriptionModel.findById(transaction.subscriptionId);
        if (subscription) {
          const newRemaining = Math.max(0, subscription.payment_remaining - transaction.amount);
          const updates: any = { payment_remaining: newRemaining };
          if (newRemaining <= 0) {
            updates.state = "active";
          }
          await SubscriptionModel.findByIdAndUpdate(transaction.subscriptionId, updates);
        }
      }
    } else if (transaction.paymentType === "complaint") {
      if (transaction.complaintId) {
        // Find complaint to get the quote
        const complaint = await ComplaintModel.findById(transaction.complaintId);
        if (complaint && complaint.quote) {
          await QuoteModel.findByIdAndUpdate(complaint.quote, {
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

export default new PaymentService();
