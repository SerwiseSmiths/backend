"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDevices = exports.deleteDevice = exports.updateDevice = exports.getDevices = exports.getDevice = exports.createDevice = void 0;
const deviceService = require("../services/device.service");
const createDevice = async (req, res, next) => {
    try {
        const result = await deviceService.create(req.body);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.createDevice = createDevice;
const getDevice = async (req, res, next) => {
    try {
        const result = await deviceService.retrieve(req.params.id);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.getDevice = getDevice;
const getDevices = async (req, res, next) => {
    try {
        const result = await deviceService.retrieveAll();
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.getDevices = getDevices;
const updateDevice = async (req, res, next) => {
    try {
        const result = await deviceService.update(req.params.id, req.body);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.updateDevice = updateDevice;
const deleteDevice = async (req, res, next) => {
    try {
        const result = await deviceService.softDelete(req.params.id);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.deleteDevice = deleteDevice;
const getUserDevices = async (req, res, next) => {
    try {
        const result = await deviceService.retrieveByUser(req.params.userId);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.getUserDevices = getUserDevices;
//# sourceMappingURL=device.controller.js.map