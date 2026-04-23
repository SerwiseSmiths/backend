"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestEntranceScan = exports.validateEntryQr = exports.generateEntryQr = exports.rejectComplaintAssignment = exports.acceptComplaintAssignment = exports.listOpenProviderComplaints = exports.listProviderComplaints = exports.listMyComplaints = exports.reopenComplaint = exports.addPayment = exports.addDevice = exports.addQuote = exports.updateStage = exports.deleteComplaint = exports.updateComplaint = exports.listComplaints = exports.getComplaint = exports.createComplaint = void 0;
// controllers/complaint.controller.ts
const complaintService = require("../services/complaint.service");
const createComplaint = async (req, res, next) => {
    try {
        const userId = req.user.id; // from auth middleware
        const result = await complaintService.createComplaint(req.body, userId);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.createComplaint = createComplaint;
const getComplaint = async (req, res, next) => {
    try {
        const result = await complaintService.getComplaint(req.params.id);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.getComplaint = getComplaint;
const listComplaints = async (req, res, next) => {
    try {
        const result = await complaintService.listComplaints();
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.listComplaints = listComplaints;
const updateComplaint = async (req, res, next) => {
    try {
        const result = await complaintService.updateComplaint(req.params.id, req.body);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.updateComplaint = updateComplaint;
const deleteComplaint = async (req, res, next) => {
    try {
        const result = await complaintService.deleteComplaint(req.params.id);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.deleteComplaint = deleteComplaint;
const updateStage = async (req, res, next) => {
    try {
        const { stage, rejectionReason } = req.body;
        console.log(stage, rejectionReason);
        const result = await complaintService.updateStage(req.params.id, stage, rejectionReason);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.updateStage = updateStage;
const addQuote = async (req, res, next) => {
    try {
        const { quoteId } = req.body;
        const result = await complaintService.addQuote(req.params.id, quoteId);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.addQuote = addQuote;
const addDevice = async (req, res, next) => {
    try {
        const { deviceId } = req.body;
        const result = await complaintService.addDevice(req.params.id, deviceId);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.addDevice = addDevice;
const addPayment = async (req, res, next) => {
    try {
        const { paymentId } = req.body;
        const result = await complaintService.addPayment(req.params.id, paymentId);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.addPayment = addPayment;
const reopenComplaint = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const parentId = req.params.id;
        const result = await complaintService.reopenComplaint(parentId, req.body, userId);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.reopenComplaint = reopenComplaint;
const listMyComplaints = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await complaintService.listComplaintsByUser(userId);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.listMyComplaints = listMyComplaints;
const listProviderComplaints = async (req, res, next) => {
    try {
        const providerId = req.user.id;
        const result = await complaintService.listComplaintsByProvider(providerId);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.listProviderComplaints = listProviderComplaints;
const listOpenProviderComplaints = async (req, res, next) => {
    try {
        const providerId = req.user.id;
        const result = await complaintService.listOpenComplaintsByProvider(providerId);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.listOpenProviderComplaints = listOpenProviderComplaints;
// Provider accepts complaint assignment
const acceptComplaintAssignment = async (req, res, next) => {
    try {
        const providerId = req.user.id;
        const result = await complaintService.acceptComplaintAssignment(req.params.id, providerId);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.acceptComplaintAssignment = acceptComplaintAssignment;
// Provider rejects complaint assignment
const rejectComplaintAssignment = async (req, res, next) => {
    try {
        const providerId = req.user.id;
        const result = await complaintService.rejectComplaintAssignment(req.params.id, providerId);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.rejectComplaintAssignment = rejectComplaintAssignment;
// Generate entry QR code (customer only)
const generateEntryQr = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await complaintService.generateEntryQr(req.params.id, userId);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.generateEntryQr = generateEntryQr;
// Validate entry QR code (provider only)
const validateEntryQr = async (req, res, next) => {
    try {
        const providerId = req.user.id;
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({
                statusCode: 400,
                message: "Token is required",
            });
        }
        const result = await complaintService.validateEntryQr(req.params.id, token, providerId);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.validateEntryQr = validateEntryQr;
// Request entrance scan (provider only)
const requestEntranceScan = async (req, res, next) => {
    try {
        const providerId = req.user.id;
        const result = await complaintService.requestEntranceScan(req.params.id, providerId);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.requestEntranceScan = requestEntranceScan;
//# sourceMappingURL=complaint.contoller.js.map