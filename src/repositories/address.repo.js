"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAddress = exports.updateAddress = exports.getAddressById = exports.getAddressesByUser = exports.createAddress = void 0;
const Address_scema_1 = require("../models/schema/Address.scema");
// import { mongodbId } from "../types/common";
const createAddress = async (data) => {
    const newAddress = new Address_scema_1.default(data);
    await newAddress.save();
    return newAddress;
};
exports.createAddress = createAddress;
const getAddressesByUser = async (userId) => {
    return Address_scema_1.default.find({ user: userId, is_deleted: false }).populate("user");
};
exports.getAddressesByUser = getAddressesByUser;
const getAddressById = async (id) => {
    return Address_scema_1.default.findOne({ _id: id, is_deleted: false });
};
exports.getAddressById = getAddressById;
const updateAddress = async (id, data) => {
    return Address_scema_1.default.findOneAndUpdate({ _id: id, is_deleted: false }, data, { new: true });
};
exports.updateAddress = updateAddress;
const deleteAddress = async (id) => {
    const result = await Address_scema_1.default.updateOne({ _id: id }, { is_deleted: true });
    return result.modifiedCount > 0;
};
exports.deleteAddress = deleteAddress;
//# sourceMappingURL=address.repo.js.map