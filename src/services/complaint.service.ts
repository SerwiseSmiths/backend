// services/complaint.services.ts
import * as complaintRepo from "../repositories/complaint.repo";
import ApiError from "../utils/api/ApiError.api.util";
import ApiSuccess from "../utils/api/ApiSuccess.api.util";
import { getAutoAssignedProvider } from "../utils/providerAssign.util";
import {
  complaintStages,
  IComplaint,
  ICreateComplaintInput,
  IUpdateComplaintInput,
} from "../types/comlpaint.type";
import socketService from "./socket.service";
import { creditWallet } from "./wallet.services";
import { WalletLedgerSource } from "../types/wallet.type";
import { QuoteModel } from "../models/schema/Quote.schema";

export const createComplaint = async (
  data: ICreateComplaintInput,
  userId: mongodbId
) => {
  console.log("Creating complaint with data:", data, "for user:", userId);

  // Build complaint data - user from auth, not body; provider set by assignment flow
  const complaintData: Partial<IComplaint> = {
    ...data,
    user: userId,
    stage: "ENTRANCE", // Default status
  };

  // Force assign provider directly (skip 30s accept/reject flow)
  const provider = await getAutoAssignedProvider();
  if (provider) {
    complaintData.provider = provider;
  }

  // Handle Subscription
  if ((data as any).useSubscription && (data as any).userSubscriptionId) {
    const { validateSubscriptionForComplaint } = await import("./subscription.service");
    try {
      const subValidation = await validateSubscriptionForComplaint(
        userId,
        (data as any).userSubscriptionId
      );
      complaintData.subscriptionId = (data as any).userSubscriptionId;
      if (subValidation.data) {
        complaintData.serviceIndex = subValidation.data.nextIndex;
        console.log("Subscription validated for complaint, service index:", subValidation.data.nextIndex);
      }
    } catch (err: any) {
      throw new ApiError(400, `Subscription validation failed: ${err.message}`);
    }
  }

  const { paymentMethod, ...restData } = complaintData as any;
  const complaint = await complaintRepo.createComplaint(restData);

  // Handle wallet deductions
  if (paymentMethod === "wallet" || paymentMethod === "wallet_cash" || paymentMethod === "wallet_online") {
    const { getWallet, debitWallet } = await import("./wallet.services");
    const { WalletLedgerSource } = await import("../types/wallet.type");
    
    try {
      const walletRes = await getWallet(userId.toString());
      const balance = walletRes.data?.wallet?.balance || 0;
      const walletDeduction = Math.min(balance, 200); // 200 is fixed booking price
      
      if (walletDeduction > 0) {
        const debitRes = await debitWallet(
          userId.toString(),
          walletDeduction,
          WalletLedgerSource.ORDER_PAYMENT,
          complaint._id.toString(),
          { description: "Wallet deduction for booking" }
        );
        
        const walletLedgerId = debitRes.data?.ledger?._id;
        if (walletLedgerId) {
          await complaintRepo.updateComplaint(complaint._id, { 
              $push: { 
                  payments: { 
                      method: "wallet", 
                      amount: walletDeduction, 
                      referenceId: walletLedgerId.toString(), 
                      date: new Date() 
                  } 
              } 
          } as any);
        }
      }
    } catch (err: any) {
      console.error("Failed to deduct from wallet:", err);
    }
  }

  // If online payment, immediately credit ₹15 cashback to the wallet
  if (paymentMethod === "online" || paymentMethod === "wallet_online") {
    try {
      const { creditWallet } = await import("./wallet.services");
      const { WalletLedgerSource } = await import("../types/wallet.type");
      await creditWallet(
        userId.toString(),
        15,
        WalletLedgerSource.CASHBACK,
        complaint._id.toString(),
        { description: "UPI Cashback on booking" }
      );
      console.log(`Credited ₹15 cashback to user ${userId} for complaint ${complaint._id}`);
    } catch (err: any) {
      console.error("Failed to credit cashback to wallet:", err);
      // We don't want to abort complaint creation if wallet credit fails
    }
  }

  if (provider) {
    // Notify provider
    socketService.emitComplaintCreated(
      userId.toString(),
      provider.toString(),
      complaint
    );
    // Notify user that request was submitted
    socketService.emitToUser(
      userId.toString(),
      "complaint:created",
      { complaint, userId: userId.toString(), providerId: provider.toString() },
      "Complaint Created",
      "Your service request has been submitted"
    );
  } else {
    // No provider available; notify user only
    socketService.emitToUser(
      userId.toString(),
      "complaint:created",
      { complaint, userId: userId.toString(), providerId: null },
      "Complaint Created",
      "Your service request has been submitted. We're finding a provider."
    );
  }

  return new ApiSuccess(201, "Complaint created successfully", { complaint });
};

