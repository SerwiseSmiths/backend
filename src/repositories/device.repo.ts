import DeviceModel from "../models/schema/Device.schema";
import { IDevice as DeviceDocument } from "../types/device.type";

export const createDevice = async (data: Partial<DeviceDocument>) => {
  const dev = new DeviceModel(data);
  await dev.save();
  return dev;
};

export const retrieveDeviceById = async (id: string) => {
  return DeviceModel.findById(id)
    .populate("deviceType")
    .populate("user")
    .populate("address");  // <-- updated
};

export const retrieveAllDevices = async () => {
  return DeviceModel.find({ isDeleted: false })
    .populate("deviceType")
    .populate("user")
    // .populate("address")
    // .sort({ createdAt: -1 });
};

export const updateDeviceById = async (id: string, data: Partial<DeviceDocument>) => {
  return DeviceModel.findByIdAndUpdate(id, data, { new: true })
    .populate("deviceType")
    .populate("user")
    .populate("address");  // <-- updated
};

export const softDeleteDevice = async (id: string) => {
  return DeviceModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};
