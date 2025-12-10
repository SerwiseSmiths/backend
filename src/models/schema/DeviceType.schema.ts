import { Schema, model, Document } from "mongoose";
import { DeviceTypeDocument } from "../../types/deviceType.type";

const DeviceTypeSchema = new Schema<DeviceTypeDocument>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const DeviceTypeModel = model<DeviceTypeDocument>(
  "DeviceType",
  DeviceTypeSchema
);

export default DeviceTypeModel;
