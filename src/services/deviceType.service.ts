import ApiError from "../utils/api/ApiError.api.util";
import ApiSuccess from "../utils/api/ApiSuccess.api.util";
import {
  createDeviceType,
  getAllDeviceTypes,
  getDeviceTypeById,
  updateDeviceType,
  softDeleteDeviceType,
} from "../repositories/deviceType.repo";
import { deviceTypeValidationSchema } from "../models/validation/deviceType.validation";
import { serverQueryClient } from "../utils/serverQueryClient";

const DEVICE_TYPES_QUERY_KEY = ["device-types", "all"];

export const create = async (data: any) => {
  const { error, value } = deviceTypeValidationSchema.validate(data);
  if (error) {
    throw new ApiError(
      400,
      `Validation error: ${error.details.map((d) => d.message).join(", ")}`,
      error
    );
  }

  const newDT = await createDeviceType(value);

  // Invalidate cached list so subsequent reads get fresh data
  await serverQueryClient.invalidateQueries({ queryKey: DEVICE_TYPES_QUERY_KEY });

  return new ApiSuccess(201, "Device Type created", { deviceType: newDT });
};

export const retrieveAll = async () => {
  const list = await serverQueryClient.fetchQuery({
    queryKey: DEVICE_TYPES_QUERY_KEY,
    queryFn: () => getAllDeviceTypes(),
  });
  return new ApiSuccess(200, "Device Types retrieved", { deviceTypes: list });
};

export const retrieveById = async (id: string) => {
  const dt = await getDeviceTypeById(id);
  if (!dt) throw new ApiError(404, "Device Type not found");
  return new ApiSuccess(200, "Device Type retrieved", { deviceType: dt });
};

export const update = async (id: string, data: any) => {
  const dt = await getDeviceTypeById(id);
  if (!dt) throw new ApiError(404, "Device Type not found");

  const updated = await updateDeviceType(id, data);

  // Ensure cached list reflects updated entity
  await serverQueryClient.invalidateQueries({ queryKey: DEVICE_TYPES_QUERY_KEY });

  return new ApiSuccess(200, "Device Type updated", { deviceType: updated });
};

export const softDelete = async (id: string) => {
  const dt = await getDeviceTypeById(id);
  if (!dt) throw new ApiError(404, "Device Type not found");

  const deleted = await softDeleteDeviceType(id);

  // Remove deleted item from subsequent cached reads
  await serverQueryClient.invalidateQueries({ queryKey: DEVICE_TYPES_QUERY_KEY });

  return new ApiSuccess(200, "Device Type deleted", { deviceType: deleted });
};
