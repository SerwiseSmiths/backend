"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAddress = createAddress;
exports.getUserAddresses = getUserAddresses;
exports.getAddress = getAddress;
exports.updateAddress = updateAddress;
exports.deleteAddress = deleteAddress;
const addressRepo = require("../repositories/address.repo");
const address_validation_1 = require("../models/validation/address.validation");
const ApiSuccess_api_util_1 = require("../utils/api/ApiSuccess.api.util");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
async function createAddress(_data) {
    const { error, value } = address_validation_1.addressValidationSchema.validate(_data);
    if (error) {
        console.log(error);
        throw new ApiError_api_util_1.default(400, `Validation Error: ${error.details.map((d) => d.message).join(", ")}`);
    }
    const address = await addressRepo.createAddress(value);
    console.log(address);
    return new ApiSuccess_api_util_1.default(201, "Address created successfully", {
        address,
    });
}
async function getUserAddresses(userId) {
    const addresses = await addressRepo.getAddressesByUser(userId);
    return new ApiSuccess_api_util_1.default(200, "Addresses retrieved", { addresses });
}
async function getAddress(id) {
    const address = await addressRepo.getAddressById(id);
    if (!address)
        throw new ApiError_api_util_1.default(404, "Address not found");
    return new ApiSuccess_api_util_1.default(200, "Address retrieved", { address });
}
async function updateAddress(id, data) {
    const address = await addressRepo.updateAddress(id, data);
    if (!address)
        throw new ApiError_api_util_1.default(404, "Address not found");
    return new ApiSuccess_api_util_1.default(200, "Address updated successfully", { address });
}
async function deleteAddress(id) {
    const deleted = await addressRepo.deleteAddress(id);
    if (!deleted)
        throw new ApiError_api_util_1.default(404, "Address not found");
    return new ApiSuccess_api_util_1.default(200, "Address deleted successfully");
}
//# sourceMappingURL=address.service.js.map