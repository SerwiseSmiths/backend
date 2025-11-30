import { Schema, model, Document } from "mongoose";
import { IQuote } from "./Quote.schema";

export interface IComplaint extends Document {
  title: string;
  user: string;       
  provider: string;   
  address: string;
  stage: "Enquiry" | "Estimation" | "Payment";
  parent: IComplaint | null;
  quote: IQuote | null;
  device: string | null;
}

const complaintSchema = new Schema<IComplaint>({
  title: { type: String, required: true },
  user: { type: String, required: true },
  provider: { type: String },
  address: { type: String, required: true },

  stage: {
    type: String,
    enum: ["Enquiry", "Estimation", "Payment"],
    default: "Enquiry",
  },

  parent: { type: Schema.Types.ObjectId, ref: "Complaint", default: null },
  quote: { type: Schema.Types.ObjectId, ref: "Quote", default: null },
  device: { type: String, default: null },
});

export const ComplaintModel = model<IComplaint>("Complaint", complaintSchema);
