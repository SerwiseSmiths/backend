import { QuoteModel } from "../models/schema/Quote.schema";
import { IQuote } from "../models/schema/Quote.schema";

export const createQuote = async (
  data: Partial<IQuote>
): Promise<IQuote | null> => {
  const quote = new QuoteModel(data);
  await quote.save();
  return quote;
};

export const retrieveAllQuotes = async (): Promise<IQuote[]> => {
  return QuoteModel.find().populate("items");
};

export const retrieveQuoteById = async (
  id: string
): Promise<IQuote | null> => {
  return QuoteModel.findById(id).populate("items");
};

export const updateQuoteById = async (
  id: string,
  data: Partial<IQuote>
): Promise<IQuote | null> => {
  return QuoteModel.findByIdAndUpdate(id, data, { new: true }).populate(
    "items"
  );
};

export const deleteQuoteById = async (
  id: string
): Promise<IQuote | null> => {
  return QuoteModel.findByIdAndDelete(id);
};
