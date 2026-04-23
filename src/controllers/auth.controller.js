"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.truecallerOAuthAuth = exports.truecallerAuth = exports.refreshToken = exports.me = exports.verifyOtp = exports.generateOtp = exports.login = void 0;
const authService = require("../services/auth.service");
const UserRepo = require("../repositories/user.repo");
const ApiSuccess_api_util_1 = require("../utils/api/ApiSuccess.api.util");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
const jwt = require("jsonwebtoken");
const login = async (req, res, next) => {
    const { phoneNo, userType } = req.body;
    const appContextHeader = req.headers["x-app-context"];
    const appContext = Array.isArray(appContextHeader) ? appContextHeader[0] : appContextHeader;
    const loginResult = await authService.login(phoneNo, userType, appContext);
    return res.status(loginResult.statusCode).json(loginResult);
};
exports.login = login;
const generateOtp = async (req, res, next) => {
    const { phoneNo } = req.body;
    const result = await authService.generateOtp(phoneNo);
    return res.status(result.statusCode).json(result);
};
exports.generateOtp = generateOtp;
const verifyOtp = async (req, res, next) => {
    const { phoneNo, otp, userType, flow } = req.body;
    const appContextHeader = req.headers["x-app-context"];
    const appContext = Array.isArray(appContextHeader) ? appContextHeader[0] : appContextHeader;
    const result = await authService.verifyOtp(phoneNo, otp, userType, flow, appContext);
    return res.status(result.statusCode).json(result);
};
exports.verifyOtp = verifyOtp;
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
const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken: token } = req.body;
        if (!token)
            throw new ApiError_api_util_1.default(400, "Refresh token required");
        // Verify the refresh token is still cryptographically valid
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        }
        catch {
            throw new ApiError_api_util_1.default(401, "Refresh token expired or invalid");
        }
        // Find user and confirm the stored refresh token matches
        const user = await UserRepo.retrieveUserByRefreshToken(token);
        if (!user)
            throw new ApiError_api_util_1.default(401, "Refresh token revoked or not found");
        const tokens = await user.generateAuthTokens();
        return res.status(200).json(new ApiSuccess_api_util_1.default(200, "Token refreshed successfully", { tokens }));
    }
    catch (error) {
        next(error);
    }
};
exports.refreshToken = refreshToken;
const truecallerAuth = async (req, res, next) => {
    const { payload, signature, requestNonce, userType } = req.body;
    const result = await authService.truecallerAuth({
        payload,
        signature,
        requestNonce,
        ...(userType !== undefined && { userType }),
    });
    return res.status(result.statusCode).json(result);
};
exports.truecallerAuth = truecallerAuth;
const truecallerOAuthAuth = async (req, res, next) => {
    const { authorizationCode, codeVerifier, userType } = req.body;
    const result = await authService.truecallerOAuthAuth({
        authorizationCode,
        codeVerifier,
        ...(userType !== undefined && { userType }),
    });
    return res.status(result.statusCode).json(result);
};
exports.truecallerOAuthAuth = truecallerOAuthAuth;
//# sourceMappingURL=auth.controller.js.map