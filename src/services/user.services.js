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
exports.updateProfileImage = updateProfileImage;
exports.updateSelfInfo = updateSelfInfo;
const user_validation_1 = require("../models/validation/user.validation");
const userRepo = require("../repositories/user.repo");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
const ApiSuccess_api_util_1 = require("../utils/api/ApiSuccess.api.util");
const username_service_1 = require("./username.service");
const wallet_services_1 = require("./wallet.services");
const wallet_type_1 = require("../types/wallet.type");
const strapi_service_1 = require("./strapi.service");
const telegram_service_1 = require("./telegram.service");
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
    console.log(value);
    // generate unique username
    const username = await username_service_1.default.generateUniqueUsername(value.firstName, value.lastName);
    value.username = username;
    //save user to database
    const newUser = await userRepo.createUser(value);
    console.log(newUser);
    // Telegram notification (fire-and-forget)
    (0, telegram_service_1.notifyNewUser)(newUser).catch(() => { });
    // Credit signup bonus if configured in Strapi
    try {
        console.log("[SignupBonus] Fetching bonus config from Strapi...");
        const bonusConfig = await (0, strapi_service_1.fetchSignupBonusConfig)();
        console.log("[SignupBonus] Config received:", JSON.stringify(bonusConfig));
        if (!bonusConfig) {
            console.warn("[SignupBonus] No config returned from Strapi — skipping");
        }
        else if (!bonusConfig.enabled) {
            console.warn("[SignupBonus] Bonus is disabled in Strapi — skipping");
        }
        else if (bonusConfig.bonusAmount <= 0) {
            console.warn("[SignupBonus] bonusAmount is 0 or negative — skipping");
        }
        else {
            console.log(`[SignupBonus] Crediting ₹${bonusConfig.bonusAmount} to user ${newUser._id}`);
            await (0, wallet_services_1.creditWallet)(newUser._id.toString(), bonusConfig.bonusAmount, wallet_type_1.WalletLedgerSource.CASHBACK, undefined, { description: `Welcome bonus — ₹${bonusConfig.bonusAmount}` });
            console.log(`[SignupBonus] ✅ ₹${bonusConfig.bonusAmount} credited successfully to ${newUser._id}`);
        }
    }
    catch (err) {
        console.error("[SignupBonus] ❌ Failed to credit signup bonus:", err);
    }
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
/**
 * Updates a user's profile image.
 * @param _id - User id
 * @param profileImageUrl - URL of the profile image
 * @returns Updated user
 */
async function updateProfileImage(_id, profileImageUrl) {
    const updatedUser = await userRepo.updateUserById(_id, { profileImage: profileImageUrl });
    if (!updatedUser) {
        throw new ApiError_api_util_1.default(404, "User not found");
    }
    return new ApiSuccess_api_util_1.default(200, "Profile image updated successfully", { user: updatedUser });
}
/**
 * Updates a user's basic info.
 */
async function updateSelfInfo(_id, data) {
    const updatedUser = await userRepo.updateUserById(_id, data);
    if (!updatedUser) {
        throw new ApiError_api_util_1.default(404, "User not found");
    }
    return new ApiSuccess_api_util_1.default(200, "Profile updated successfully", { user: updatedUser });
}
//# sourceMappingURL=user.services.js.map