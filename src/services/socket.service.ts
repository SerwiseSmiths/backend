import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import notificationService from "./notification.service";
import MessageModel from "../models/schema/Message.schema";
import CircleModel from "../models/schema/Circle.schema";
import UserModel from "../models/schema/User.schema";

class SocketService {
    private io: SocketIOServer | null = null;
    private userSocketMap: Map<string, string> = new Map(); // userId -> socketId

    initialize(server: HTTPServer) {
        this.io = new SocketIOServer(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });

        this.io.on("connection", (socket: Socket) => {
            console.log(`Socket connected: ${socket.id}`);

            socket.on("auth", (userId: string) => {
                this.userSocketMap.set(userId, socket.id);
                console.log(`User ${userId} authenticated with socket ${socket.id}`);
            });

            socket.on("disconnect", () => {
                // Remove from map
                for (const [userId, socketId] of this.userSocketMap.entries()) {
                    if (socketId === socket.id) {
                        this.userSocketMap.delete(userId);
                        console.log(`User ${userId} disconnected`);
                        break;
                    }
                }
            });

            // --- Messaging ---
            socket.on("message:send", async (data: any) => {
                const { senderId, recipientType, recipientId, content, type, complaintId } = data;

                try {
                    const message = await MessageModel.create({
                        sender: senderId,
                        recipientType,
                        recipientId,
                        content,
                        type,
                        complaintId,
                    });

                    if (recipientType === "User") {
                        const recipientSocketId = this.userSocketMap.get(recipientId);
                        if (recipientSocketId) {
                            this.io?.to(recipientSocketId).emit("message:receive", message);
                        } else {
                            // User is offline, send FCM
                            await notificationService.sendNotification({
                                userId: recipientId,
                                target: "USER",
                                title: "New Message",
                                body: content,
                                type: "Circles",
                                metadata: { subType: "CHAT_MESSAGE", senderId, messageId: message._id.toString() },

                            });
                        }
                    } else {
                        // Group message (Circle)
                        const circle = await CircleModel.findById(recipientId);
                        if (circle) {
                            circle.members.forEach((memberId) => {
                                if (memberId.toString() !== senderId) {
                                    const memberSocketId = this.userSocketMap.get(memberId.toString());
                                    if (memberSocketId) {
                                        this.io?.to(memberSocketId).emit("message:receive", message);
                                    }
                                }
                            });
                        }
                    }
                } catch (error) {
                    console.error("Message send error:", error);
                }
            });

            // --- Calling (Signaling) ---
            socket.on("call:initiate", (data: any) => {
                const { callerId, recipientId, callType, signalData } = data;
                const recipientSocketId = this.userSocketMap.get(recipientId);

                if (recipientSocketId) {
                    this.io?.to(recipientSocketId).emit("call:incoming", {
                        callerId,
                        callType,
                        signalData,
                    });
                } else {
                    // Send FCM for incoming call
                    notificationService.sendNotification({
                        userId: recipientId,
                        target: "USER",
                        title: `Incoming ${callType} Call`,
                        body: "Someone is calling you...",
                        type: "Service",
                        metadata: { subType: "CALL_INCOMING", callerId, callType },

                    });
                }
            });

            socket.on("call:respond", (data: any) => {
                const { callerId, response, signalData } = data;
                const callerSocketId = this.userSocketMap.get(callerId);
                if (callerSocketId) {
                    this.io?.to(callerSocketId).emit("call:answered", { response, signalData });
                }
            });

            // --- Invitations ---
            socket.on("circle:invite", async (data: any) => {
                const { senderId, recipientId, circleId } = data;
                const recipientSocketId = this.userSocketMap.get(recipientId);

                if (recipientSocketId) {
                    this.io?.to(recipientSocketId).emit("circle:invitation", {
                        senderId,
                        circleId,
                    });
                } else {
                    await notificationService.sendNotification({
                        userId: recipientId,
                        target: "USER",
                        title: "Circle Invitation",
                        body: "You've been invited to join a circle!",
                        type: "Circles",
                        metadata: { subType: "CIRCLE_INVITATION", senderId, circleId },

                    });
                }
            });
        });
    }

    getIO() {
        return this.io;
    }
}

export default new SocketService();
