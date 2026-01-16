// services/complaint.services.ts
import * as complaintRepo from "../repositories/complaint.repo";
import ApiError from "../utils/api/ApiError.api.util";
import ApiSuccess from "../utils/api/ApiSuccess.api.util";
import { getAutoAssignedProvider } from "../utils/providerAssign.util";
import { complaintStages, IComplaint } from "../types/comlpaint.type";
// import { mongodbId } from "../types/common";

export const createComplaint = async (
  data: Partial<IComplaint>,
  userId: mongodbId
) => {
  console.log("Creating complaint with data:", data, "for user:", userId);
  data["user"] = userId;

  if (!data.provider) {
    const provider = await getAutoAssignedProvider();
    if (!provider) throw new ApiError(400, "No provider available");
    data.provider = provider;
  }

  const complaint = await complaintRepo.createComplaint(data);

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
  data: Partial<IComplaint>
) => {
  const updated = await complaintRepo.updateComplaint(id, data);
  if (!updated) throw new ApiError(404, "Complaint not found");

  return new ApiSuccess(200, "Complaint updated", { complaint: updated });
};

export const deleteComplaint = async (id: mongodbId) => {
  const deleted = await complaintRepo.deleteComplaint(id);
  if (!deleted) throw new ApiError(404, "Complaint not found");

  return new ApiSuccess(200, "Complaint deleted", null);
};

export const updateStage = async (id: mongodbId, stage: complaintStages) => {
  const updated = await complaintRepo.updateComplaint(id, { stage });
  if (!updated) throw new ApiError(404, "Complaint not found");

  return new ApiSuccess(200, "Stage updated", { complaint: updated });
};

export const addQuote = async (id: mongodbId, quoteId: mongodbId) => {
  const updated = await complaintRepo.updateComplaint(id, { quote: quoteId });
  if (!updated) throw new ApiError(404, "Complaint not found");

  return new ApiSuccess(200, "Quote added", { complaint: updated });
};

export const listComplaintsByUser = async (userId: mongodbId) => {
  const complaints = await complaintRepo.listComplaintsByUser(userId);
  return new ApiSuccess(200, "User complaints fetched", { complaints });
}

export const listComplaintsByProvider = async (providerId: mongodbId) => {
  const complaints = await complaintRepo.listComplaintsByProvider(providerId);
  return new ApiSuccess(200, "Provider complaints fetched", { complaints });
}
