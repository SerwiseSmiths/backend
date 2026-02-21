import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import notificationService from "./notification.service";
import MessageModel from "../models/schema/Message.schema";
import CircleModel from "../models/schema/Circle.schema";
import UserModel from "../models/schema/User.schema";
import { IComplaint, complaintStages } from "../types/comlpaint.type";

// Event queue for offline providers
interface QueuedEvent {
    event: string;
    data: any;
    timestamp: number;
}

class SocketService {
    private io: SocketIOServer | null = null;
    private userSocketMap: Map<string, string> = new Map(); // userId -> socketId
    private providerEventQueue: Map<string, QueuedEvent[]> = new Map(); // providerId -> queued events

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

                // Flush queued events for this user
                this.flushQueuedEvents(userId);
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
                const {
                    senderId,
                    recipientType,
                    recipientId,
                    content,
                    type,
                    complaintId,
                } = data;

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
                                metadata: {
                                    subType: "CHAT_MESSAGE",
                                    senderId,
                                    messageId: message._id.toString(),
                                },
                            });
                        }
                    } else {
                        // Group message (Circle)
                        const circle = await CircleModel.findById(recipientId);
                        if (circle) {
                            circle.members.forEach((memberId) => {
                                if (memberId.toString() !== senderId) {
                                    const memberSocketId = this.userSocketMap.get(
                                        memberId.toString()
                                    );
                                    if (memberSocketId) {
                                        this.io
                                            ?.to(memberSocketId)
                                            .emit("message:receive", message);
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
                    this.io
                        ?.to(callerSocketId)
                        .emit("call:answered", { response, signalData });
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

    // Check if user is online
    isUserOnline(userId: string): boolean {
        return this.userSocketMap.has(userId);
    }

    // Queue event for offline provider
    private queueEventForProvider(
        providerId: string,
        event: string,
        data: any
    ): void {
        if (!this.providerEventQueue.has(providerId)) {
            this.providerEventQueue.set(providerId, []);
        }
        this.providerEventQueue.get(providerId)!.push({
            event,
            data,
            timestamp: Date.now(),
        });
    }

    // Flush queued events when user comes online
    private flushQueuedEvents(userId: string): void {
        const queuedEvents = this.providerEventQueue.get(userId);
        if (queuedEvents && queuedEvents.length > 0) {
            const socketId = this.userSocketMap.get(userId);
            if (socketId) {
                queuedEvents.forEach((qe) => {
                    this.io?.to(socketId).emit(qe.event, qe.data);
                });
                this.providerEventQueue.delete(userId);
                console.log(`Flushed ${queuedEvents.length} queued events for ${userId}`);
            }
        }
    }

    // Emit to user, with offline handling
    public emitToUser(
        userId: string,
        event: string,
        data: any,
        notificationTitle?: string,
        notificationBody?: string
    ): void {
        const socketId = this.userSocketMap.get(userId);
        if (socketId) {
            this.io?.to(socketId).emit(event, data);
        } else if (notificationTitle && notificationBody) {
            // Send push notification for offline user
            notificationService.sendNotification({
                userId,
                target: "USER",
                title: notificationTitle,
                body: notificationBody,
                type: "Service",
                metadata: { event, ...data },
            });
        }
    }

    // Emit to provider with queue for offline
    public emitToProvider(
        providerId: string,
        event: string,
        data: any,
        shouldQueue: boolean = true
    ): void {
        const socketId = this.userSocketMap.get(providerId);
        if (socketId) {
            this.io?.to(socketId).emit(event, data);
        } else if (shouldQueue) {
            this.queueEventForProvider(providerId, event, data);

            // Build FCM data payload — all values must be strings
            const fcmData: Record<string, string> = { event };
            try {
                // Serialize complaint so the app can open popup directly from tap
                if (data?.complaint) {
                    fcmData.complaint = JSON.stringify(data.complaint);
                    fcmData.complaintId = data.complaint._id?.toString() ?? '';
                }
            } catch (_) {
                // If serialization fails, still send basic notification
            }

            // Send push notification
            notificationService.sendNotification({
                userId: providerId,
                target: "USER",
                title: "New Job Available",
                body: data?.complaint?.title ?? "You have a new service request",
                type: "Service",
                metadata: fcmData,
            });
        }
    }

    // ==================== COMPLAINT EVENTS ====================

    // Emit when a new complaint is created
    emitComplaintCreated(
        userId: string,
        providerId: string,
        complaint: any
    ): void {
        const eventData = {
            complaint,
            userId,
            providerId,
            timestamp: new Date().toISOString(),
        };

        // Notify user
        this.emitToUser(
            userId,
            "complaint:created",
            eventData,
            "Complaint Created",
            "Your service request has been submitted"
        );

        // Notify provider (with queue for offline)
        this.emitToProvider(providerId, "complaint:created", eventData);
    }

    // Emit when a quote is added to complaint
    emitQuoteAdded(userId: string, complaint: any): void {
        const eventData = {
            complaint,
            quote: complaint.quote,
            timestamp: new Date().toISOString(),
        };

        this.emitToUser(
            userId,
            "complaint:quote_added",
            eventData,
            "Quote Received",
            "A quote has been added to your service request"
        );
    }

    // Emit when complaint stage changes
    emitStageChanged(
        userId: string,
        providerId: string | null,
        complaint: any,
        oldStage: complaintStages,
        newStage: complaintStages
    ): void {
        const eventData = {
            complaint,
            oldStage,
            newStage,
            timestamp: new Date().toISOString(),
        };

        // Notify user
        this.emitToUser(
            userId,
            "complaint:stage_changed",
            eventData,
            "Status Update",
            `Your service request status changed to ${newStage}`
        );

        // Notify provider if exists
        if (providerId) {
            this.emitToProvider(providerId, "complaint:stage_changed", eventData);
        }

        // Emit specific events for completed/rejected
        if (newStage === "COMPLETED") {
            this.emitToUser(
                userId,
                "complaint:completed",
                eventData,
                "Service Completed",
                "Your service request has been completed"
            );
        } else if (newStage === "REJECTED") {
            this.emitToUser(
                userId,
                "complaint:rejected",
                eventData,
                "Request Rejected",
                "Your service request was rejected"
            );
        }
    }

    // Emit when payment is done
    emitPaymentDone(
        userId: string,
        providerId: string | null,
        complaint: any
    ): void {
        const eventData = {
            complaint,
            payment: complaint.payment,
            timestamp: new Date().toISOString(),
        };

        // Notify user
        this.emitToUser(
            userId,
            "complaint:payment_done",
            eventData,
            "Payment Confirmed",
            "Your payment has been processed successfully"
        );

        // Notify provider
        if (providerId) {
            this.emitToProvider(providerId, "complaint:payment_done", eventData);
        }
    }

    // Emit when provider is assigned
    emitProviderAssigned(
        userId: string,
        providerId: string,
        complaint: any
    ): void {
        const eventData = {
            complaint,
            provider: providerId,
            timestamp: new Date().toISOString(),
        };

        // Notify user
        this.emitToUser(
            userId,
            "complaint:provider_assigned",
            eventData,
            "Provider Assigned",
            "A service provider has been assigned to your request"
        );

        // Notify provider
        this.emitToProvider(providerId, "complaint:provider_assigned", eventData);
    }

    // Emit general complaint update
    emitComplaintUpdated(
        userId: string,
        providerId: string | null,
        complaint: any,
        changes?: any
    ): void {
        const eventData = {
            complaint,
            changes,
            timestamp: new Date().toISOString(),
        };

        // Notify user
        this.emitToUser(userId, "complaint:updated", eventData);

        // Notify provider if exists
        if (providerId) {
            this.emitToProvider(providerId, "complaint:updated", eventData);
        }
    }
}

export default new SocketService();
