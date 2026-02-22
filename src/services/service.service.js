"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createService = createService;
exports.getAllServices = getAllServices;
exports.getServiceById = getServiceById;
exports.updateService = updateService;
exports.deleteService = deleteService;
const serviceRepo = require("../repositories/service.repo");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
const ApiSuccess_api_util_1 = require("../utils/api/ApiSuccess.api.util");
const service_validation_1 = require("../models/validation/service.validation");
async function createService(data) {
    const { error, value } = service_validation_1.serviceValidationSchema.validate(data);
    if (error) {
        throw new ApiError_api_util_1.default(400, "Validation Error: " + error.details.map(e => e.message).join(", "));
    }
    const service = await serviceRepo.createService(value);
    return new ApiSuccess_api_util_1.default(201, "Service created successfully", { service });
}
async function getAllServices() {
    const services = await serviceRepo.retrieveAllServices();
    return new ApiSuccess_api_util_1.default(200, "Services retrieved successfully", { services });
}
async function getServiceById(id) {
    const service = await serviceRepo.retrieveServiceById(id);
    if (!service)
        throw new ApiError_api_util_1.default(404, "Invalid service id");
    return new ApiSuccess_api_util_1.default(200, "Service retrieved successfully", { service });
}
async function updateService(id, data) {
    const service = await serviceRepo.updateServiceById(id, data);
    if (!service)
        throw new ApiError_api_util_1.default(404, "Invalid service id");
    return new ApiSuccess_api_util_1.default(200, "Service updated successfully", { service });
}
async function deleteService(id) {
    const service = await serviceRepo.deleteServiceById(id);
    if (!service)
        throw new ApiError_api_util_1.default(404, "Invalid service id");
    return new ApiSuccess_api_util_1.default(200, "Service deleted successfully");
}
//# sourceMappingURL=service.service.js.map