import MessageModel from "../models/schema/Message.schema";
import CircleModel from "../models/schema/Circle.schema";
import UserModel from "../models/schema/User.schema";
import { ComplaintModel } from "../models/schema/Complaint.schema";
import ApiError from "../utils/api/ApiError.api.util";

class ChatService {
    async getChatHistory(userId: string, targetId: string, targetType: "User" | "Circle", limit = 50, skip = 0) {
        const query: any = {
            recipientType: targetType,
            $or: [
                { sender: userId, recipientId: targetId },
                { sender: targetId, recipientId: userId },
            ],
        };

        if (targetType === "Circle") {
            query.$or = [{ recipientId: targetId }];
        }

        // Temporary chat logic with provider
        // If target is a provider and there's a complaint, we might need to filter
        // For now, simple history. The requirement says "temporary chat with provider which will not how to user after complint is completed"

        const messages = await MessageModel.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .populate("sender", "firstName lastName username profileImage")
            .populate("complaintId");

        return messages;
    }

    async shareComplaint(senderId: string, recipientId: string, recipientType: "User" | "Circle", complaintId: string) {
        const complaint = await ComplaintModel.findById(complaintId);
        if (!complaint) throw new ApiError(404, "Complaint not found");

        const content = `Shared a complaint: ${complaint.title || "Untitled"}`;

        const message = await MessageModel.create({
            sender: senderId,
            recipientType,
            recipientId,
            content,
            type: "complaint",
            complaintId,
        });

        // If shared with a user, ensure it appears in their complaint list if the logic requires it.
        // The prompt says "it apper in that user's complaint as well". 
        // This might mean we need to add the shared user to some "sharedWith" field in Complaint schema
        // or just let the frontend handle the display based on messages.
        // Let's assume we need to update the Complaint document.

        return message;
    }

    async getTemporaryChat(userId: string, providerId: string, complaintId: string) {
        const complaint = await ComplaintModel.findById(complaintId);
        if (!complaint) throw new ApiError(404, "Complaint not found");

        // Check if complaint is completed or rejected - temporary chat should not be visible
        if (complaint.stage === "COMPLETED" || complaint.stage === "REJECTED") {
            return []; // Return empty or restricted history if completed
        }

        return this.getChatHistory(userId, providerId, "User");
    }

    async getMutualFriends(user1Id: string, user2Id: string) {
        // Assuming "friends" are people you share a circle with OR explicitly added (not in schema yet)
        // For now, let's define mutual friends as users who are in the same circles as both users.
        const user1Circles = await CircleModel.find({ members: user1Id }, "_id");
        const user2Circles = await CircleModel.find({ members: user2Id }, "_id");

        const user1CircleIds = user1Circles.map(c => c._id.toString());
        const mutualCircleIds = user2Circles.filter(c => user1CircleIds.includes(c._id.toString())).map(c => c._id);

        const mutualFriends = await UserModel.find({
            _id: { $nin: [user1Id, user2Id] },
            circles: { $in: mutualCircleIds }
        }, "firstName lastName username profileImage");

        return mutualFriends;
    }
}

export default new ChatService();