export const getComplaint = async (id: mongodbId) => {
  const complaint = await complaintRepo.findComplaintById(id);
  if (!complaint) throw new ApiError(404, "Complaint not found");

  return new ApiSuccess(200, "Complaint fetched", { complaint });
};

export const listComplaints = async () => {
  const complaints = await complaintRepo.listComplaints();
  return new ApiSuccess(200, "Complaints fetched", { complaints });
};

export const updateComplaint = async (
  id: mongodbId,
  data: IUpdateComplaintInput
) => {
  const updated = await complaintRepo.updateComplaint(id, data as Partial<IComplaint>);
  if (!updated) throw new ApiError(404, "Complaint not found");

  // Emit update event - extract IDs from potentially populated fields
  const userId = typeof updated.user === 'object' && updated.user?._id
    ? updated.user._id.toString()
    : updated.user?.toString() || "";
  const providerId = typeof updated.provider === 'object' && updated.provider?._id
    ? updated.provider._id.toString()
    : updated.provider?.toString() || null;

  socketService.emitComplaintUpdated(userId, providerId, updated);

  return new ApiSuccess(200, "Complaint updated", { complaint: updated });
};

export const deleteComplaint = async (id: mongodbId) => {
  const deleted = await complaintRepo.deleteComplaint(id);
  if (!deleted) throw new ApiError(404, "Complaint not found");

  return new ApiSuccess(200, "Complaint deleted", null);
};

export const updateStage = async (id: mongodbId, stage: complaintStages, rejectionReason?: string) => {
  const complaint = await complaintRepo.findComplaintById(id);
  if (!complaint) throw new ApiError(404, "Complaint not found");

  const oldStage = complaint.stage;

  // Prepare update data
  const updateData: any = { stage };

  // If rejecting, store rejection reason and metadata
  if (stage === "REJECTED" && rejectionReason) {
    updateData.rejectionReason = rejectionReason;
    updateData.rejectionMetadata = {
      rejectedAt: new Date(),
      rejectedBy: complaint.user, // Customer rejecting the quote
    };
  }

  const updated = await complaintRepo.updateComplaint(id, updateData);
  if (!updated) throw new ApiError(404, "Complaint not found");

  // Emit stage change event - extract IDs from potentially populated fields
  const userId = typeof updated.user === 'object' && updated.user?._id
    ? updated.user._id.toString()
    : updated.user?.toString() || "";
  const providerId = typeof updated.provider === 'object' && updated.provider?._id
    ? updated.provider._id.toString()
    : updated.provider?.toString() || null;

  socketService.emitStageChanged(userId, providerId, updated, oldStage, stage);

  return new ApiSuccess(200, "Stage updated", { complaint: updated });
};

