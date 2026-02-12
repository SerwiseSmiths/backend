import DeviceModel from "../models/schema/Device.schema";
import { IDevice as DeviceDocument } from "../types/device.type";
import { fetchDeviceTypeById } from "../services/strapi.service";


/**
 * Helper to populate deviceType from Strapi
 */
const populateDeviceTypeFromStrapi = async (device: any): Promise<any> => {
  if (!device) return device;

  // If it's an array, populate each device
  if (Array.isArray(device)) {
    return Promise.all(device.map(populateDeviceTypeFromStrapi));
  }

  // Convert to plain object if it's a Mongoose document
  const deviceObj = device.toObject ? device.toObject() : device;

  // Fetch deviceType from Strapi if deviceType is a string ID
  if (deviceObj.deviceType && typeof deviceObj.deviceType === 'string') {
    try {
      const deviceTypeData = await fetchDeviceTypeById(deviceObj.deviceType);
      deviceObj.deviceType = deviceTypeData || deviceObj.deviceType;
    } catch (error) {
      console.error('Error fetching deviceType from Strapi:', error);
      // Keep original deviceType ID if fetch fails
    }
  }

  return deviceObj;
};

export const createDevice = async (data: Partial<DeviceDocument>) => {
  const dev = new DeviceModel(data);
  await dev.save();
  return dev;
};

export const retrieveDeviceById = async (id: string, populateDeviceType = false) => {
  const device = await DeviceModel.findById(id)
    .populate("user")
    .populate("address");  // <-- updated

  if (populateDeviceType && device) {
    return populateDeviceTypeFromStrapi(device);
  }
  return device;
};

export const retrieveDevicesByUserId = async (userId: string, populateDeviceType = false) => {
  const devices = await DeviceModel.find({ user: userId, isDeleted: false });

  if (populateDeviceType && devices.length > 0) {
    return populateDeviceTypeFromStrapi(devices);
  }
  return devices;
}

export const retrieveAllDevices = async (populateDeviceType = false) => {
  const devices = await DeviceModel.find({ isDeleted: false })
    .populate("user");
  // .populate("address")
  // .sort({ createdAt: -1 });

  if (populateDeviceType && devices.length > 0) {
    return populateDeviceTypeFromStrapi(devices);
  }
  return devices;
};

export const updateDeviceById = async (id: string, data: Partial<DeviceDocument>, populateDeviceType = false) => {
  const device = await DeviceModel.findByIdAndUpdate(id, data, { new: true })
    .populate("user")
    .populate("address");  // <-- updated

  if (populateDeviceType && device) {
    return populateDeviceTypeFromStrapi(device);
  }
  return device;
};

export const softDeleteDevice = async (id: string) => {
  return DeviceModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};
