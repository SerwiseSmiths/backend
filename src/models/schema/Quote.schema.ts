import { Schema, model, Document } from "mongoose";
import { IService } from "./Service.schema";

export interface IQuote extends Document {
  items: IService[];
  total: number;
  isPaid: boolean;
}

const quoteSchema = new Schema<IQuote>({
  items: [{ type: Schema.Types.ObjectId, ref: "Service" }],
  total: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
});

export const QuoteModel = model<IQuote>("Quote", quoteSchema);
