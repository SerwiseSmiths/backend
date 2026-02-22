"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDeviceType = exports.updateDeviceType = exports.getDeviceType = exports.getDeviceTypes = exports.createDeviceType = void 0;
const deviceTypeService = require("../services/deviceType.service");
const createDeviceType = async (req, res, next) => {
    try {
        const result = await deviceTypeService.create(req.body);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.createDeviceType = createDeviceType;
const getDeviceTypes = async (req, res, next) => {
    try {
        const result = await deviceTypeService.retrieveAll();
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.getDeviceTypes = getDeviceTypes;
const getDeviceType = async (req, res, next) => {
    try {
        const result = await deviceTypeService.retrieveById(req.params.id);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.getDeviceType = getDeviceType;
const updateDeviceType = async (req, res, next) => {
    try {
        const result = await deviceTypeService.update(req.params.id, req.body);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.updateDeviceType = updateDeviceType;
const deleteDeviceType = async (req, res, next) => {
    try {
        const result = await deviceTypeService.softDelete(req.params.id);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.deleteDeviceType = deleteDeviceType;
//# sourceMappingURL=deviceType.contoller.js.map