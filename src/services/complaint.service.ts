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

export const createComplaint = async (
  data: ICreateComplaintInput,
  userId: mongodbId
) => {
  console.log("Creating complaint with data:", data, "for user:", userId);

  // Build complaint data - user from auth, not body
  const complaintData: Partial<IComplaint> = {
    ...data,
    user: userId,
    stage: "ENTRANCE", // Default status
  };

  // Always auto-assign provider
  const provider = await getAutoAssignedProvider();
  if (!provider) throw new ApiError(400, "No provider available");
  complaintData.provider = provider;

  const complaint = await complaintRepo.createComplaint(complaintData);

  // Emit WebSocket events
  socketService.emitComplaintCreated(
    userId.toString(),
    provider.toString(),
    complaint
  );

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

  // Emit update event
  socketService.emitComplaintUpdated(
    updated.user?.toString() || "",
    updated.provider?.toString() || null,
    updated
  );

  return new ApiSuccess(200, "Complaint updated", { complaint: updated });
};

export const deleteComplaint = async (id: mongodbId) => {
  const deleted = await complaintRepo.deleteComplaint(id);
  if (!deleted) throw new ApiError(404, "Complaint not found");

  return new ApiSuccess(200, "Complaint deleted", null);
};

export const updateStage = async (id: mongodbId, stage: complaintStages) => {
  const complaint = await complaintRepo.findComplaintById(id);
  if (!complaint) throw new ApiError(404, "Complaint not found");

  const oldStage = complaint.stage;
  const updated = await complaintRepo.updateComplaint(id, { stage });
  if (!updated) throw new ApiError(404, "Complaint not found");

  // Emit stage change event
  socketService.emitStageChanged(
    updated.user?.toString() || "",
    updated.provider?.toString() || null,
    updated,
    oldStage,
    stage
  );

  return new ApiSuccess(200, "Stage updated", { complaint: updated });
};

export const addQuote = async (id: mongodbId, quoteId: mongodbId) => {
  const updated = await complaintRepo.updateComplaint(id, { quote: quoteId });
  if (!updated) throw new ApiError(404, "Complaint not found");

  // Emit quote added event
  socketService.emitQuoteAdded(updated.user?.toString() || "", updated);

  return new ApiSuccess(200, "Quote added", { complaint: updated });
};

export const addDevice = async (id: mongodbId, deviceId: mongodbId) => {
  const updated = await complaintRepo.updateComplaint(id, { deviceId });
  if (!updated) throw new ApiError(404, "Complaint not found");

  return new ApiSuccess(200, "Device added", { complaint: updated });
};

export const addPayment = async (id: mongodbId, paymentId: mongodbId) => {
  const complaint = await complaintRepo.findComplaintById(id);
  if (!complaint) throw new ApiError(404, "Complaint not found");

  const updated = await complaintRepo.updateComplaint(id, { payment: paymentId });
  if (!updated) throw new ApiError(404, "Complaint not found");

  // Emit payment done event
  socketService.emitPaymentDone(
    updated.user?.toString() || "",
    updated.provider?.toString() || null,
    updated
  );

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
