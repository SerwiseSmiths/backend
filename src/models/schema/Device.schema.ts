import { Schema, model, Document } from "mongoose";
import { IDevice } from "../../types/device.type";

const DeviceSchema = new Schema<IDevice>(
  {
    name: { type: String, required: true, trim: true },

    deviceType: {
      type: String,  // Strapi CMS ID
      required: true,
    },

    description: { type: Schema.Types.Mixed, required: false, default: {} },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    address: {
      type: Schema.Types.ObjectId,
      ref: "Address", // <-- references Address collection
      required: true,
    },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<IDevice>("Device", DeviceSchema);
