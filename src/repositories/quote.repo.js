"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuoteById = exports.updateQuoteById = exports.retrieveQuoteById = exports.retrieveAllQuotes = exports.createQuote = void 0;
const Quote_schema_1 = require("../models/schema/Quote.schema");
const createQuote = async (data) => {
    const quote = new Quote_schema_1.QuoteModel(data);
    await quote.save();
    return quote;
};
exports.createQuote = createQuote;
const retrieveAllQuotes = async () => {
    return Quote_schema_1.QuoteModel.find().populate("items");
};
exports.retrieveAllQuotes = retrieveAllQuotes;
const retrieveQuoteById = async (id) => {
    return Quote_schema_1.QuoteModel.findById(id).populate("items");
};
exports.retrieveQuoteById = retrieveQuoteById;
const updateQuoteById = async (id, data) => {
    return Quote_schema_1.QuoteModel.findByIdAndUpdate(id, data, { new: true }).populate("items");
};
exports.updateQuoteById = updateQuoteById;
const deleteQuoteById = async (id) => {
    return Quote_schema_1.QuoteModel.findByIdAndDelete(id);
};
exports.deleteQuoteById = deleteQuoteById;
//# sourceMappingURL=quote.repo.js.map