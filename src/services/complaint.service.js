"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addQuote = exports.updateStage = exports.deleteComplaint = exports.updateComplaint = exports.listComplaints = exports.getComplaint = exports.createComplaint = void 0;
// services/complaint.services.ts
const complaintRepo = require("../repositories/complaint.repo");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
const ApiSuccess_api_util_1 = require("../utils/api/ApiSuccess.api.util");
const providerAssign_util_1 = require("../utils/providerAssign.util");
// import { mongodbId } from "../types/common";
const createComplaint = async (data, userId) => {
    data.user = userId;
    if (!data.provider) {
        const provider = await (0, providerAssign_util_1.getAutoAssignedProvider)();
        if (!provider)
            throw new ApiError_api_util_1.default(400, "No provider available");
        data.provider = provider;
    }
    const complaint = await complaintRepo.createComplaint(data);
    return new ApiSuccess_api_util_1.default(201, "Complaint created successfully", { complaint });
};
exports.createComplaint = createComplaint;
const getComplaint = async (id) => {
    const complaint = await complaintRepo.findComplaintById(id);
    if (!complaint)
        throw new ApiError_api_util_1.default(404, "Complaint not found");
    return new ApiSuccess_api_util_1.default(200, "Complaint fetched", { complaint });
};
exports.getComplaint = getComplaint;
const listComplaints = async () => {
    const complaints = await complaintRepo.listComplaints();
    return new ApiSuccess_api_util_1.default(200, "Complaints fetched", { complaints });
};
exports.listComplaints = listComplaints;
const updateComplaint = async (id, data) => {
    const updated = await complaintRepo.updateComplaint(id, data);
    if (!updated)
        throw new ApiError_api_util_1.default(404, "Complaint not found");
    return new ApiSuccess_api_util_1.default(200, "Complaint updated", { complaint: updated });
};
exports.updateComplaint = updateComplaint;
const deleteComplaint = async (id) => {
    const deleted = await complaintRepo.deleteComplaint(id);
    if (!deleted)
        throw new ApiError_api_util_1.default(404, "Complaint not found");
    return new ApiSuccess_api_util_1.default(200, "Complaint deleted", null);
};
exports.deleteComplaint = deleteComplaint;
const updateStage = async (id, stage) => {
    const updated = await complaintRepo.updateComplaint(id, { stage });
    if (!updated)
        throw new ApiError_api_util_1.default(404, "Complaint not found");
    return new ApiSuccess_api_util_1.default(200, "Stage updated", { complaint: updated });
};
exports.updateStage = updateStage;
const addQuote = async (id, quoteId) => {
    const updated = await complaintRepo.updateComplaint(id, { quote: quoteId });
    if (!updated)
        throw new ApiError_api_util_1.default(404, "Complaint not found");
    return new ApiSuccess_api_util_1.default(200, "Quote added", { complaint: updated });
};
exports.addQuote = addQuote;
//# sourceMappingURL=complaint.service.js.map