"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Circle_schema_1 = require("../models/schema/Circle.schema");
const User_schema_1 = require("../models/schema/User.schema");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
const crypto = require("crypto");
class CircleService {
    async createCircle(userId, name, description) {
        const invitationCode = crypto.randomBytes(4).toString("hex").toUpperCase();
        const circle = await Circle_schema_1.default.create({
            name,
            description,
            admins: [userId],
            members: [userId],
            invitationCode,
        });
        // Update user's circles
        await User_schema_1.default.findByIdAndUpdate(userId, {
            $push: { circles: circle._id },
        });
        return circle;
    }
    async addMember(circleId, memberId) {
        const circle = await Circle_schema_1.default.findById(circleId);
        if (!circle)
            throw new ApiError_api_util_1.default(404, "Circle not found");
        if (circle.members.includes(memberId)) {
            throw new ApiError_api_util_1.default(400, "User is already a member");
        }
        circle.members.push(memberId);
        await circle.save();
        await User_schema_1.default.findByIdAndUpdate(memberId, {
            $push: { circles: circle._id },
        });
        return circle;
    }
    async joinByLink(userId, invitationCode) {
        const circle = await Circle_schema_1.default.findOne({ invitationCode, isDeleted: false });
        if (!circle)
            throw new ApiError_api_util_1.default(404, "Invalid invitation link");
        return await this.addMember(circle._id.toString(), userId);
    }
    async makeAdmin(circleId, adminId, targetUserId) {
        const circle = await Circle_schema_1.default.findById(circleId);
        if (!circle)
            throw new ApiError_api_util_1.default(404, "Circle not found");
        if (!circle.admins.includes(adminId)) {
            throw new ApiError_api_util_1.default(403, "Only admins can promote others");
        }
        if (!circle.members.includes(targetUserId)) {
            throw new ApiError_api_util_1.default(400, "Target user is not a member of the circle");
        }
        if (!circle.admins.includes(targetUserId)) {
            circle.admins.push(targetUserId);
            await circle.save();
        }
        return circle;
    }
    async getMutualCircles(user1Id, user2Id) {
        const user1 = await User_schema_1.default.findById(user1Id).populate("circles");
        const user2 = await User_schema_1.default.findById(user2Id).populate("circles");
        if (!user1 || !user2)
            throw new ApiError_api_util_1.default(404, "User not found");
        const user1CircleIds = user1.circles.map(c => c.toString());
        const mutualCircles = user2.circles.filter(c => user1CircleIds.includes(c.toString()));
        return await Circle_schema_1.default.find({ _id: { $in: mutualCircles } });
    }
}
exports.default = new CircleService();
//# sourceMappingURL=circle.service.js.map