"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuote = exports.updateQuote = exports.getQuoteById = exports.getAllQuotes = exports.createQuote = void 0;
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