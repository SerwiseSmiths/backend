import DeviceTypeModel from "../models/schema/DeviceType.schema";
import { DeviceTypeDocument } from "../types/deviceType.type";

export const createDeviceType = async (data: Partial<DeviceTypeDocument>) => {
  const dt = new DeviceTypeModel(data);
  await dt.save();
  return dt;
};

export const getAllDeviceTypes = async () => {
  return DeviceTypeModel.find({ is_deleted: false }).sort({ createdAt: -1 });
};

export const getDeviceTypeById = async (id: string) => {
  return DeviceTypeModel.findById(id);
};

export const updateDeviceType = async (
  id: string,
  data: Partial<DeviceTypeDocument>
) => {
  return DeviceTypeModel.findByIdAndUpdate(id, data, { new: true });
};

export const softDeleteDeviceType = async (id: string) => {
  return DeviceTypeModel.findByIdAndUpdate(
    id,
    { is_deleted: true },
    { new: true }
  );
};
