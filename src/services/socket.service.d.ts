import { complaintStages } from "../types/comlpaint.type";
declare class RealtimeService {
    private supabase;
    private adminChannel;
    private userPresenceMap;
    private providerEventQueue;
    initialize(): void;
    private handleTypingStart;
    private handleTypingStop;
    private handleMessageSend;
    private handleCallInitiate;
    private handleCallRespond;
    private handleCircleInvite;
    private broadcastGlobal;
    isUserOnline(userId: string): boolean;
    private queueEventForProvider;
    private flushQueuedEvents;
    emitToUser(userId: string, event: string, data: any, notificationTitle?: string, notificationBody?: string): void;
    emitToProvider(providerId: string, event: string, data: any, shouldQueue?: boolean): void;
    emitComplaintCreated(userId: string, providerId: string, complaint: any): void;
    emitQuoteAdded(userId: string, complaint: any): void;
    emitStageChanged(userId: string, providerId: string | null, complaint: any, oldStage: complaintStages, newStage: complaintStages): void;
    emitPaymentDone(userId: string, providerId: string | null, complaint: any): void;
    emitProviderAssigned(userId: string, providerId: string, complaint: any): void;
    emitComplaintUpdated(userId: string, providerId: string | null, complaint: any, changes?: any): void;
}
declare const _default: RealtimeService;
export default _default;
//# sourceMappingURL=socket.service.d.ts.map