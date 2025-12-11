"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteService = exports.updateService = exports.getServiceById = exports.getAllServices = exports.createService = void 0;
const serviceService = require("../services/service.service");
const createService = async (req, res, next) => {
    try {
        const result = await serviceService.createService(req.body);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.createService = createService;
const getAllServices = async (req, res, next) => {
    try {
        const result = await serviceService.getAllServices();
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.getAllServices = getAllServices;
const getServiceById = async (req, res, next) => {
    try {
        const result = await serviceService.getServiceById(req.params.id);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.getServiceById = getServiceById;
const updateService = async (req, res, next) => {
    try {
        const result = await serviceService.updateService(req.params.id, req.body);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.updateService = updateService;
const deleteService = async (req, res, next) => {
    try {
        const result = await serviceService.deleteService(req.params.id);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.deleteService = deleteService;
//# sourceMappingURL=service.contoller.js.map