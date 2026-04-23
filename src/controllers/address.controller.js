"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAddress = exports.updateAddress = exports.getAddress = exports.getUserAddresses = exports.createAddress = void 0;
const addressService = require("../services/address.service");
const createAddress = async (req, res, next) => {
    try {
        req.body.user = req.user.id;
        console.log(req.body);
        const result = await addressService.createAddress(req.body);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.createAddress = createAddress;
const getUserAddresses = async (req, res, next) => {
    try {
        const result = await addressService.getUserAddresses(req.user.id);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.getUserAddresses = getUserAddresses;
const getAddress = async (req, res, next) => {
    try {
        const result = await addressService.getAddress(req.params.id);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.getAddress = getAddress;
const updateAddress = async (req, res, next) => {
    try {
        const result = await addressService.updateAddress(req.params.id, req.body);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.updateAddress = updateAddress;
const deleteAddress = async (req, res, next) => {
    try {
        const result = await addressService.deleteAddress(req.params.id);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.deleteAddress = deleteAddress;
//# sourceMappingURL=address.controller.js.map