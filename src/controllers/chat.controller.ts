import { Request, Response } from "express";
import chatService from "../services/chat.service";
import usernameService from "../services/username.service";
import { asyncHandler } from "../utils/asyncHandler.util";

export const getChatHistory = asyncHandler(async (req: any, res: Response) => {
    const { targetId, targetType } = req.query;
    const userId = req.user.id;
    const history = await chatService.getChatHistory(userId, targetId as string, targetType as any);
    res.status(200).json({ success: true, data: history });
});

export const shareComplaint = asyncHandler(async (req: any, res: Response) => {
    const { recipientId, recipientType, complaintId } = req.body;
    const senderId = req.user.id;
    const message = await chatService.shareComplaint(senderId, recipientId, recipientType, complaintId);
    res.status(200).json({ success: true, data: message });
});

export const updateUsername = asyncHandler(async (req: any, res: Response) => {
    const { newUsername } = req.body;
    const userId = req.user.id;
    const user = await usernameService.updateUsername(userId, newUsername);
    res.status(200).json({ success: true, data: user });
});

export const getMutualFriends = asyncHandler(async (req: any, res: Response) => {
    const { otherUserId } = req.query;
    const userId = req.user.id;
    const friends = await chatService.getMutualFriends(userId, otherUserId as string);
    res.status(200).json({ success: true, data: friends });
});
