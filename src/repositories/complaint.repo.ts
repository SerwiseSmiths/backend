// repositories/complaint.repo.ts
import { ComplaintModel } from "../models/schema/Complaint.schema";
import { IComplaint } from "../types/comlpaint.type";

const populateFields =
  "user provider addressId deviceId quote parentId subscriptionId";

export const createComplaint = async (data: Partial<IComplaint>) => {
  const complaint = new ComplaintModel(data);
  await complaint.save();
  return complaint.populate(populateFields);
};

export const findComplaintById = async (id: mongodbId) => {
  return await ComplaintModel.findById(id).populate(populateFields);
};

export const updateComplaint = async (
  id: mongodbId,
  data: Partial<IComplaint>
) => {
  return await ComplaintModel.findByIdAndUpdate(id, data, { new: true }).populate(
    populateFields
  );
};

export const deleteComplaint = async (id: mongodbId) => {
  return await ComplaintModel.findByIdAndDelete(id);
};

export const listComplaints = async () => {
  return await ComplaintModel.find()
    .populate(populateFields)
    .sort({ createdAt: -1 });
};

export const listComplaintsByUser = async (userId: mongodbId) => {
  return await ComplaintModel.find({ user: userId })
    .populate(populateFields)
    .sort({ createdAt: -1 });
};

export const listComplaintsByProvider = async (providerId: mongodbId) => {
  return await ComplaintModel.find({ provider: providerId })
    .populate(populateFields)
    .sort({ createdAt: -1 });
};

export const listOpenComplaintsByProvider = async (providerId: mongodbId) => {
  return await ComplaintModel.find({
    provider: providerId,
    stage: { $nin: ["COMPLETED", "REJECTED"] },
  })
    .populate(populateFields)
    .sort({ createdAt: -1 });
};

export const listComplaintsByStage = async (stage: string) => {
  return await ComplaintModel.find({ stage })
    .populate(populateFields)
    .sort({ createdAt: -1 });
};

export const findComplaintsByParentId = async (parentId: mongodbId) => {
  return await ComplaintModel.find({ parentId })
    .populate(populateFields)
    .sort({ createdAt: -1 });
};
