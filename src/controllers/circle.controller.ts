import { Request, Response } from "express";
import circleService from "../services/circle.service";

export const createCircle = async (req: any, res: Response) => {
    const { name, description } = req.body;
    const userId = req.user.id;
    const circle = await circleService.createCircle(userId, name, description);
    res.status(201).json({ success: true, data: circle });
};

export const joinCircleByLink = async (req: any, res: Response) => {
    const { invitationCode } = req.body;
    const userId = req.user.id;
    const circle = await circleService.joinByLink(userId, invitationCode);
    res.status(200).json({ success: true, data: circle });
};

export const promoteToAdmin = async (req: any, res: Response) => {
    const { circleId, targetUserId } = req.body;
    const adminId = req.user.id;
    const circle = await circleService.makeAdmin(circleId, adminId, targetUserId);
    res.status(200).json({ success: true, data: circle });
};

export const getMutualCircles = async (req: any, res: Response) => {
    const { otherUserId } = req.query;
    const userId = req.user.id;
    const circles = await circleService.getMutualCircles(userId, otherUserId as string);
    res.status(200).json({ success: true, data: circles });
};
