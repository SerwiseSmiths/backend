"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDelete = exports.update = exports.retrieveById = exports.retrieveAll = exports.create = void 0;
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
const ApiSuccess_api_util_1 = require("../utils/api/ApiSuccess.api.util");
const deviceType_repo_1 = require("../repositories/deviceType.repo");
const deviceType_validation_1 = require("../models/validation/deviceType.validation");
const create = async (data) => {
    const { error, value } = deviceType_validation_1.deviceTypeValidationSchema.validate(data);
    if (error) {
        throw new ApiError_api_util_1.default(400, `Validation error: ${error.details.map((d) => d.message).join(", ")}`, error);
    }
    const newDT = await (0, deviceType_repo_1.createDeviceType)(value);
    return new ApiSuccess_api_util_1.default(201, "Device Type created", { deviceType: newDT });
};
exports.create = create;
const retrieveAll = async () => {
    const list = await (0, deviceType_repo_1.getAllDeviceTypes)();
    return new ApiSuccess_api_util_1.default(200, "Device Types retrieved", { deviceTypes: list });
};
exports.retrieveAll = retrieveAll;
const retrieveById = async (id) => {
    const dt = await (0, deviceType_repo_1.getDeviceTypeById)(id);
    if (!dt)
        throw new ApiError_api_util_1.default(404, "Device Type not found");
    return new ApiSuccess_api_util_1.default(200, "Device Type retrieved", { deviceType: dt });
};
exports.retrieveById = retrieveById;
const update = async (id, data) => {
    const dt = await (0, deviceType_repo_1.getDeviceTypeById)(id);
    if (!dt)
        throw new ApiError_api_util_1.default(404, "Device Type not found");
    const updated = await (0, deviceType_repo_1.updateDeviceType)(id, data);
    return new ApiSuccess_api_util_1.default(200, "Device Type updated", { deviceType: updated });
};
exports.update = update;
const softDelete = async (id) => {
    const dt = await (0, deviceType_repo_1.getDeviceTypeById)(id);
    if (!dt)
        throw new ApiError_api_util_1.default(404, "Device Type not found");
    const deleted = await (0, deviceType_repo_1.softDeleteDeviceType)(id);
    return new ApiSuccess_api_util_1.default(200, "Device Type deleted", { deviceType: deleted });
};
exports.softDelete = softDelete;
//# sourceMappingURL=deviceType.service.js.map