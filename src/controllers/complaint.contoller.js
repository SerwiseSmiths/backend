"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addQuote = exports.updateStage = exports.deleteComplaint = exports.updateComplaint = exports.listComplaints = exports.getComplaint = exports.createComplaint = void 0;
// controllers/complaint.controller.ts
const complaintService = require("../services/complaint.service");
const createComplaint = async (req, res, next) => {
    try {
        const userId = req.user._id; // from auth middleware
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
        const { stage } = req.body;
        const result = await complaintService.updateStage(req.params.id, stage);
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
//# sourceMappingURL=complaint.contoller.js.map