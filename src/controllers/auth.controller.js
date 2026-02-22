"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = void 0;
const authService = require("../services/auth.service");
const UserRepo = require("../repositories/user.repo");
const ApiSuccess_api_util_1 = require("../utils/api/ApiSuccess.api.util");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
const login = async (req, res, next) => {
    const { phoneNo, userType } = req.body;
    const loginResult = await authService.login(phoneNo, userType);
    return res.status(loginResult.statusCode).json(loginResult);
};
exports.login = login;
// ============================================================
// GET /auth/me — returns the authenticated user's profile
// ============================================================
const me = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            throw new ApiError_api_util_1.default(401, "Unauthorized");
        const user = await UserRepo.retriveUserById(userId);
        if (!user)
            throw new ApiError_api_util_1.default(404, "User not found");
        return res.status(200).json(new ApiSuccess_api_util_1.default(200, "User profile fetched successfully", {
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNo: user.phoneNo,
                profileImage: user.profileImage ?? null,
                userType: user.userType,
                refrenceCode: user.refrenceCode,
            },
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.me = me;
//# sourceMappingURL=auth.controller.js.map