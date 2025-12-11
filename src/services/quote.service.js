"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuote = createQuote;
exports.getAllQuotes = getAllQuotes;
exports.getQuoteById = getQuoteById;
exports.updateQuote = updateQuote;
exports.deleteQuote = deleteQuote;
const quoteRepo = require("../repositories/quote.repo");
const Service_schema_1 = require("../models/schema/Service.schema");
const ApiSuccess_api_util_1 = require("../utils/api/ApiSuccess.api.util");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
const quote_validation_1 = require("../models/validation/quote.validation");
async function createQuote(data) {
    const { error, value } = quote_validation_1.quoteValidationSchema.validate(data);
    if (error) {
        throw new ApiError_api_util_1.default(400, "Validation Error: " + error.details.map(e => e.message).join(", "));
    }
    // Fetch service prices to calculate total
    const services = await Service_schema_1.ServiceModel.find({ _id: { $in: value.items } });
    if (services.length !== value.items.length) {
        throw new ApiError_api_util_1.default(404, "One or more service IDs are invalid");
    }
    const total = services.reduce((sum, s) => sum + s.price, 0);
    const quote = await quoteRepo.createQuote({
        ...value,
        total,
    });
    return new ApiSuccess_api_util_1.default(201, "Quote created successfully", { quote });
}
async function getAllQuotes() {
    const quotes = await quoteRepo.retrieveAllQuotes();
    return new ApiSuccess_api_util_1.default(200, "Quotes retrieved successfully", { quotes });
}
async function getQuoteById(id) {
    const quote = await quoteRepo.retrieveQuoteById(id);
    if (!quote)
        throw new ApiError_api_util_1.default(404, "Invalid quote id");
    return new ApiSuccess_api_util_1.default(200, "Quote retrieved successfully", { quote });
}
async function updateQuote(id, data) {
    let updateData = data;
    if (data.items) {
        const services = await Service_schema_1.ServiceModel.find({ _id: { $in: data.items } });
        if (services.length !== data.items.length) {
            throw new ApiError_api_util_1.default(404, "One or more service IDs are invalid");
        }
        updateData.total = services.reduce((sum, s) => sum + s.price, 0);
    }
    const quote = await quoteRepo.updateQuoteById(id, updateData);
    if (!quote)
        throw new ApiError_api_util_1.default(404, "Invalid quote id");
    return new ApiSuccess_api_util_1.default(200, "Quote updated successfully", { quote });
}
async function deleteQuote(id) {
    const quote = await quoteRepo.deleteQuoteById(id);
    if (!quote)
        throw new ApiError_api_util_1.default(404, "Invalid quote id");
    return new ApiSuccess_api_util_1.default(200, "Quote deleted successfully");
}
//# sourceMappingURL=quote.service.js.map