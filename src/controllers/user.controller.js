"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.validateRefCode = exports.registerUser = void 0;
const userService = require("../services/user.services");
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
//# sourceMappingURL=user.controller.js.map