export const addQuote = async (id: mongodbId, quoteId: mongodbId) => {
  const complaint = await complaintRepo.findComplaintById(id);
  if (!complaint) throw new ApiError(404, "Complaint not found");

  const oldStage = complaint.stage;

  // Fetch quote to check total amount for bypass logic
  const quote = await QuoteModel.findById(quoteId);
  if (!quote) throw new ApiError(404, "Quote not found");

  // If total is 0, bypass approval and payment, mark as COMPLETED
  const nextStage = quote.total === 0 ? "COMPLETED" : "APPROVAL";

  // Update complaint with quote and move to next stage
  const updated = await complaintRepo.updateComplaint(id, {
    quote: quoteId,
    stage: nextStage
  });
  if (!updated) throw new ApiError(404, "Complaint not found");

  // If completed and has subscription, record usage
  if (nextStage === "COMPLETED" && updated.subscriptionId && updated.serviceIndex) {
    const { recordUsage } = await import("./subscription.service");
    try {
      await recordUsage(updated.subscriptionId, updated._id, updated.serviceIndex);
      console.log(`Recorded usage for subscription ${updated.subscriptionId}, service index ${updated.serviceIndex}`);
    } catch (err) {
      console.error("Failed to record subscription usage:", err);
    }
  }

  // If completed and has a device linked, update device history
  if (nextStage === "COMPLETED" && updated.deviceId) {
    try {
      const DeviceModel = (await import("../models/schema/Device.schema")).default;
      await DeviceModel.findByIdAndUpdate(updated.deviceId, {
        lastServicedAt: new Date(),
        $push: {
          serviceHistory: {
            complaintId: updated._id.toString(),
            servicedAt: new Date(),
          },
        },
      });
      console.log(`Updated device history for device ${updated.deviceId}`);
    } catch (err) {
      console.error("Failed to update device history:", err);
    }
  }

  console.log(updated);

  // Extract user and provider IDs from potentially populated fields
  const userId = typeof updated.user === 'object' && updated.user?._id
    ? updated.user._id.toString()
    : updated.user?.toString() || "";
  const providerId = typeof updated.provider === 'object' && updated.provider?._id
    ? updated.provider._id.toString()
    : updated.provider?.toString() || null;

  // Emit quote added event
  socketService.emitQuoteAdded(userId, updated);

  // Emit stage change event if stage was updated
  if (oldStage !== nextStage) {
    socketService.emitStageChanged(userId, providerId, updated, oldStage, nextStage);
  }

  const responseMessage = nextStage === "COMPLETED" 
    ? "Quote added and complaint completed (Zero amount)" 
    : "Quote added and moved to approval";

  return new ApiSuccess(200, responseMessage, { complaint: updated });
};

export const addDevice = async (id: mongodbId, deviceId: mongodbId) => {
  const complaint = await complaintRepo.findComplaintById(id);
  if (!complaint) throw new ApiError(404, "Complaint not found");

  const updated = await complaintRepo.updateComplaint(id, { deviceId });
  if (!updated) throw new ApiError(404, "Complaint not found");

  // Emit update event - extract IDs from potentially populated fields
  const userId = typeof updated.user === 'object' && updated.user?._id
    ? updated.user._id.toString()
    : updated.user?.toString() || "";
  const providerId = typeof updated.provider === 'object' && updated.provider?._id
    ? updated.provider._id.toString()
    : updated.provider?.toString() || null;

  socketService.emitComplaintUpdated(userId, providerId, updated);

  return new ApiSuccess(200, "Device added", { complaint: updated });
};

export const addPayment = async (id: mongodbId, paymentId: mongodbId) => {
  const complaint = await complaintRepo.findComplaintById(id);
  if (!complaint) throw new ApiError(404, "Complaint not found");

  const updated = await complaintRepo.updateComplaint(id, { 
    $push: {
      payments: {
        method: "online", // fallback since old addPayment doesn't specify
        amount: 0,
        referenceId: paymentId.toString(),
        date: new Date()
      }
    }
  } as any);
  if (!updated) throw new ApiError(404, "Complaint not found");

  // Emit payment done event - extract IDs from potentially populated fields
  const userId = typeof updated.user === 'object' && updated.user?._id
    ? updated.user._id.toString()
    : updated.user?.toString() || "";
  const providerId = typeof updated.provider === 'object' && updated.provider?._id
    ? updated.provider._id.toString()
    : updated.provider?.toString() || null;

  socketService.emitPaymentDone(userId, providerId, updated);

  return new ApiSuccess(200, "Payment added", { complaint: updated });
};

