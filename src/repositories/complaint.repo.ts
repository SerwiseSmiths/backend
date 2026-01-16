// repositories/complaint.repo.ts
import { ComplaintModel } from "../models/schema/Complaint.schema";
import { IComplaint } from "../types/comlpaint.type";
// import { mongodbId } from "../types/common";

export const createComplaint = async (
  data: Partial<IComplaint>
) => {
  const complaint = new ComplaintModel(data);
  await complaint.save();
  return complaint;
};

export const findComplaintById = async (id: mongodbId) => {
  return await ComplaintModel.findById(id);
};

export const updateComplaint = async (
  id: mongodbId,
  data: Partial<IComplaint>
) => {
  return await ComplaintModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteComplaint = async (id: mongodbId) => {
  return await ComplaintModel.findByIdAndDelete(id);
};

export const listComplaints = async () => {
  return await ComplaintModel.find().populate("user provider address device quote parent");
};

export const listComplaintsByUser = async (userId: mongodbId) => {
  return await ComplaintModel.find({ user: userId }).populate("user provider address device quote parent");
};

export const listComplaintsByProvider = async (providerId: mongodbId) => {
  return await ComplaintModel.find({ provider: providerId }).populate("user provider address device quote parent");
};
