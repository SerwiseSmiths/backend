import CircleModel from "../models/schema/Circle.schema";
import UserModel from "../models/schema/User.schema";
import ApiError from "../utils/api/ApiError.api.util";
import * as crypto from "crypto";
import socketService from "./socket.service";

class CircleService {
    async createCircle(userId: string, name: string, description?: string) {
        const invitationCode = crypto.randomBytes(4).toString("hex").toUpperCase();

        const circle = await CircleModel.create({
            name,
            description,
            admins: [userId],
            members: [userId],
            invitationCode,
        });

        // Update user's circles
        await UserModel.findByIdAndUpdate(userId, {
            $push: { circles: circle._id },
        });

        return circle;
    }

    async addMember(circleId: string, memberId: string) {
        const circle = await CircleModel.findById(circleId);
        if (!circle) throw new ApiError(404, "Circle not found");

        if (circle.members.includes(memberId as any)) {
            throw new ApiError(400, "User is already a member");
        }

        circle.members.push(memberId as any);
        await circle.save();

        await UserModel.findByIdAndUpdate(memberId, {
            $push: { circles: circle._id },
        });

        return circle;
    }

    async joinByLink(userId: string, invitationCode: string) {
        const circle = await CircleModel.findOne({ invitationCode, isDeleted: false });
        if (!circle) throw new ApiError(404, "Invalid invitation link");

        return await this.addMember(circle._id.toString(), userId);
    }

    async makeAdmin(circleId: string, adminId: string, targetUserId: string) {
        const circle = await CircleModel.findById(circleId);
        if (!circle) throw new ApiError(404, "Circle not found");

        if (!circle.admins.includes(adminId as any)) {
            throw new ApiError(403, "Only admins can promote others");
        }

        if (!circle.members.includes(targetUserId as any)) {
            throw new ApiError(400, "Target user is not a member of the circle");
        }

        if (!circle.admins.includes(targetUserId as any)) {
            circle.admins.push(targetUserId as any);
            await circle.save();
        }

        return circle;
    }

    async getMutualCircles(user1Id: string, user2Id: string) {
        const user1 = await UserModel.findById(user1Id).populate("circles");
        const user2 = await UserModel.findById(user2Id).populate("circles");

        if (!user1 || !user2) throw new ApiError(404, "User not found");

        const user1CircleIds = user1.circles.map(c => c.toString());
        const mutualCircles = user2.circles.filter(c => user1CircleIds.includes(c.toString()));

        return await CircleModel.find({ _id: { $in: mutualCircles } });
    }
}

export default new CircleService();
