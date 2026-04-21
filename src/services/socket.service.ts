import { createClient, SupabaseClient, RealtimeChannel } from "@supabase/supabase-js";
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

class RealtimeService {
    private supabase: SupabaseClient | null = null;
    private adminChannel: RealtimeChannel | null = null;
    private userPresenceMap: Map<string, boolean> = new Map(); // userId -> online
    private providerEventQueue: Map<string, QueuedEvent[]> = new Map(); // providerId -> queued events

    initialize() {
        const supabaseUrl = process.env.SUPABASE_URL || "";
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

        if (!supabaseUrl || !supabaseKey) {
            console.error("Supabase config missing in backend!");
            return;
        }

        this.supabase = createClient(supabaseUrl, supabaseKey);

        // Subscribe to a global channel for system-wide actions and presence
        this.adminChannel = this.supabase.channel('admin:actions', {
            config: {
                presence: {
                    key: 'server',
                },
            },
        });

        this.adminChannel
            .on('presence', { event: 'sync' }, () => {
                const state = this.adminChannel?.presenceState();
                console.log('Presence sync:', state);
                // We'll update our local presence map based on client presence channels
                // In Supabase, we'd typically subscribe to each user channel or use a global one
            })
            .on('broadcast', { event: 'auth' }, (payload) => {
                const { userId } = payload;
                this.userPresenceMap.set(userId, true);
                console.log(`User ${userId} authenticated via Realtime`);
                this.flushQueuedEvents(userId);
                
                // Broadcast presence change to other users
                this.broadcastGlobal("presence:change", { userId, online: true });
            })
            .on('broadcast', { event: 'typing:start' }, (payload) => {
                this.handleTypingStart(payload);
            })
            .on('broadcast', { event: 'typing:stop' }, (payload) => {
                this.handleTypingStop(payload);
            })
            .on('broadcast', { event: 'message:send' }, (payload) => {
                this.handleMessageSend(payload);
            })
            .on('broadcast', { event: 'call:initiate' }, (payload) => {
                this.handleCallInitiate(payload);
            })
            .on('broadcast', { event: 'call:respond' }, (payload) => {
                this.handleCallRespond(payload);
            })
            .on('broadcast', { event: 'circle:invite' }, (payload) => {
                this.handleCircleInvite(payload);
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('✅ Connected to Supabase Realtime (Admin Channel)');
                }
            });
    }

    private async handleTypingStart(data: any) {
        const { userId, targetId, targetType = "User" } = data;
        if (targetType === "User") {
            this.emitToUser(targetId, "typing:start", { userId });
        } else {
            const circle = await CircleModel.findById(targetId);
            if (circle) {
                circle.members.forEach((memberId) => {
                    if (memberId.toString() !== userId) {
                        this.emitToUser(memberId.toString(), "typing:start", { userId, targetId });
                    }
                });
            }
        }
    }

    private async handleTypingStop(data: any) {
        const { userId, targetId, targetType = "User" } = data;
        if (targetType === "User") {
            this.emitToUser(targetId, "typing:stop", { userId });
        } else {
            const circle = await CircleModel.findById(targetId);
            if (circle) {
                circle.members.forEach((memberId) => {
                    if (memberId.toString() !== userId) {
                        this.emitToUser(memberId.toString(), "typing:stop", { userId, targetId });
                    }
                });
            }
        }
    }

    private async handleMessageSend(data: any) {
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
                this.emitToUser(recipientId, "message:receive", message);
                // If user is offline (optional check here, but emitToUser handles notifications)
                // In Supabase, if they aren't subscribed, broadcast just fails silently or isn't picked up.
                // notificationService handles the offline case inside emitToUser logic.
            } else {
                const circle = await CircleModel.findById(recipientId);
                if (circle) {
                    circle.members.forEach((memberId) => {
                        if (memberId.toString() !== senderId) {
                            this.emitToUser(memberId.toString(), "message:receive", message);
                        }
                    });
                }
            }
        } catch (error) {
            console.error("Message send error:", error);
        }
    }

    private handleCallInitiate(data: any) {
        const { callerId, recipientId, callType, signalData } = data;
        this.emitToUser(recipientId, "call:incoming", { callerId, callType, signalData });
    }

    private handleCallRespond(data: any) {
        const { callerId, response, signalData } = data;
        this.emitToUser(callerId, "call:answered", { response, signalData });
    }

    private async handleCircleInvite(data: any) {
        const { senderId, recipientId, circleId } = data;
        this.emitToUser(recipientId, "circle:invitation", { senderId, circleId });
    }

    // Helper to broadcast to a global channel (matching socket.broadcast.emit)
    private broadcastGlobal(event: string, payload: any) {
        this.supabase?.channel('global').send({
            type: 'broadcast',
            event,
            payload,
        });
    }

    public isUserOnline(userId: string): boolean {
        // This is a naive implementation; ideally we'd track presence sync.
        // For now, we'll return true if their last auth was recent.
        return this.userPresenceMap.has(userId);
    }

    private queueEventForProvider(providerId: string, event: string, data: any): void {
        if (!this.providerEventQueue.has(providerId)) {
            this.providerEventQueue.set(providerId, []);
        }
        this.providerEventQueue.get(providerId)!.push({ event, data, timestamp: Date.now() });
    }

    private flushQueuedEvents(userId: string): void {
        const queuedEvents = this.providerEventQueue.get(userId);
        if (queuedEvents && queuedEvents.length > 0) {
            queuedEvents.forEach((qe) => this.emitToUser(userId, qe.event, qe.data));
            this.providerEventQueue.delete(userId);
        }
    }

    public emitToUser(userId: string, event: string, data: any, notificationTitle?: string, notificationBody?: string): void {
        // Send via Supabase Channel
        this.supabase?.channel(`user:${userId}`).send({
            type: 'broadcast',
            event,
            payload: data,
        });

        // Always send push notification as fallback/complement
        if (notificationTitle && notificationBody) {
            notificationService.sendNotification({
                userId,
                target: "USER",
                title: notificationTitle,
                body: notificationBody,
                type: "Service",
                metadata: { event, ...data },
            }).catch(err => console.error("FCM Error:", err));
        }
    }

    public emitToProvider(providerId: string, event: string, data: any, shouldQueue: boolean = true): void {
        // Send via Supabase Channel
        this.supabase?.channel(`user:${providerId}`).send({
            type: 'broadcast',
            event,
            payload: data,
        });

        if (shouldQueue && !this.isUserOnline(providerId)) {
            this.queueEventForProvider(providerId, event, data);
        }

        // Send Push Notification
        const fcmData: Record<string, string> = { event };
        if (data?.complaint) {
            fcmData.complaint = JSON.stringify(data.complaint);
            fcmData.complaintId = data.complaint._id?.toString() ?? '';
        }

        notificationService.sendNotification({
            userId: providerId,
            target: "USER",
            title: "New Job Available",
            body: data?.complaint?.title ?? "You have a new service request",
            type: "Service",
            metadata: fcmData,
        });
    }

    // ==================== COMPLAINT EVENTS ====================

    emitComplaintCreated(userId: string, providerId: string, complaint: any): void {
        const eventData = { complaint, userId, providerId, timestamp: new Date().toISOString() };
        this.emitToUser(userId, "complaint:created", eventData, "Complaint Created", "Your service request has been submitted");
        this.emitToProvider(providerId, "complaint:created", eventData);
    }

    emitQuoteAdded(userId: string, complaint: any): void {
        const eventData = { complaint, quote: complaint.quote, timestamp: new Date().toISOString() };
        this.emitToUser(userId, "complaint:quote_added", eventData, "Quote Received", "A quote has been added to your service request");
    }

    emitStageChanged(userId: string, providerId: string | null, complaint: any, oldStage: complaintStages, newStage: complaintStages): void {
        const eventData = { complaint, oldStage, newStage, timestamp: new Date().toISOString() };
        this.emitToUser(userId, "complaint:stage_changed", eventData, "Status Update", `Your service request status changed to ${newStage}`);
        if (providerId) this.emitToProvider(providerId, "complaint:stage_changed", eventData);

        if (newStage === "COMPLETED") {
            this.emitToUser(userId, "complaint:completed", eventData, "Service Completed", "Your service request has been completed");
        } else if (newStage === "REJECTED") {
            this.emitToUser(userId, "complaint:rejected", eventData, "Request Rejected", "Your service request was rejected");
        }
    }

    emitPaymentDone(userId: string, providerId: string | null, complaint: any): void {
        const eventData = { complaint, payment: complaint.payment, timestamp: new Date().toISOString() };
        this.emitToUser(userId, "complaint:payment_done", eventData, "Payment Confirmed", "Your payment has been processed successfully");
        if (providerId) this.emitToProvider(providerId, "complaint:payment_done", eventData);
    }

    emitProviderAssigned(userId: string, providerId: string, complaint: any): void {
        const eventData = { complaint, provider: providerId, timestamp: new Date().toISOString() };
        this.emitToUser(userId, "complaint:provider_assigned", eventData, "Provider Assigned", "A service provider has been assigned to your request");
        this.emitToProvider(providerId, "complaint:provider_assigned", eventData);
    }

    emitComplaintUpdated(userId: string, providerId: string | null, complaint: any, changes?: any): void {
        const eventData = { complaint, changes, timestamp: new Date().toISOString() };
        this.emitToUser(userId, "complaint:updated", eventData);
        if (providerId) this.emitToProvider(providerId, "complaint:updated", eventData);
    }
}

export default new RealtimeService();
