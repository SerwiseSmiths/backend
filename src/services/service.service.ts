import * as serviceRepo from "../repositories/service.repo";
import ApiError from "../utils/api/ApiError.api.util";
import ApiSuccess from "../utils/api/ApiSuccess.api.util";
import { serviceValidationSchema } from "../models/validation/service.validation";
import { IService } from "../models/schema/Service.schema";
import { serverQueryClient } from "../utils/serverQueryClient";

const SERVICES_QUERY_KEY = ["services", "all"];

export async function createService(data: Partial<IService>) {
  const { error, value } = serviceValidationSchema.validate(data);
  if (error) {
    throw new ApiError(
      400,
      "Validation Error: " + error.details.map(e => e.message).join(", ")
    );
  }

  const service = await serviceRepo.createService(value);

  // Invalidate cached services list after mutation
  await serverQueryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEY });

  return new ApiSuccess(201, "Service created successfully", { service });
}

export async function getAllServices() {
  const services = await serverQueryClient.fetchQuery({
    queryKey: SERVICES_QUERY_KEY,
    queryFn: () => serviceRepo.retrieveAllServices(),
  });
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

  // Invalidate cached services list after mutation
  await serverQueryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEY });

  return new ApiSuccess(200, "Service updated successfully", { service });
}

export async function deleteService(id: string) {
  const service = await serviceRepo.deleteServiceById(id);

  if (!service) throw new ApiError(404, "Invalid service id");

  // Invalidate cached services list so deletions are reflected
  await serverQueryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEY });

  return new ApiSuccess(200, "Service deleted successfully");
}