export const listComplaintsByUser = async (userId: mongodbId) => {
  const complaints = await complaintRepo.listComplaintsByUser(userId);
  return new ApiSuccess(200, "User complaints fetched", { complaints });
};

export const listComplaintsByProvider = async (providerId: mongodbId) => {
  const complaints = await complaintRepo.listComplaintsByProvider(providerId);
  return new ApiSuccess(200, "Provider complaints fetched", { complaints });
};

export const listOpenComplaintsByProvider = async (providerId: mongodbId) => {
  const complaints = await complaintRepo.listOpenComplaintsByProvider(providerId);
  return new ApiSuccess(200, "Provider open complaints fetched", { complaints });
};

// Provider accepts complaint assignment
export const acceptComplaintAssignment = async (
  complaintId: mongodbId,
  providerId: mongodbId
) => {
  const providerAssignmentService = (await import("./providerAssignment.service")).default;
  const accepted = await providerAssignmentService.acceptAssignment(
    complaintId.toString(),
    providerId.toString()
  );

  if (!accepted) {
    throw new ApiError(400, "Assignment expired or not found");
  }

  const complaint = await complaintRepo.findComplaintById(complaintId);
  return new ApiSuccess(200, "Complaint assignment accepted", { complaint });
};

// Provider rejects complaint assignment
export const rejectComplaintAssignment = async (
  complaintId: mongodbId,
  providerId: mongodbId
) => {
  const providerAssignmentService = (await import("./providerAssignment.service")).default;
  await providerAssignmentService.rejectAssignment(
    complaintId.toString(),
    providerId.toString()
  );

  return new ApiSuccess(200, "Complaint assignment rejected", {
    message: "Finding alternative provider",
  });
};

export const reopenComplaint = async (
  parentId: mongodbId,
  data: ICreateComplaintInput,
  userId: mongodbId
) => {
  const parentComplaint = await complaintRepo.findComplaintById(parentId);
  if (!parentComplaint) throw new ApiError(404, "Parent complaint not found");

  // Create new complaint with reference to parent
  const complaintData: Partial<IComplaint> = {
    ...data,
    user: userId,
    parentId,
    stage: "ENTRANCE",
  };

  // Auto-assign provider
  const provider = await getAutoAssignedProvider();
  if (!provider) throw new ApiError(400, "No provider available");
  complaintData.provider = provider;

  const complaint = await complaintRepo.createComplaint(complaintData);

  // Emit events
  socketService.emitComplaintCreated(
    userId.toString(),
    provider.toString(),
    complaint
  );

  return new ApiSuccess(201, "Complaint reopened successfully", { complaint });
};

// Generate entry QR code for customer (or provider for testing)
export const generateEntryQr = async (
  complaintId: mongodbId,
  userId: mongodbId
) => {
  const complaint = await complaintRepo.findComplaintById(complaintId);
  if (!complaint) throw new ApiError(404, "Complaint not found");

  // Verify user owns the complaint OR is the assigned provider (for testing)
  const complaintUserId = typeof complaint.user === 'object' && complaint.user?._id
    ? complaint.user._id.toString()
    : complaint.user?.toString() || "";

  const complaintProviderId = typeof complaint.provider === 'object' && complaint.provider?._id
    ? complaint.provider._id.toString()
    : complaint.provider?.toString() || null;

  const isOwner = complaintUserId === userId.toString();
  const isProvider = complaintProviderId === userId.toString();

  if (!isOwner && !isProvider) {
    throw new ApiError(403, "Unauthorized: You can only generate QR for your own complaints or complaints assigned to you");
  }

  // Generate UUID token
  const { v4: uuidv4 } = require('uuid');
  const token = uuidv4();

  // Set expiry to 10 minutes from now
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);

  // Update complaint with token and expiry
  const updated = await complaintRepo.updateComplaint(complaintId, {
    entryQrToken: token,
    entryQrExpiresAt: expiresAt,
  });

  if (!updated) throw new ApiError(404, "Complaint not found");

  return new ApiSuccess(200, "QR code generated successfully", {
    token,
    expiresAt,
  });
};

