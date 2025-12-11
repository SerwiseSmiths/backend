"use strict";
/**
 * @file user.services.ts
 * @description Business logic for user-related operations
 * @module services/user.services
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.retirveUserById = retirveUserById;
exports.retriveUserByRefCode = retriveUserByRefCode;
exports.retrieveAllUsers = retrieveAllUsers;
const user_validation_1 = require("../models/validation/user.validation");
const userRepo = require("../repositories/user.repo");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
const ApiSuccess_api_util_1 = require("../utils/api/ApiSuccess.api.util");
/**
 * Registers a new user.
 * @param _data - User data object
 * @returns The newly created user
 * @throws Error if user already exists
 */
async function registerUser(_data) {
    //validate user data
    const { error, value } = user_validation_1.userValidationSchema.validate(_data);
    if (error) {
        throw new ApiError_api_util_1.default(400, `Validation Error: ${error.details.map((d) => d.message).join(", ")}`, error);
    }
    //check if user already exsist
    let user = await userRepo.retriveUserByPhoneNo(_data.phoneNo);
    if (user) {
        throw new ApiError_api_util_1.default(409, "User with this phone number already exists");
    }
    if (_data.email) {
        user = await userRepo.retriveUserByEmail(_data.email);
        if (user) {
            throw new ApiError_api_util_1.default(409, "User with this email already exists");
        }
    }
    //save user to database
    const newUser = await userRepo.createUser(value);
    return new ApiSuccess_api_util_1.default(201, "User created successfully", { user: newUser });
}
/**
 * retirve a user by _id.
 * @param _id - User id
 * @returns user
 * @throws invalid id
 */
async function retirveUserById(_id) {
    const user = await userRepo.retriveUserById(_id);
    if (!user) {
        throw new ApiError_api_util_1.default(400, "Inavlid User", null);
    }
    return new ApiSuccess_api_util_1.default(200, "User retrived successful", { user: user });
}
async function retriveUserByRefCode(_refCode) {
    const user = await userRepo.retrieveUserByRefCode(_refCode);
    if (!user) {
        throw new ApiError_api_util_1.default(400, "Inavlid Refrence code", null);
    }
    return new ApiSuccess_api_util_1.default(200, "Refrence Code verified sucessfully");
}
async function retrieveAllUsers() {
    const users = (await userRepo.retrieveAllUsers()) ?? [];
    return new ApiSuccess_api_util_1.default(200, "Users retrived successfully", { user: users });
}
//# sourceMappingURL=user.services.js.map