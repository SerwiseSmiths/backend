import * as quoteRepo from "../repositories/quote.repo";
import { ServiceModel } from "../models/schema/Service.schema";
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
    const services = await ServiceModel.find({ _id: { $in: data.items } });

    if (services.length !== data.items.length) {
      throw new ApiError(404, "One or more service IDs are invalid");
    }

    updateData.total = services.reduce((sum, s) => sum + s.price, 0);
  }

  const quote = await quoteRepo.updateQuoteById(id, updateData);
  if (!quote) throw new ApiError(404, "Invalid quote id");

  return new ApiSuccess(200, "Quote updated successfully", { quote });
}

export async function deleteQuote(id: string) {
  const quote = await quoteRepo.deleteQuoteById(id);
  if (!quote) throw new ApiError(404, "Invalid quote id");

  return new ApiSuccess(200, "Quote deleted successfully");
}
