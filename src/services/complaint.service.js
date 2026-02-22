"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEntryQr = exports.generateEntryQr = exports.reopenComplaint = exports.rejectComplaintAssignment = exports.acceptComplaintAssignment = exports.listComplaintsByProvider = exports.listComplaintsByUser = exports.addPayment = exports.addDevice = exports.addQuote = exports.updateStage = exports.deleteComplaint = exports.updateComplaint = exports.listComplaints = exports.getComplaint = exports.createComplaint = void 0;
// services/complaint.services.ts
const complaintRepo = require("../repositories/complaint.repo");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
const ApiSuccess_api_util_1 = require("../utils/api/ApiSuccess.api.util");
const providerAssign_util_1 = require("../utils/providerAssign.util");
const socket_service_1 = require("./socket.service");
const createComplaint = async (data, userId) => {
    console.log("Creating complaint with data:", data, "for user:", userId);
    // Build complaint data - user from auth, not body; provider set by assignment flow
    const complaintData = {
        ...data,
        user: userId,
        stage: "ENTRANCE", // Default status
    };
    const complaint = await complaintRepo.createComplaint(complaintData);
    // Assign to first available provider (30s accept/reject flow)
    const provider = await (0, providerAssign_util_1.getAutoAssignedProvider)();
    if (provider) {
        const providerAssignmentService = (await Promise.resolve().then(() => require("./providerAssignment.service"))).default;
        await providerAssignmentService.assignToProvider(complaint._id.toString(), provider.toString());
        // Notify user that request was submitted
        socket_service_1.default.emitToUser(userId.toString(), "complaint:created", { complaint, userId: userId.toString(), providerId: provider.toString() }, "Complaint Created", "Your service request has been submitted");
    }
    else {
        // No provider available; notify user only
        socket_service_1.default.emitToUser(userId.toString(), "complaint:created", { complaint, userId: userId.toString(), providerId: null }, "Complaint Created", "Your service request has been submitted. We're finding a provider.");
    }
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
    // Emit update event - extract IDs from potentially populated fields
    const userId = typeof updated.user === 'object' && updated.user?._id
        ? updated.user._id.toString()
        : updated.user?.toString() || "";
    const providerId = typeof updated.provider === 'object' && updated.provider?._id
        ? updated.provider._id.toString()
        : updated.provider?.toString() || null;
    socket_service_1.default.emitComplaintUpdated(userId, providerId, updated);
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
const updateStage = async (id, stage, rejectionReason) => {
    const complaint = await complaintRepo.findComplaintById(id);
    if (!complaint)
        throw new ApiError_api_util_1.default(404, "Complaint not found");
    const oldStage = complaint.stage;
    // Prepare update data
    const updateData = { stage };
    // If rejecting, store rejection reason and metadata
    if (stage === "REJECTED" && rejectionReason) {
        updateData.rejectionReason = rejectionReason;
        updateData.rejectionMetadata = {
            rejectedAt: new Date(),
            rejectedBy: complaint.user, // Customer rejecting the quote
        };
    }
    const updated = await complaintRepo.updateComplaint(id, updateData);
    if (!updated)
        throw new ApiError_api_util_1.default(404, "Complaint not found");
    // Emit stage change event - extract IDs from potentially populated fields
    const userId = typeof updated.user === 'object' && updated.user?._id
        ? updated.user._id.toString()
        : updated.user?.toString() || "";
    const providerId = typeof updated.provider === 'object' && updated.provider?._id
        ? updated.provider._id.toString()
        : updated.provider?.toString() || null;
    socket_service_1.default.emitStageChanged(userId, providerId, updated, oldStage, stage);
    return new ApiSuccess_api_util_1.default(200, "Stage updated", { complaint: updated });
};
exports.updateStage = updateStage;
const addQuote = async (id, quoteId) => {
    const complaint = await complaintRepo.findComplaintById(id);
    if (!complaint)
        throw new ApiError_api_util_1.default(404, "Complaint not found");
    const oldStage = complaint.stage;
    // Update complaint with quote and move to APPROVAL stage
    const updated = await complaintRepo.updateComplaint(id, {
        quote: quoteId,
        stage: "APPROVAL" // Move to approval after estimation is submitted
    });
    if (!updated)
        throw new ApiError_api_util_1.default(404, "Complaint not found");
    console.log(updated);
    // Extract user and provider IDs from potentially populated fields
    const userId = typeof updated.user === 'object' && updated.user?._id
        ? updated.user._id.toString()
        : updated.user?.toString() || "";
    const providerId = typeof updated.provider === 'object' && updated.provider?._id
        ? updated.provider._id.toString()
        : updated.provider?.toString() || null;
    // Emit quote added event
    socket_service_1.default.emitQuoteAdded(userId, updated);
    // Emit stage change event if stage was updated
    if (oldStage !== "APPROVAL") {
        socket_service_1.default.emitStageChanged(userId, providerId, updated, oldStage, "APPROVAL");
    }
    return new ApiSuccess_api_util_1.default(200, "Quote added and moved to approval", { complaint: updated });
};
exports.addQuote = addQuote;
const addDevice = async (id, deviceId) => {
    const complaint = await complaintRepo.findComplaintById(id);
    if (!complaint)
        throw new ApiError_api_util_1.default(404, "Complaint not found");
    const updated = await complaintRepo.updateComplaint(id, { deviceId });
    if (!updated)
        throw new ApiError_api_util_1.default(404, "Complaint not found");
    // Emit update event - extract IDs from potentially populated fields
    const userId = typeof updated.user === 'object' && updated.user?._id
        ? updated.user._id.toString()
        : updated.user?.toString() || "";
    const providerId = typeof updated.provider === 'object' && updated.provider?._id
        ? updated.provider._id.toString()
        : updated.provider?.toString() || null;
    socket_service_1.default.emitComplaintUpdated(userId, providerId, updated);
    return new ApiSuccess_api_util_1.default(200, "Device added", { complaint: updated });
};
exports.addDevice = addDevice;
const addPayment = async (id, paymentId) => {
    const complaint = await complaintRepo.findComplaintById(id);
    if (!complaint)
        throw new ApiError_api_util_1.default(404, "Complaint not found");
    const updated = await complaintRepo.updateComplaint(id, { payment: paymentId });
    if (!updated)
        throw new ApiError_api_util_1.default(404, "Complaint not found");
    // Emit payment done event - extract IDs from potentially populated fields
    const userId = typeof updated.user === 'object' && updated.user?._id
        ? updated.user._id.toString()
        : updated.user?.toString() || "";
    const providerId = typeof updated.provider === 'object' && updated.provider?._id
        ? updated.provider._id.toString()
        : updated.provider?.toString() || null;
    socket_service_1.default.emitPaymentDone(userId, providerId, updated);
    return new ApiSuccess_api_util_1.default(200, "Payment added", { complaint: updated });
};
exports.addPayment = addPayment;
const listComplaintsByUser = async (userId) => {
    const complaints = await complaintRepo.listComplaintsByUser(userId);
    return new ApiSuccess_api_util_1.default(200, "User complaints fetched", { complaints });
};
exports.listComplaintsByUser = listComplaintsByUser;
const listComplaintsByProvider = async (providerId) => {
    const complaints = await complaintRepo.listComplaintsByProvider(providerId);
    return new ApiSuccess_api_util_1.default(200, "Provider complaints fetched", { complaints });
};
exports.listComplaintsByProvider = listComplaintsByProvider;
// Provider accepts complaint assignment
const acceptComplaintAssignment = async (complaintId, providerId) => {
    const providerAssignmentService = (await Promise.resolve().then(() => require("./providerAssignment.service"))).default;
    const accepted = await providerAssignmentService.acceptAssignment(complaintId.toString(), providerId.toString());
    if (!accepted) {
        throw new ApiError_api_util_1.default(400, "Assignment expired or not found");
    }
    const complaint = await complaintRepo.findComplaintById(complaintId);
    return new ApiSuccess_api_util_1.default(200, "Complaint assignment accepted", { complaint });
};
exports.acceptComplaintAssignment = acceptComplaintAssignment;
// Provider rejects complaint assignment
const rejectComplaintAssignment = async (complaintId, providerId) => {
    const providerAssignmentService = (await Promise.resolve().then(() => require("./providerAssignment.service"))).default;
    await providerAssignmentService.rejectAssignment(complaintId.toString(), providerId.toString());
    return new ApiSuccess_api_util_1.default(200, "Complaint assignment rejected", {
        message: "Finding alternative provider",
    });
};
exports.rejectComplaintAssignment = rejectComplaintAssignment;
const reopenComplaint = async (parentId, data, userId) => {
    const parentComplaint = await complaintRepo.findComplaintById(parentId);
    if (!parentComplaint)
        throw new ApiError_api_util_1.default(404, "Parent complaint not found");
    // Create new complaint with reference to parent
    const complaintData = {
        ...data,
        user: userId,
        parentId,
        stage: "ENTRANCE",
    };
    // Auto-assign provider
    const provider = await (0, providerAssign_util_1.getAutoAssignedProvider)();
    if (!provider)
        throw new ApiError_api_util_1.default(400, "No provider available");
    complaintData.provider = provider;
    const complaint = await complaintRepo.createComplaint(complaintData);
    // Emit events
    socket_service_1.default.emitComplaintCreated(userId.toString(), provider.toString(), complaint);
    return new ApiSuccess_api_util_1.default(201, "Complaint reopened successfully", { complaint });
};
exports.reopenComplaint = reopenComplaint;
// Generate entry QR code for customer (or provider for testing)
const generateEntryQr = async (complaintId, userId) => {
    const complaint = await complaintRepo.findComplaintById(complaintId);
    if (!complaint)
        throw new ApiError_api_util_1.default(404, "Complaint not found");
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
        throw new ApiError_api_util_1.default(403, "Unauthorized: You can only generate QR for your own complaints or complaints assigned to you");
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
    if (!updated)
        throw new ApiError_api_util_1.default(404, "Complaint not found");
    return new ApiSuccess_api_util_1.default(200, "QR code generated successfully", {
        token,
        expiresAt,
    });
};
exports.generateEntryQr = generateEntryQr;
// Validate entry QR code (provider scans customer's QR)
const validateEntryQr = async (complaintId, token, providerId) => {
    const complaint = await complaintRepo.findComplaintById(complaintId);
    if (!complaint)
        throw new ApiError_api_util_1.default(404, "Complaint not found");
    // Verify provider is assigned to this complaint
    const complaintProviderId = typeof complaint.provider === 'object' && complaint.provider?._id
        ? complaint.provider._id.toString()
        : complaint.provider?.toString() || null;
    if (complaintProviderId !== providerId.toString()) {
        throw new ApiError_api_util_1.default(403, "Unauthorized: You are not assigned to this complaint");
    }
    // Check if complaint is in ENTRANCE stage
    if (complaint.stage !== "ENTRANCE") {
        throw new ApiError_api_util_1.default(400, "QR validation can only be done for complaints in ENTRANCE stage");
    }
    // Check if token matches
    if (!complaint.entryQrToken || complaint.entryQrToken !== token) {
        throw new ApiError_api_util_1.default(400, "Invalid QR token");
    }
    // Check if token is expired
    if (!complaint.entryQrExpiresAt || new Date() > complaint.entryQrExpiresAt) {
        throw new ApiError_api_util_1.default(400, "QR code has expired. Please ask customer to generate a new one");
    }
    // Update stage to QR_VALIDATED
    const oldStage = complaint.stage;
    const updated = await complaintRepo.updateComplaint(complaintId, {
        stage: "QR_VALIDATED",
    });
    if (!updated)
        throw new ApiError_api_util_1.default(404, "Complaint not found");
    // Emit stage change event
    const userId = typeof updated.user === 'object' && updated.user?._id
        ? updated.user._id.toString()
        : updated.user?.toString() || "";
    const providerIdStr = typeof updated.provider === 'object' && updated.provider?._id
        ? updated.provider._id.toString()
        : updated.provider?.toString() || null;
    socket_service_1.default.emitStageChanged(userId, providerIdStr, updated, oldStage, "QR_VALIDATED");
    return new ApiSuccess_api_util_1.default(200, "QR code validated successfully", {
        complaint: updated,
    });
};
exports.validateEntryQr = validateEntryQr;
//# sourceMappingURL=complaint.service.js.map