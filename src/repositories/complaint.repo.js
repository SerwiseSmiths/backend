"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listComplaints = exports.deleteComplaint = exports.updateComplaint = exports.findComplaintById = exports.createComplaint = void 0;
// repositories/complaint.repo.ts
const Complaint_schema_1 = require("../models/schema/Complaint.schema");
// import { mongodbId } from "../types/common";
const createComplaint = async (data) => {
    const complaint = new Complaint_schema_1.ComplaintModel(data);
    await complaint.save();
    return complaint;
};
exports.createComplaint = createComplaint;
const findComplaintById = async (id) => {
    return await Complaint_schema_1.ComplaintModel.findById(id);
};
exports.findComplaintById = findComplaintById;
const updateComplaint = async (id, data) => {
    return await Complaint_schema_1.ComplaintModel.findByIdAndUpdate(id, data, { new: true });
};
exports.updateComplaint = updateComplaint;
const deleteComplaint = async (id) => {
    return await Complaint_schema_1.ComplaintModel.findByIdAndDelete(id);
};
exports.deleteComplaint = deleteComplaint;
const listComplaints = async () => {
    return await Complaint_schema_1.ComplaintModel.find().populate("user provider address device quote parent");
};
exports.listComplaints = listComplaints;
//# sourceMappingURL=complaint.repo.js.map