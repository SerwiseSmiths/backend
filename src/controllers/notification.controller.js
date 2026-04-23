"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testProviderNotification = exports.markAsRead = exports.getMyNotifications = exports.sendNotification = exports.registerDevice = void 0;
const notification_service_1 = require("../services/notification.service");
const socket_service_1 = require("../services/socket.service");
const userRepo = require("../repositories/user.repo");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
const ApiSuccess_api_util_1 = require("../utils/api/ApiSuccess.api.util");
// Register Device Token
const registerDevice = async (req, res, next) => {
    try {
        const { token, deviceType } = req.body;
        if (!token) {
            throw new ApiError_api_util_1.default(400, "Device token is required");
        }
        // Get user from optional auth middleware (populated if token is present and valid)
        const user = req.user;
        const userId = user ? user.id : undefined;
        const userType = user ? user.userType : undefined;
        console.log(`[Device Register] Token: ${token.substring(0, 20)}..., User: ${userId || 'Not linked'}, UserType: ${userType || 'N/A'}`);
        // Register/link device token (works for both customers and providers)
        const result = await notification_service_1.default.registerDeviceToken(userId, token, deviceType || "ANDROID");
        if (!result) {
            throw new ApiError_api_util_1.default(500, "Failed to register device token");
        }
        const message = userId
            ? `Device token registered and linked to ${userType || 'user'} (${userId})`
            : "Device token registered. Link to user by calling this endpoint with authentication token.";
        res.status(200).json(new ApiSuccess_api_util_1.default(200, message, {
            deviceToken: result.token,
            linkedToUser: !!userId,
            userId: userId || null,
            userType: userType || null,
            deviceType: result.deviceType,
            isActive: result.isActive,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.registerDevice = registerDevice;
// Send Notification (Admin)
const sendNotification = async (req, res, next) => {
    try {
        const { title, body, type, target, userId, phoneNo, metadata } = req.body;
        // Resolve userId from phoneNo if not directly provided
        let resolvedUserId = userId;
        if (!resolvedUserId && phoneNo) {
            const user = await userRepo.retriveUserByPhoneNo(phoneNo);
            if (!user) {
                throw new ApiError_api_util_1.default(404, `No user found with phone number: ${phoneNo}`);
            }
            resolvedUserId = user._id.toString();
            console.log(`[Notification] Resolved userId ${resolvedUserId} from phoneNo ${phoneNo}`);
        }
        const notification = await notification_service_1.default.sendNotification({
            title,
            body,
            type,
            target,
            userId: resolvedUserId,
            metadata
        });
        res.status(201).json(new ApiSuccess_api_util_1.default(201, "Notification sent successfully", notification));
    }
    catch (error) {
        next(error);
    }
};
exports.sendNotification = sendNotification;
// Get User Notifications
const getMyNotifications = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            throw new ApiError_api_util_1.default(401, "Unauthorized");
        const limit = parseInt(req.query.limit) || 20;
        const skip = parseInt(req.query.skip) || 0;
        const notifications = await notification_service_1.default.getUserNotifications(userId, limit, skip);
        res.status(200).json(new ApiSuccess_api_util_1.default(200, "Notifications fetched successfully", notifications));
    }
    catch (error) {
        next(error);
    }
};
exports.getMyNotifications = getMyNotifications;
// Mark Notification as Read
const markAsRead = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            throw new ApiError_api_util_1.default(401, "Unauthorized");
        const { id } = req.params;
        if (!id)
            throw new ApiError_api_util_1.default(400, "Notification ID is required");
        const notification = await notification_service_1.default.markAsRead(id, userId);
        if (!notification) {
            throw new ApiError_api_util_1.default(404, "Notification not found or access denied");
        }
        res.status(200).json(new ApiSuccess_api_util_1.default(200, "Notification marked as read", notification));
    }
    catch (error) {
        next(error);
    }
};
exports.markAsRead = markAsRead;
// Test Route - Send fake data to provider with phone number 1000000000
const testProviderNotification = async (req, res, next) => {
    try {
        const phoneNo = "1000000000";
        // Find provider by phone number
        const provider = await userRepo.retriveUserByPhoneNo(phoneNo);
        if (!provider) {
            throw new ApiError_api_util_1.default(404, `Provider with phone number ${phoneNo} not found`);
        }
        const providerId = provider._id.toString();
        console.log(`[TEST] Found provider: ${providerId} with phone: ${phoneNo}`);
        // Check FCM initialization
        const { fcm } = await Promise.resolve().then(() => require("../config/firebase.config"));
        const fcmInitialized = !!fcm;
        console.log(`[TEST] FCM initialized: ${fcmInitialized}`);
        if (!fcmInitialized) {
            console.warn(`[TEST] WARNING: FCM is not initialized. Check Firebase configuration.`);
        }
        // Check if provider has registered device tokens
        const notificationRepo = (await Promise.resolve().then(() => require("../repositories/notification.repository"))).default;
        const deviceTokens = await notificationRepo.getTokensByUser(providerId);
        console.log(`[TEST] Found ${deviceTokens.length} device tokens for provider ${providerId}`);
        if (deviceTokens.length === 0) {
            console.warn(`[TEST] WARNING: No device tokens found for provider ${providerId}. Push notifications will not be sent.`);
            console.warn(`[TEST] Provider needs to register device token using: POST /api/v2/notification/device/register`);
        }
        else {
            console.log(`[TEST] Device tokens:`, deviceTokens);
        }
        // Check if provider is online via socket
        const isOnline = socket_service_1.default.isUserOnline(providerId);
        console.log(`[TEST] Provider online status: ${isOnline}`);
        // Create fake complaint data
        const fakeComplaint = {
            _id: "test_complaint_id_" + Date.now(),
            title: "Test Service Request",
            user: "test_user_id",
            provider: providerId,
            stage: "ENTRANCE",
            addressId: "test_address_id",
            notes: "This is a test notification and socket popup",
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        // Create event data
        const eventData = {
            complaint: fakeComplaint,
            userId: "test_user_id",
            providerId: providerId,
            timestamp: new Date().toISOString(),
        };
        // Send via socket (will also trigger notification if provider is offline)
        console.log(`[TEST] Sending socket event to provider ${providerId}`);
        socket_service_1.default.emitToProvider(providerId, "complaint:created", eventData);
        // Also send a direct notification
        console.log(`[TEST] Sending push notification to provider ${providerId}`);
        const notification = await notification_service_1.default.sendNotification({
            userId: providerId,
            target: "USER",
            title: "Test Notification - New Job Available",
            body: "You have a new test service request",
            type: "Service",
            metadata: {
                event: "complaint:created",
                complaintId: fakeComplaint._id,
                subType: "TEST_NOTIFICATION",
            },
        });
        console.log(`[TEST] Notification created with status: ${notification.status}`);
        let message = "Notification sent successfully";
        if (!fcmInitialized) {
            message = "WARNING: FCM not initialized. Check Firebase configuration.";
        }
        else if (deviceTokens.length === 0) {
            message = "WARNING: No device tokens found. Provider needs to register device token using: POST /api/v2/notification/device/register";
        }
        res.status(200).json(new ApiSuccess_api_util_1.default(200, "Test notification and socket event sent successfully", {
            providerId,
            providerPhone: phoneNo,
            providerName: provider.fullName ? provider.fullName() : `${provider.firstName} ${provider.lastName}`,
            isOnline,
            fcmInitialized,
            deviceTokensCount: deviceTokens.length,
            deviceTokens: deviceTokens.length > 0 ? deviceTokens : "No tokens registered",
            notificationStatus: notification.status,
            notificationId: notification._id.toString(),
            event: "complaint:created",
            data: eventData,
            message,
            troubleshooting: {
                ifNoTokens: "Register device token: POST /api/v2/notification/device/register with body: { token: 'FCM_TOKEN', deviceType: 'ANDROID' or 'IOS' }",
                ifFcmNotInitialized: "Check Firebase service account configuration in firebase.config.ts",
            },
        }));
    }
    catch (error) {
        console.error("[TEST] Error in testProviderNotification:", error);
        next(error);
    }
};
exports.testProviderNotification = testProviderNotification;
//# sourceMappingURL=notification.controller.js.map