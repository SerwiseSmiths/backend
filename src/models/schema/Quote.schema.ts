import { Schema, model, Document } from "mongoose";

export interface IQuote extends Document {
  items: number[]; // Strapi part IDs
  total: number;
  isPaid: boolean;
}

const quoteSchema = new Schema<IQuote>({
  items: [{ type: Number }], // Strapi part IDs (integers)
  total: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
});

export const QuoteModel = model<IQuote>("Quote", quoteSchema);
