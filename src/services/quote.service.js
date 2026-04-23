"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuote = createQuote;
exports.getAllQuotes = getAllQuotes;
exports.getQuoteById = getQuoteById;
exports.updateQuote = updateQuote;
exports.updateQuoteStatus = updateQuoteStatus;
exports.deleteQuote = deleteQuote;
const quoteRepo = require("../repositories/quote.repo");
const Complaint_schema_1 = require("../models/schema/Complaint.schema");
const complaintService = require("./complaint.service");
const ApiSuccess_api_util_1 = require("../utils/api/ApiSuccess.api.util");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
const quote_validation_1 = require("../models/validation/quote.validation");
async function createQuote(data) {
    const { error, value } = quote_validation_1.quoteValidationSchema.validate(data);
    if (error) {
        throw new ApiError_api_util_1.default(400, "Validation Error: " + error.details.map(e => e.message).join(", "));
    }
    // Items are Strapi part IDs (integers), not MongoDB Service IDs
    // Total is provided from frontend calculation
    const quote = await quoteRepo.createQuote({
        items: value.items || [],
        total: value.total,
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
        if (data.total === undefined) {
            throw new ApiError_api_util_1.default(400, "Total must be provided when updating items");
        }
    }
    const quote = await quoteRepo.updateQuoteById(id, updateData);
    if (!quote)
        throw new ApiError_api_util_1.default(404, "Invalid quote id");
    return new ApiSuccess_api_util_1.default(200, "Quote updated successfully", { quote });
}
async function updateQuoteStatus(id, status, reason) {
    const quote = await quoteRepo.updateQuoteById(id, { status });
    if (!quote)
        throw new ApiError_api_util_1.default(404, "Invalid quote id");
    // Sync with the associated complaint
    const complaint = await Complaint_schema_1.ComplaintModel.findOne({ quote: id });
    if (complaint) {
        if (status === "APPROVED") {
            const paymentCalcService = (await Promise.resolve().then(() => require("./paymentCalculation.service"))).default;
            const totalPayment = await paymentCalcService.calculatePaymentAmount(complaint._id.toString());
            if (totalPayment === 0) {
                // Zero payment flow -> direct to completion!
                await complaintService.updateStage(complaint._id, "COMPLETED");
                await paymentCalcService.processPaymentCompletion(complaint._id.toString());
            }
            else {
                await complaintService.updateStage(complaint._id, "PAYMENT");
            }
        }
        else if (status === "REJECTED") {
            await complaintService.updateStage(complaint._id, "REJECTED", reason);
        }
    }
    return new ApiSuccess_api_util_1.default(200, "Quote status updated successfully", { quote, complaintId: complaint?._id });
}
async function deleteQuote(id) {
    const quote = await quoteRepo.deleteQuoteById(id);
    if (!quote)
        throw new ApiError_api_util_1.default(404, "Invalid quote id");
    return new ApiSuccess_api_util_1.default(200, "Quote deleted successfully");
}
//# sourceMappingURL=quote.service.js.map