"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSelfInfo = exports.updateProfileImage = exports.getSelfComaplints = exports.getSelfWallet = exports.getSelfDevices = exports.getSelfAddress = exports.home = void 0;
const ApiSuccess_api_util_1 = require("../utils/api/ApiSuccess.api.util");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
const selfService = require("../services/self.service");
const deviceService = require("../services/device.service");
const complaintService = require("../services/complaint.service");
const walletService = require("../services/wallet.services");
const userService = require("../services/user.services");
const notification_service_1 = require("../services/notification.service");
const serverQueryClient_1 = require("../utils/serverQueryClient");
const home = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const data = await serverQueryClient_1.serverQueryClient.fetchQuery({
            queryKey: ["self", "home", userId],
            staleTime: 60 * 1000, // 1 minute
            queryFn: async () => {
                // Fetch user details
                const userRes = await userService.retirveUserById(userId);
                if (!userRes.data)
                    throw new ApiError_api_util_1.default(500, "Failed to fetch user data");
                const user = userRes.data.user;
                // Fetch unseen notification count
                const notifications = await notification_service_1.default.getUnseenNotificationCount(userId);
                // Fetch wallet balance
                const walletRes = await walletService.getWallet(userId);
                if (!walletRes.data)
                    throw new ApiError_api_util_1.default(500, "Failed to fetch wallet data");
                const wallet = walletRes.data.wallet;
                return {
                    name: user.firstName,
                    notifications,
                    wallet: wallet.balance,
                };
            },
        });
        return res.json(new ApiSuccess_api_util_1.default(200, "Home details fetched successfully", data));
    }
    catch (error) {
        next(error);
    }
};
exports.home = home;
const getSelfAddress = async (req, res, next) => {
    console.log(req.user);
    const userId = req.user.id;
    console.log("User ID in getSelfAddress:", userId);
    const address = await serverQueryClient_1.serverQueryClient.fetchQuery({
        queryKey: ["self", "address", userId],
        staleTime: 60 * 1000,
        queryFn: () => selfService.getSelfAddress(userId),
    });
    return res.json(new ApiSuccess_api_util_1.default(200, "Address details fatched successfully", { address }));
};
exports.getSelfAddress = getSelfAddress;
const getSelfDevices = async (req, res, next) => {
    console.log(req.user);
    const userId = req.user.id;
    console.log("User ID in getSelfDevices:", userId);
    const devices = await serverQueryClient_1.serverQueryClient.fetchQuery({
        queryKey: ["self", "devices", userId],
        staleTime: 60 * 1000,
        queryFn: () => deviceService.getDevicesByUser(userId),
    });
    return res.json(new ApiSuccess_api_util_1.default(200, "Device details fatched successfully", { devices }));
};
exports.getSelfDevices = getSelfDevices;
const getSelfWallet = async (req, res, next) => {
    const userId = req.user.id;
    const result = await serverQueryClient_1.serverQueryClient.fetchQuery({
        queryKey: ["self", "wallet", userId],
        staleTime: 60 * 1000,
        queryFn: () => walletService.getWallet(userId),
    });
    return res.status(result.statusCode).json(result);
};
exports.getSelfWallet = getSelfWallet;
const getSelfComaplints = async (req, res, next) => {
    console.log(req.user);
    const userId = req.user.id;
    console.log("User ID in getSelfComplaints:", userId);
    const complaints = await serverQueryClient_1.serverQueryClient.fetchQuery({
        queryKey: ["self", "complaints", userId],
        staleTime: 60 * 1000,
        queryFn: () => complaintService.listComplaintsByUser(userId),
    });
    return res.json(new ApiSuccess_api_util_1.default(200, "Complaint details fatched successfully", { complaints }));
};
exports.getSelfComaplints = getSelfComaplints;
const updateProfileImage = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { profileImageUrl } = req.body;
        if (!profileImageUrl || typeof profileImageUrl !== 'string') {
            return next(new ApiError_api_util_1.default(400, "profileImageUrl is required and must be a string"));
        }
        const result = await userService.updateProfileImage(userId, profileImageUrl);
        return res.status(result.statusCode).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.updateProfileImage = updateProfileImage;
const updateSelfInfo = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { firstName, lastName, profileImage, email } = req.body;
        const result = await userService.updateSelfInfo(userId, { firstName, lastName, profileImage, email });
        return res.status(result.statusCode).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.updateSelfInfo = updateSelfInfo;
//# sourceMappingURL=self.contoller.js.map