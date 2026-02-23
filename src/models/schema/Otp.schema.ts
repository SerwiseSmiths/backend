import { Schema, model, Document, Model } from "mongoose";

export interface IOtp extends Document {
  phoneNo: string;
  otp: string;
  expiresAt: Date;
  consumed: boolean;
  attempts: number;
}

const OtpSchema = new Schema<IOtp>(
  {
    phoneNo: { type: String, required: true, index: true, trim: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    consumed: { type: Boolean, default: false },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

OtpSchema.index({ phoneNo: 1, consumed: 1, expiresAt: 1 });

const OtpModel: Model<IOtp> = model<IOtp>("Otp", OtpSchema);

export default OtpModel;

