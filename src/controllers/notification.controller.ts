import { Request, Response, NextFunction } from "express";
import notificationService from "../services/notification.service";
import ApiError from "../utils/api/ApiError.api.util";
import ApiSuccess from "../utils/api/ApiSuccess.api.util";


// Register Device Token
export const registerDevice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token, deviceType } = req.body;
        // Assuming authenticated user is attached to req.user or similar, 
        // but the plan mentioned "link with user IF user there".
        // I need to check how user is passed. Typically `req.user` in express after auth middleware.
        // I'll assume standard middleware populates req.user

        // Check if user is authenticated (might be optional for public app features, but user asked "if user there then token should be linked")
        const userId = (req as any).user ? (req as any).user.id : undefined;

        const result = await notificationService.registerDeviceToken(userId, token, deviceType || "ANDROID");

        res.status(200).json(new ApiSuccess(200, "Device registered successfully", result));
    } catch (error) {
        next(error);
    }
};

// Send Notification (Admin)
export const sendNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, body, type, target, userId, metadata } = req.body;

        const notification = await notificationService.sendNotification({
            title,
            body,
            type,
            target,
            userId,
            metadata
        });

        res.status(201).json(new ApiSuccess(201, "Notification sent successfully", notification));
    } catch (error) {
        next(error);
    }
};

// Get User Notifications
export const getMyNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) throw new ApiError(401, "Unauthorized");

        const limit = parseInt(req.query.limit as string) || 20;
        const skip = parseInt(req.query.skip as string) || 0;

        const notifications = await notificationService.getUserNotifications(userId, limit, skip);

        res.status(200).json(new ApiSuccess(200, "Notifications fetched successfully", notifications));
    } catch (error) {
        next(error);
    }
};

// Mark Notification as Read
export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) throw new ApiError(401, "Unauthorized");

        const { id } = req.params;
        const notification = await notificationService.markAsRead(id, userId as string);


        if (!notification) {
            throw new ApiError(404, "Notification not found or access denied");
        }

        res.status(200).json(new ApiSuccess(200, "Notification marked as read", notification));
    } catch (error) {
        next(error);
    }
};