// Validate entry QR code (provider scans customer's QR)
export const validateEntryQr = async (
  complaintId: mongodbId,
  token: string,
  providerId: mongodbId
) => {
  const complaint = await complaintRepo.findComplaintById(complaintId);
  if (!complaint) throw new ApiError(404, "Complaint not found");

  // Verify provider is assigned to this complaint
  const complaintProviderId = typeof complaint.provider === 'object' && complaint.provider?._id
    ? complaint.provider._id.toString()
    : complaint.provider?.toString() || null;

  if (complaintProviderId !== providerId.toString()) {
    throw new ApiError(403, "Unauthorized: You are not assigned to this complaint");
  }

  // Check if complaint is in ENTRANCE stage
  if (complaint.stage !== "ENTRANCE") {
    throw new ApiError(400, "QR validation can only be done for complaints in ENTRANCE stage");
  }

  // Check if token matches
  if (!complaint.entryQrToken || complaint.entryQrToken !== token) {
    throw new ApiError(400, "Invalid QR token");
  }

  // Check if token is expired
  if (!complaint.entryQrExpiresAt || new Date() > complaint.entryQrExpiresAt) {
    throw new ApiError(400, "QR code has expired. Please ask customer to generate a new one");
  }

  // Update stage to QR_VALIDATED
  const oldStage = complaint.stage;
  const updated = await complaintRepo.updateComplaint(complaintId, {
    stage: "QR_VALIDATED",
  });

  if (!updated) throw new ApiError(404, "Complaint not found");

  // Emit stage change event
  const userId = typeof updated.user === 'object' && updated.user?._id
    ? updated.user._id.toString()
    : updated.user?.toString() || "";
  const providerIdStr = typeof updated.provider === 'object' && updated.provider?._id
    ? updated.provider._id.toString()
    : updated.provider?.toString() || null;

  socketService.emitStageChanged(userId, providerIdStr, updated, oldStage, "QR_VALIDATED");

  return new ApiSuccess(200, "QR code validated successfully", {
    complaint: updated,
  });
};

// Request entrance QR scan (provider requests customer to scan)
export const requestEntranceScan = async (
  complaintId: mongodbId,
  providerId: mongodbId
) => {
  const complaint = await complaintRepo.findComplaintById(complaintId);
  if (!complaint) throw new ApiError(404, "Complaint not found");

  const complaintProviderId = typeof complaint.provider === 'object' && complaint.provider?._id
    ? complaint.provider._id.toString()
    : complaint.provider?.toString() || null;

  if (complaintProviderId !== providerId.toString()) {
    throw new ApiError(403, "Unauthorized: Only the assigned provider can request a scan");
  }

  const userId = typeof complaint.user === 'object' && complaint.user?._id
    ? complaint.user._id.toString()
    : complaint.user?.toString();

  if (!userId) {
    throw new ApiError(404, "Complaint has no associated user");
  }

  // Generate new QR code if in ENTRANCE stage
  let activeToken = complaint.entryQrToken;
  
  if (complaint.stage === "ENTRANCE") {
    const { v4: uuidv4 } = require('uuid');
    activeToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    
    await complaintRepo.updateComplaint(complaintId, {
      entryQrToken: activeToken as string,
      entryQrExpiresAt: expiresAt,
    });
  }

  socketService.emitToUser(
    userId,
    "complaint:entrance_scan_requested",
    { 
      complaintId: complaintId.toString(), 
      entryQrToken: activeToken,
      provider: complaint.provider 
    },
    "Entrance Access Requested",
    "Provider is at your location! Please tap here to display your Entrance QR Code."
  );

  return new ApiSuccess(200, "Scan requested successfully", null);
};