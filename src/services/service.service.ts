import * as serviceRepo from "../repositories/service.repo";
import ApiError from "../utils/api/ApiError.api.util";
import ApiSuccess from "../utils/api/ApiSuccess.api.util";
import { serviceValidationSchema } from "../models/validation/service.validation";
import { IService } from "../models/schema/Service.schema";

export async function createService(
  data: Partial<IService>
) {
  const { error, value } = serviceValidationSchema.validate(data);
  if (error) {
    throw new ApiError(
      400,
      "Validation Error: " + error.details.map(e => e.message).join(", ")
    );
  }

  const service = await serviceRepo.createService(value);

  return new ApiSuccess(201, "Service created successfully", { service });
}

export async function getAllServices() {
  const services = await serviceRepo.retrieveAllServices();
  return new ApiSuccess(200, "Services retrieved successfully", { services });
}

export async function getServiceById(id: string) {
  const service = await serviceRepo.retrieveServiceById(id);

  if (!service) throw new ApiError(404, "Invalid service id");

  return new ApiSuccess(200, "Service retrieved successfully", { service });
}

export async function updateService(
  id: string,
  data: Partial<IService>
) {
  const service = await serviceRepo.updateServiceById(id, data);

  if (!service) throw new ApiError(404, "Invalid service id");

  return new ApiSuccess(200, "Service updated successfully", { service });
}

export async function deleteService(id: string) {
  const service = await serviceRepo.deleteServiceById(id);

  if (!service) throw new ApiError(404, "Invalid service id");

  return new ApiSuccess(200, "Service deleted successfully");
}
