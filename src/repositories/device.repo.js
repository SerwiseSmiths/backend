"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeleteDevice = exports.updateDeviceById = exports.retrieveAllDevices = exports.retrieveDevicesByUserId = exports.retrieveDeviceById = exports.createDevice = void 0;
const Device_schema_1 = require("../models/schema/Device.schema");
const strapi_service_1 = require("../services/strapi.service");
/**
 * Helper to populate deviceType from Strapi
 */
const populateDeviceTypeFromStrapi = async (device) => {
    if (!device)
        return device;
    // If it's an array, populate each device
    if (Array.isArray(device)) {
        return Promise.all(device.map(populateDeviceTypeFromStrapi));
    }
    // Convert to plain object if it's a Mongoose document
    const deviceObj = device.toObject ? device.toObject() : device;
    // Fetch deviceType from Strapi if deviceType is a string ID
    if (deviceObj.deviceType && typeof deviceObj.deviceType === 'string') {
        try {
            const deviceTypeData = await (0, strapi_service_1.fetchDeviceTypeById)(deviceObj.deviceType);
            deviceObj.deviceType = deviceTypeData || deviceObj.deviceType;
        }
        catch (error) {
            console.error('Error fetching deviceType from Strapi:', error);
            // Keep original deviceType ID if fetch fails
        }
    }
    return deviceObj;
};
const createDevice = async (data) => {
    const dev = new Device_schema_1.default(data);
    await dev.save();
    return dev;
};
exports.createDevice = createDevice;
const retrieveDeviceById = async (id, populateDeviceType = false) => {
    const device = await Device_schema_1.default.findById(id)
        .populate("user")
        .populate("address"); // <-- updated
    if (populateDeviceType && device) {
        return populateDeviceTypeFromStrapi(device);
    }
    return device;
};
exports.retrieveDeviceById = retrieveDeviceById;
const retrieveDevicesByUserId = async (userId, populateDeviceType = false) => {
    const devices = await Device_schema_1.default.find({ user: userId, isDeleted: false })
        .populate("address");
    if (populateDeviceType && devices.length > 0) {
        return populateDeviceTypeFromStrapi(devices);
    }
    return devices;
};
exports.retrieveDevicesByUserId = retrieveDevicesByUserId;
const retrieveAllDevices = async (populateDeviceType = false) => {
    const devices = await Device_schema_1.default.find({ isDeleted: false })
        .populate("user")
        .populate("address");
    // .sort({ createdAt: -1 });
    if (populateDeviceType && devices.length > 0) {
        return populateDeviceTypeFromStrapi(devices);
    }
    return devices;
};
exports.retrieveAllDevices = retrieveAllDevices;
const updateDeviceById = async (id, data, populateDeviceType = false) => {
    const device = await Device_schema_1.default.findByIdAndUpdate(id, data, { new: true })
        .populate("user")
        .populate("address"); // <-- updated
    if (populateDeviceType && device) {
        return populateDeviceTypeFromStrapi(device);
    }
    return device;
};
exports.updateDeviceById = updateDeviceById;
const softDeleteDevice = async (id) => {
    return Device_schema_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};
exports.softDeleteDevice = softDeleteDevice;
//# sourceMappingURL=device.repo.js.map