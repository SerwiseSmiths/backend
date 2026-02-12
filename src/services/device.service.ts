import ApiError from "../utils/api/ApiError.api.util";
import ApiSuccess from "../utils/api/ApiSuccess.api.util";
import { deviceValidationSchema } from "../models/validation/device.validation";
import {
  createDevice,
  retrieveDeviceById,
  retrieveAllDevices,
  updateDeviceById,
  softDeleteDevice,
  retrieveDevicesByUserId
} from "../repositories/device.repo";

export const create = async (data: any) => {
  const { error, value } = deviceValidationSchema.validate(data);
  if (error) {
    throw new ApiError(
      400,
      `Validation Error: ${error.details.map((d) => d.message).join(", ")}`
    );
  }

  const dev = await createDevice(value);
  return new ApiSuccess(201, "Device created successfully", { device: dev });
};

export const retrieve = async (id: string) => {
  const dev = await retrieveDeviceById(id);
  if (!dev) throw new ApiError(404, "Device not found");

  return new ApiSuccess(200, "Device retrieved", { device: dev });
};

export const retrieveAll = async () => {
  console.log("Retrieving all devices");
  const list = await retrieveAllDevices();
  console.log(`Found ${list.length} devices`);
  return new ApiSuccess(200, "Devices retrieved", { devices: list });
};

export const update = async (id: string, data: any) => {
  const dev = await retrieveDeviceById(id);
  if (!dev) throw new ApiError(404, "Device not found");

  const updated = await updateDeviceById(id, data);
  return new ApiSuccess(200, "Device updated", { device: updated });
};

export const softDelete = async (id: string) => {
  const dev = await retrieveDeviceById(id);
  if (!dev) throw new ApiError(404, "Device not found");

  const deleted = await softDeleteDevice(id);
  return new ApiSuccess(200, "Device deleted", { device: deleted });
};

export const getDevicesByUser = async (userId: string) => {
  const devices = await retrieveDevicesByUserId(userId);
  return devices;
};

export const retrieveByUser = async (userId: string) => {
  const devices = await retrieveDevicesByUserId(userId);
  return new ApiSuccess(200, "User devices retrieved", { devices });
};