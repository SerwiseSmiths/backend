import { Schema, model, Document } from "mongoose";
import { IComplaint } from "../../types/comlpaint.type";



const complaintSchema = new Schema<IComplaint>({
  title: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  provider:{ type: Schema.Types.ObjectId, ref: "User", required: true },
  address: { type: Schema.Types.ObjectId, ref: "Address", required: true },

  stage: {
    type: String,
    enum: ["Entrance" , "Estimation" ,  "Approval" , "Payment"],
    default: "Entrance",
  },

  parent: { type: Schema.Types.ObjectId, ref: "Complaint", default: null },
  quote: { type: Schema.Types.ObjectId, ref: "Quote", default: null },
  device: { type: Schema.Types.ObjectId, ref: "Device", default: null },
});

export const ComplaintModel = model<IComplaint>("Complaint", complaintSchema);
