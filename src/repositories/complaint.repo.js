"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findComplaintsByParentId = exports.listComplaintsByStage = exports.listOpenComplaintsByProvider = exports.listComplaintsByProvider = exports.listComplaintsByUser = exports.listComplaints = exports.deleteComplaint = exports.updateComplaint = exports.findComplaintById = exports.createComplaint = void 0;
// repositories/complaint.repo.ts
const Complaint_schema_1 = require("../models/schema/Complaint.schema");
const populateFields = "user provider addressId deviceId quote parentId subscriptionId";
const createComplaint = async (data) => {
    const complaint = new Complaint_schema_1.ComplaintModel(data);
    await complaint.save();
    return complaint.populate(populateFields);
};
exports.createComplaint = createComplaint;
const findComplaintById = async (id) => {
    return await Complaint_schema_1.ComplaintModel.findById(id).populate(populateFields);
};
exports.findComplaintById = findComplaintById;
const updateComplaint = async (id, data) => {
    return await Complaint_schema_1.ComplaintModel.findByIdAndUpdate(id, data, { new: true }).populate(populateFields);
};
exports.updateComplaint = updateComplaint;
const deleteComplaint = async (id) => {
    return await Complaint_schema_1.ComplaintModel.findByIdAndDelete(id);
};
exports.deleteComplaint = deleteComplaint;
const listComplaints = async () => {
    return await Complaint_schema_1.ComplaintModel.find()
        .populate(populateFields)
        .sort({ createdAt: -1 });
};
exports.listComplaints = listComplaints;
const listComplaintsByUser = async (userId) => {
    return await Complaint_schema_1.ComplaintModel.find({ user: userId })
        .populate(populateFields)
        .sort({ createdAt: -1 });
};
exports.listComplaintsByUser = listComplaintsByUser;
const listComplaintsByProvider = async (providerId) => {
    return await Complaint_schema_1.ComplaintModel.find({ provider: providerId })
        .populate(populateFields)
        .sort({ createdAt: -1 });
};
exports.listComplaintsByProvider = listComplaintsByProvider;
const listOpenComplaintsByProvider = async (providerId) => {
    return await Complaint_schema_1.ComplaintModel.find({
        provider: providerId,
        stage: { $nin: ["COMPLETED", "REJECTED"] },
    })
        .populate(populateFields)
        .sort({ createdAt: -1 });
};
exports.listOpenComplaintsByProvider = listOpenComplaintsByProvider;
const listComplaintsByStage = async (stage) => {
    return await Complaint_schema_1.ComplaintModel.find({ stage })
        .populate(populateFields)
        .sort({ createdAt: -1 });
};
exports.listComplaintsByStage = listComplaintsByStage;
const findComplaintsByParentId = async (parentId) => {
    return await Complaint_schema_1.ComplaintModel.find({ parentId })
        .populate(populateFields)
        .sort({ createdAt: -1 });
};
exports.findComplaintsByParentId = findComplaintsByParentId;
//# sourceMappingURL=complaint.repo.js.map