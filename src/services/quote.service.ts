import * as quoteRepo from "../repositories/quote.repo";
import { ServiceModel } from "../models/schema/Service.schema";
import { ComplaintModel } from "../models/schema/Complaint.schema";
import * as complaintService from "./complaint.service";
import ApiSuccess from "../utils/api/ApiSuccess.api.util";
import ApiError from "../utils/api/ApiError.api.util";
import { quoteValidationSchema } from "../models/validation/quote.validation";
import { IQuote } from "../models/schema/Quote.schema";

export async function createQuote(data: Partial<IQuote>) {
  const { error, value } = quoteValidationSchema.validate(data);
  if (error) {
    throw new ApiError(
      400,
      "Validation Error: " + error.details.map(e => e.message).join(", ")
    );
  }

  // Items are Strapi part IDs (integers), not MongoDB Service IDs
  // Total is provided from frontend calculation
  const quote = await quoteRepo.createQuote({
    items: value.items || [],
    total: value.total,
  });

  return new ApiSuccess(201, "Quote created successfully", { quote });
}

export async function getAllQuotes() {
  const quotes = await quoteRepo.retrieveAllQuotes();
  return new ApiSuccess(200, "Quotes retrieved successfully", { quotes });
}

export async function getQuoteById(id: string) {
  const quote = await quoteRepo.retrieveQuoteById(id);
  if (!quote) throw new ApiError(404, "Invalid quote id");

  return new ApiSuccess(200, "Quote retrieved successfully", { quote });
}

export async function updateQuote(id: string, data: Partial<IQuote>) {
  let updateData = data;

  if (data.items) {
    if (data.total === undefined) {
      throw new ApiError(400, "Total must be provided when updating items");
    }
  }

  const quote = await quoteRepo.updateQuoteById(id, updateData);
  if (!quote) throw new ApiError(404, "Invalid quote id");

  return new ApiSuccess(200, "Quote updated successfully", { quote });
}

export async function updateQuoteStatus(id: string, status: "PENDING" | "APPROVED" | "REJECTED", reason?: string) {
  const quote = await quoteRepo.updateQuoteById(id, { status } as any);
  if (!quote) throw new ApiError(404, "Invalid quote id");

  // Sync with the associated complaint
  const complaint = await ComplaintModel.findOne({ quote: id });
  if (complaint) {
    if (status === "APPROVED") {
      const paymentCalcService = (await import("./paymentCalculation.service")).default;
      const totalPayment = await paymentCalcService.calculatePaymentAmount(complaint._id.toString());
      
      if (totalPayment === 0) {
        // Zero payment flow -> direct to completion!
        await complaintService.updateStage(complaint._id as any, "COMPLETED");
        await paymentCalcService.processPaymentCompletion(complaint._id.toString());
      } else {
        await complaintService.updateStage(complaint._id as any, "PAYMENT");
      }
    } else if (status === "REJECTED") {
      await complaintService.updateStage(complaint._id as any, "REJECTED", reason);
    }
  }

  return new ApiSuccess(200, "Quote status updated successfully", { quote, complaintId: complaint?._id });
}

export async function deleteQuote(id: string) {
  const quote = await quoteRepo.deleteQuoteById(id);
  if (!quote) throw new ApiError(404, "Invalid quote id");

  return new ApiSuccess(200, "Quote deleted successfully");
}
