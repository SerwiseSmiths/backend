import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { complaintStages } from "../types/comlpaint.type";
declare class SocketService {
    private io;
    private userSocketMap;
    private providerEventQueue;
    initialize(server: HTTPServer): void;
    getIO(): SocketIOServer<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any> | null;
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
declare const _default: SocketService;
export default _default;
//# sourceMappingURL=socket.service.d.ts.map