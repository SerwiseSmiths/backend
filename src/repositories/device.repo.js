"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeleteDevice = exports.updateDeviceById = exports.retrieveAllDevices = exports.retrieveDeviceById = exports.createDevice = void 0;
const Device_schema_1 = require("../models/schema/Device.schema");
const createDevice = async (data) => {
    const dev = new Device_schema_1.default(data);
    await dev.save();
    return dev;
};
exports.createDevice = createDevice;
const retrieveDeviceById = async (id) => {
    return Device_schema_1.default.findById(id)
        .populate("deviceType")
        .populate("user")
        .populate("address"); // <-- updated
};
exports.retrieveDeviceById = retrieveDeviceById;
const retrieveAllDevices = async () => {
    return Device_schema_1.default.find({ isDeleted: false })
        .populate("deviceType")
        .populate("user");
    // .populate("address")
    // .sort({ createdAt: -1 });
};
exports.retrieveAllDevices = retrieveAllDevices;
const updateDeviceById = async (id, data) => {
    return Device_schema_1.default.findByIdAndUpdate(id, data, { new: true })
        .populate("deviceType")
        .populate("user")
        .populate("address"); // <-- updated
};
exports.updateDeviceById = updateDeviceById;
const softDeleteDevice = async (id) => {
    return Device_schema_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};
exports.softDeleteDevice = softDeleteDevice;
//# sourceMappingURL=device.repo.js.map