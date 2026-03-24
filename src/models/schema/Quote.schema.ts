import { Schema, model, Document } from "mongoose";

export interface IQuote extends Document {
  items: (number | string)[]; // Strapi part IDs (can be string or number)
  total: number;
  isPaid: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

const quoteSchema = new Schema<IQuote>({
  items: [{ type: Schema.Types.Mixed }], // Strapi part IDs (can be string or number)
  total: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
});

export const QuoteModel = model<IQuote>("Quote", quoteSchema);
