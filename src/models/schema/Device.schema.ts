import { Schema, model, Document } from "mongoose";
import { DeviceDocument } from "../../types/device.type";

const DeviceSchema = new Schema<DeviceDocument>(
  {
    name: { type: String, required: true, trim: true },

    deviceType: {
      type: Schema.Types.ObjectId,
      ref: "deviceType",
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

export default model<DeviceDocument>("device", DeviceSchema);
