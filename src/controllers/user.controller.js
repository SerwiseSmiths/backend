"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleProviderStatus = exports.getProviders = exports.createProvider = exports.getAllUsers = exports.validateRefCode = exports.registerUser = void 0;
/**
 * @file user.controller.ts
 * @description Controller for handling user-related HTTP requests
 * @module controllers/user.controller
 */
const userService = require("../services/user.services");
const userRepo = require("../repositories/user.repo");
const username_service_1 = require("../services/username.service");
const User_schema_1 = require("../models/schema/User.schema");
const ApiSuccess_api_util_1 = require("../utils/api/ApiSuccess.api.util");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with phone number and basic details.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Validation error or duplicate user
 */
const registerUser = async (req, res, next) => {
    try {
        const userData = req.body;
        const verificationSignature = userData.verificationSignature;
        if (!verificationSignature) {
            return next(new ApiError_api_util_1.default(400, "verificationSignature is required for signup", "Validation error"));
        }
        const jwt = require("jsonwebtoken");
        const ACCESS_SECRET = process.env.JWT_SECRET;
        let payload;
        try {
            payload = jwt.verify(verificationSignature, ACCESS_SECRET);
        }
        catch (err) {
            return next(new ApiError_api_util_1.default(400, "Invalid or expired verification signature", "Validation error"));
        }
        if (!payload || payload.flow !== "signup" || !payload.phoneNo) {
            return next(new ApiError_api_util_1.default(400, "Invalid verification payload", "Validation error"));
        }
        userData.phoneNo = payload.phoneNo;
        if (!userData || typeof userData !== "object" || Object.keys(userData).length === 0) {
            return next(new ApiError_api_util_1.default(400, "Request body is required. Send JSON with header: Content-Type: application/json", "Validation error"));
        }
        const newUserResult = await userService.registerUser(userData);
        if (!newUserResult ||
            newUserResult.statusCode >= 300 ||
            !newUserResult.data ||
            !newUserResult.data.user) {
            next(new ApiError_api_util_1.default(500, "user not registered", "Internal server error"));
        }
        console.log(newUserResult);
        const userResult = await userService.retirveUserById(newUserResult.data.user._id);
        if (!userResult ||
            userResult.statusCode >= 300 ||
            !userResult.data ||
            !userResult.data.user) {
            next(new ApiError_api_util_1.default(500, "user not registered", "Internal server error"));
        }
        const token = await userResult.data.user.generateAuthTokens();
        res.status(newUserResult.statusCode).json(new ApiSuccess_api_util_1.default(201, "user registed successfully", {
            user: userResult.data.user,
            token,
        }));
    }
    catch (error) {
        next(new ApiError_api_util_1.default(500, "user not registered", error));
    }
};
exports.registerUser = registerUser;
const validateRefCode = async (req, res, next) => {
    const { refCode } = req.params;
    const userResult = await userService.retriveUserByRefCode(refCode);
    res.status(userResult.statusCode).json(userResult);
};
exports.validateRefCode = validateRefCode;
const getAllUsers = async (req, res, next) => {
    const usersResult = await userService.retrieveAllUsers();
    res.status(usersResult.statusCode).json(usersResult);
};
exports.getAllUsers = getAllUsers;
// =====================================
// MANAGE PROVIDERS
// =====================================
const createProvider = async (req, res, next) => {
    try {
        const { phoneNo, firstName, lastName, email } = req.body;
        if (!phoneNo || !firstName || !lastName) {
            return next(new ApiError_api_util_1.default(400, "phoneNo, firstName and lastName are required"));
        }
        // Check if a user already exists with this phone number
        const existingByPhone = await userRepo.retriveUserByPhoneNo(phoneNo);
        if (existingByPhone) {
            return next(new ApiError_api_util_1.default(409, "A user with this phone number already exists"));
        }
        // Generate a unique username bypassing OTP/Joi validation
        const username = await username_service_1.default.generateUniqueUsername(firstName, lastName);
        // Directly save to DB
        const newProvider = await userRepo.createUser({
            phoneNo,
            firstName,
            lastName,
            email: email || undefined,
            userType: "provider",
            username,
            isActive: true,
            source: "admin_whitelist",
        });
        if (!newProvider) {
            return next(new ApiError_api_util_1.default(500, "Failed to create provider"));
        }
        res.status(201).json(new ApiSuccess_api_util_1.default(201, "Provider whitelisted successfully", { provider: newProvider }));
    }
    catch (error) {
        next(new ApiError_api_util_1.default(500, "Error creating provider", error));
    }
};
exports.createProvider = createProvider;
const getProviders = async (req, res, next) => {
    try {
        const providers = await User_schema_1.default.find({ userType: "provider", isDeleted: false }).sort({ createdAt: -1 });
        res.status(200).json(new ApiSuccess_api_util_1.default(200, "Providers fetched successfully", { providers }));
    }
    catch (error) {
        next(new ApiError_api_util_1.default(500, "Error fetching providers", error));
    }
};
exports.getProviders = getProviders;
const toggleProviderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const provider = await User_schema_1.default.findById(id);
        if (!provider) {
            return next(new ApiError_api_util_1.default(404, "Provider not found"));
        }
        provider.isActive = !provider.isActive;
        await provider.save();
        res.status(200).json(new ApiSuccess_api_util_1.default(200, `Provider ${provider.isActive ? "activated" : "deactivated"} successfully`, { provider }));
    }
    catch (error) {
        next(new ApiError_api_util_1.default(500, "Error updating provider status", error));
    }
};
exports.toggleProviderStatus = toggleProviderStatus;
//# sourceMappingURL=user.controller.js.map