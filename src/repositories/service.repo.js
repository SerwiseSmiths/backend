"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteServiceById = exports.updateServiceById = exports.retrieveServiceById = exports.retrieveAllServices = exports.createService = void 0;
const Service_schema_1 = require("../models/schema/Service.schema");
const createService = async (data) => {
    const service = new Service_schema_1.ServiceModel(data);
    await service.save();
    return service;
};
exports.createService = createService;
const retrieveAllServices = async () => {
    return await Service_schema_1.ServiceModel.find();
};
exports.retrieveAllServices = retrieveAllServices;
const retrieveServiceById = async (id) => {
    return await Service_schema_1.ServiceModel.findById(id);
};
exports.retrieveServiceById = retrieveServiceById;
const updateServiceById = async (id, data) => {
    return await Service_schema_1.ServiceModel.findByIdAndUpdate(id, data, { new: true });
};
exports.updateServiceById = updateServiceById;
const deleteServiceById = async (id) => {
    return await Service_schema_1.ServiceModel.findByIdAndDelete(id);
};
exports.deleteServiceById = deleteServiceById;
//# sourceMappingURL=service.repo.js.map