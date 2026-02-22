"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveByUser = exports.getDevicesByUser = exports.softDelete = exports.update = exports.retrieveAll = exports.retrieve = exports.create = void 0;
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
const ApiSuccess_api_util_1 = require("../utils/api/ApiSuccess.api.util");
const device_validation_1 = require("../models/validation/device.validation");
const device_repo_1 = require("../repositories/device.repo");
const create = async (data) => {
    const { error, value } = device_validation_1.deviceValidationSchema.validate(data);
    if (error) {
        throw new ApiError_api_util_1.default(400, `Validation Error: ${error.details.map((d) => d.message).join(", ")}`);
    }
    const dev = await (0, device_repo_1.createDevice)(value);
    return new ApiSuccess_api_util_1.default(201, "Device created successfully", { device: dev });
};
exports.create = create;
const retrieve = async (id) => {
    const dev = await (0, device_repo_1.retrieveDeviceById)(id);
    if (!dev)
        throw new ApiError_api_util_1.default(404, "Device not found");
    return new ApiSuccess_api_util_1.default(200, "Device retrieved", { device: dev });
};
exports.retrieve = retrieve;
const retrieveAll = async () => {
    console.log("Retrieving all devices");
    const list = await (0, device_repo_1.retrieveAllDevices)();
    console.log(`Found ${list.length} devices`);
    return new ApiSuccess_api_util_1.default(200, "Devices retrieved", { devices: list });
};
exports.retrieveAll = retrieveAll;
const update = async (id, data) => {
    const dev = await (0, device_repo_1.retrieveDeviceById)(id);
    if (!dev)
        throw new ApiError_api_util_1.default(404, "Device not found");
    const updated = await (0, device_repo_1.updateDeviceById)(id, data);
    return new ApiSuccess_api_util_1.default(200, "Device updated", { device: updated });
};
exports.update = update;
const softDelete = async (id) => {
    const dev = await (0, device_repo_1.retrieveDeviceById)(id);
    if (!dev)
        throw new ApiError_api_util_1.default(404, "Device not found");
    const deleted = await (0, device_repo_1.softDeleteDevice)(id);
    return new ApiSuccess_api_util_1.default(200, "Device deleted", { device: deleted });
};
exports.softDelete = softDelete;
const getDevicesByUser = async (userId) => {
    const devices = await (0, device_repo_1.retrieveDevicesByUserId)(userId);
    return devices;
};
exports.getDevicesByUser = getDevicesByUser;
const retrieveByUser = async (userId) => {
    const devices = await (0, device_repo_1.retrieveDevicesByUserId)(userId);
    return new ApiSuccess_api_util_1.default(200, "User devices retrieved", { devices });
};
exports.retrieveByUser = retrieveByUser;
//# sourceMappingURL=device.service.js.map