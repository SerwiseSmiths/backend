"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMutualCircles = exports.promoteToAdmin = exports.joinCircleByLink = exports.createCircle = void 0;
const circle_service_1 = require("../services/circle.service");
const createCircle = async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user.id;
    const circle = await circle_service_1.default.createCircle(userId, name, description);
    res.status(201).json({ success: true, data: circle });
};
exports.createCircle = createCircle;
const joinCircleByLink = async (req, res) => {
    const { invitationCode } = req.body;
    const userId = req.user.id;
    const circle = await circle_service_1.default.joinByLink(userId, invitationCode);
    res.status(200).json({ success: true, data: circle });
};
exports.joinCircleByLink = joinCircleByLink;
const promoteToAdmin = async (req, res) => {
    const { circleId, targetUserId } = req.body;
    const adminId = req.user.id;
    const circle = await circle_service_1.default.makeAdmin(circleId, adminId, targetUserId);
    res.status(200).json({ success: true, data: circle });
};
exports.promoteToAdmin = promoteToAdmin;
const getMutualCircles = async (req, res) => {
    const { otherUserId } = req.query;
    const userId = req.user.id;
    const circles = await circle_service_1.default.getMutualCircles(userId, otherUserId);
    res.status(200).json({ success: true, data: circles });
};
exports.getMutualCircles = getMutualCircles;
//# sourceMappingURL=circle.controller.js.map