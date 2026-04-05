import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWaitlist {
  phoneNo: string;
  countryCode: string;
  joinedAt: Date;
  notifiedViaTruecaller: boolean;
  truecallerNotifiedAt?: Date;
  source?: string; // e.g. "website"
}

export interface WaitlistDocument extends IWaitlist, Document {}

const WaitlistSchema = new Schema<WaitlistDocument>(
  {
    phoneNo: { type: String, required: true, unique: true, trim: true },
    countryCode: { type: String, required: true, default: "+91" },
    joinedAt: { type: Date, default: Date.now },
    notifiedViaTruecaller: { type: Boolean, default: false },
    truecallerNotifiedAt: { type: Date },
    source: { type: String, default: "website" },
  },
  { timestamps: true }
);

const WaitlistModel: Model<WaitlistDocument> = mongoose.model<WaitlistDocument>(
  "Waitlist",
  WaitlistSchema
);

export default WaitlistModel;
