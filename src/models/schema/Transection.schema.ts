import { Schema, model, Document } from "mongoose";

export interface ITransaction extends Document {
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentType: "subscription" | "regular";
  status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
  meta: any; // extra Cashfree payload
  createdAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    orderId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    paymentType: { type: String, enum: ["subscription", "regular"], required: true },
    status: { type: String, default: "PENDING" },
    meta: { type: Object },
  },
  { timestamps: true }
);

export default model<ITransaction>("Transaction", transactionSchema);
