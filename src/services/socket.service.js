"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const notification_service_1 = require("./notification.service");
const Message_schema_1 = require("../models/schema/Message.schema");
const Circle_schema_1 = require("../models/schema/Circle.schema");
class RealtimeService {
    supabase = null;
    adminChannel = null;
    userPresenceMap = new Map(); // userId -> online
    providerEventQueue = new Map(); // providerId -> queued events
    initialize() {
        const supabaseUrl = process.env.SUPABASE_URL || "";
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
        if (!supabaseUrl || !supabaseKey) {
            console.error("Supabase config missing in backend!");
            return;
        }
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
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
    async handleTypingStart(data) {
        const { userId, targetId, targetType = "User" } = data;
        if (targetType === "User") {
            this.emitToUser(targetId, "typing:start", { userId });
        }
        else {
            const circle = await Circle_schema_1.default.findById(targetId);
            if (circle) {
                circle.members.forEach((memberId) => {
                    if (memberId.toString() !== userId) {
                        this.emitToUser(memberId.toString(), "typing:start", { userId, targetId });
                    }
                });
            }
        }
    }
    async handleTypingStop(data) {
        const { userId, targetId, targetType = "User" } = data;
        if (targetType === "User") {
            this.emitToUser(targetId, "typing:stop", { userId });
        }
        else {
            const circle = await Circle_schema_1.default.findById(targetId);
            if (circle) {
                circle.members.forEach((memberId) => {
                    if (memberId.toString() !== userId) {
                        this.emitToUser(memberId.toString(), "typing:stop", { userId, targetId });
                    }
                });
            }
        }
    }
    async handleMessageSend(data) {
        const { senderId, recipientType, recipientId, content, type, complaintId } = data;
        try {
            const message = await Message_schema_1.default.create({
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
            }
            else {
                const circle = await Circle_schema_1.default.findById(recipientId);
                if (circle) {
                    circle.members.forEach((memberId) => {
                        if (memberId.toString() !== senderId) {
                            this.emitToUser(memberId.toString(), "message:receive", message);
                        }
                    });
                }
            }
        }
        catch (error) {
            console.error("Message send error:", error);
        }
    }
    handleCallInitiate(data) {
        const { callerId, recipientId, callType, signalData } = data;
        this.emitToUser(recipientId, "call:incoming", { callerId, callType, signalData });
    }
    handleCallRespond(data) {
        const { callerId, response, signalData } = data;
        this.emitToUser(callerId, "call:answered", { response, signalData });
    }
    async handleCircleInvite(data) {
        const { senderId, recipientId, circleId } = data;
        this.emitToUser(recipientId, "circle:invitation", { senderId, circleId });
    }
    // Helper to broadcast to a global channel (matching socket.broadcast.emit)
    broadcastGlobal(event, payload) {
        this.supabase?.channel('global').send({
            type: 'broadcast',
            event,
            payload,
        });
    }
    isUserOnline(userId) {
        // This is a naive implementation; ideally we'd track presence sync.
        // For now, we'll return true if their last auth was recent.
        return this.userPresenceMap.has(userId);
    }
    queueEventForProvider(providerId, event, data) {
        if (!this.providerEventQueue.has(providerId)) {
            this.providerEventQueue.set(providerId, []);
        }
        this.providerEventQueue.get(providerId).push({ event, data, timestamp: Date.now() });
    }
    flushQueuedEvents(userId) {
        const queuedEvents = this.providerEventQueue.get(userId);
        if (queuedEvents && queuedEvents.length > 0) {
            queuedEvents.forEach((qe) => this.emitToUser(userId, qe.event, qe.data));
            this.providerEventQueue.delete(userId);
        }
    }
    emitToUser(userId, event, data, notificationTitle, notificationBody) {
        // Send via Supabase Channel
        this.supabase?.channel(`user:${userId}`).send({
            type: 'broadcast',
            event,
            payload: data,
        });
        // Always send push notification as fallback/complement
        if (notificationTitle && notificationBody) {
            notification_service_1.default.sendNotification({
                userId,
                target: "USER",
                title: notificationTitle,
                body: notificationBody,
                type: "Service",
                metadata: { event, ...data },
            }).catch(err => console.error("FCM Error:", err));
        }
    }
    emitToProvider(providerId, event, data, shouldQueue = true) {
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
        const fcmData = { event };
        if (data?.complaint) {
            fcmData.complaint = JSON.stringify(data.complaint);
            fcmData.complaintId = data.complaint._id?.toString() ?? '';
        }
        notification_service_1.default.sendNotification({
            userId: providerId,
            target: "USER",
            title: "New Job Available",
            body: data?.complaint?.title ?? "You have a new service request",
            type: "Service",
            metadata: fcmData,
        });
    }
    // ==================== COMPLAINT EVENTS ====================
    emitComplaintCreated(userId, providerId, complaint) {
        const eventData = { complaint, userId, providerId, timestamp: new Date().toISOString() };
        this.emitToUser(userId, "complaint:created", eventData, "Complaint Created", "Your service request has been submitted");
        this.emitToProvider(providerId, "complaint:created", eventData);
    }
    emitQuoteAdded(userId, complaint) {
        const eventData = { complaint, quote: complaint.quote, timestamp: new Date().toISOString() };
        this.emitToUser(userId, "complaint:quote_added", eventData, "Quote Received", "A quote has been added to your service request");
    }
    emitStageChanged(userId, providerId, complaint, oldStage, newStage) {
        const eventData = { complaint, oldStage, newStage, timestamp: new Date().toISOString() };
        this.emitToUser(userId, "complaint:stage_changed", eventData, "Status Update", `Your service request status changed to ${newStage}`);
        if (providerId)
            this.emitToProvider(providerId, "complaint:stage_changed", eventData);
        if (newStage === "COMPLETED") {
            this.emitToUser(userId, "complaint:completed", eventData, "Service Completed", "Your service request has been completed");
        }
        else if (newStage === "REJECTED") {
            this.emitToUser(userId, "complaint:rejected", eventData, "Request Rejected", "Your service request was rejected");
        }
    }
    emitPaymentDone(userId, providerId, complaint) {
        const eventData = { complaint, payment: complaint.payment, timestamp: new Date().toISOString() };
        this.emitToUser(userId, "complaint:payment_done", eventData, "Payment Confirmed", "Your payment has been processed successfully");
        if (providerId)
            this.emitToProvider(providerId, "complaint:payment_done", eventData);
    }
    emitProviderAssigned(userId, providerId, complaint) {
        const eventData = { complaint, provider: providerId, timestamp: new Date().toISOString() };
        this.emitToUser(userId, "complaint:provider_assigned", eventData, "Provider Assigned", "A service provider has been assigned to your request");
        this.emitToProvider(providerId, "complaint:provider_assigned", eventData);
    }
    emitComplaintUpdated(userId, providerId, complaint, changes) {
        const eventData = { complaint, changes, timestamp: new Date().toISOString() };
        this.emitToUser(userId, "complaint:updated", eventData);
        if (providerId)
            this.emitToProvider(providerId, "complaint:updated", eventData);
    }
}
exports.default = new RealtimeService();
//# sourceMappingURL=socket.service.js.map