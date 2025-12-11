"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeleteDeviceType = exports.updateDeviceType = exports.getDeviceTypeById = exports.getAllDeviceTypes = exports.createDeviceType = void 0;
const DeviceType_schema_1 = require("../models/schema/DeviceType.schema");
const createDeviceType = async (data) => {
    const dt = new DeviceType_schema_1.default(data);
    await dt.save();
    return dt;
};
exports.createDeviceType = createDeviceType;
const getAllDeviceTypes = async () => {
    return DeviceType_schema_1.default.find({ is_deleted: false }).sort({ createdAt: -1 });
};
exports.getAllDeviceTypes = getAllDeviceTypes;
const getDeviceTypeById = async (id) => {
    return DeviceType_schema_1.default.findById(id);
};
exports.getDeviceTypeById = getDeviceTypeById;
const updateDeviceType = async (id, data) => {
    return DeviceType_schema_1.default.findByIdAndUpdate(id, data, { new: true });
};
exports.updateDeviceType = updateDeviceType;
const softDeleteDeviceType = async (id) => {
    return DeviceType_schema_1.default.findByIdAndUpdate(id, { is_deleted: true }, { new: true });
};
exports.softDeleteDeviceType = softDeleteDeviceType;
//# sourceMappingURL=deviceType.repo.js.map