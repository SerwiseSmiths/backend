"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuote = exports.updateQuoteStatus = exports.updateQuote = exports.getQuoteById = exports.getAllQuotes = exports.createQuote = void 0;
const quoteService = require("../services/quote.service");
const createQuote = async (req, res, next) => {
    try {
        const result = await quoteService.createQuote(req.body);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.createQuote = createQuote;
const getAllQuotes = async (req, res, next) => {
    try {
        const result = await quoteService.getAllQuotes();
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.getAllQuotes = getAllQuotes;
const getQuoteById = async (req, res, next) => {
    try {
        const result = await quoteService.getQuoteById(req.params.id);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.getQuoteById = getQuoteById;
const updateQuote = async (req, res, next) => {
    try {
        const result = await quoteService.updateQuote(req.params.id, req.body);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.updateQuote = updateQuote;
const updateQuoteStatus = async (req, res, next) => {
    try {
        const { status, reason } = req.body;
        if (!status || !["PENDING", "APPROVED", "REJECTED"].includes(status)) {
            return res.status(400).json({ error: "Invalid status logic. Allowed values: PENDING, APPROVED, REJECTED" });
        }
        const result = await quoteService.updateQuoteStatus(req.params.id, status, reason);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.updateQuoteStatus = updateQuoteStatus;
const deleteQuote = async (req, res, next) => {
    try {
        const result = await quoteService.deleteQuote(req.params.id);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.deleteQuote = deleteQuote;
//# sourceMappingURL=quote.contoller.js.map