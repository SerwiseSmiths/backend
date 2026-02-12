import { ComplaintModel } from "../models/schema/Complaint.schema";
import socketService from "./socket.service";

interface PendingAssignment {
    complaintId: string;
    providerId: string;
    expiryTime: number; // Timestamp
    timeoutId: NodeJS.Timeout;
}

class ProviderAssignmentService {
    private pendingAssignments: Map<string, PendingAssignment> = new Map();
    private readonly TIMEOUT_DURATION = 30000; // 30 seconds

    /**
     * Start provider assignment with 30-second timeout
     */
    async assignToProvider(complaintId: string, providerId: string): Promise<void> {
        // Clear any existing assignment for this complaint
        this.clearAssignment(complaintId);

        const expiryTime = Date.now() + this.TIMEOUT_DURATION;

        // Update complaint with provider and expiry
        await ComplaintModel.findByIdAndUpdate(complaintId, {
            provider: providerId,
            providerAccepted: false,
            providerAssignmentExpiry: new Date(expiryTime),
        });

        // Set timeout for auto-reassignment
        const timeoutId = setTimeout(() => {
            this.handleTimeout(complaintId, providerId);
        }, this.TIMEOUT_DURATION);

        // Store pending assignment
        this.pendingAssignments.set(complaintId, {
            complaintId,
            providerId,
            expiryTime,
            timeoutId,
        });

        console.log(`Complaint ${complaintId} assigned to provider ${providerId} with 30s timeout`);

        // Emit event to provider
        socketService.emitToProvider(providerId, "complaint:assigned", {
            complaintId,
            expiryIn: this.TIMEOUT_DURATION,
        }, true);
    }

    /**
     * Provider accepts the assignment
     */
    async acceptAssignment(complaintId: string, providerId: string): Promise<boolean> {
        const assignment = this.pendingAssignments.get(complaintId);

        if (!assignment || assignment.providerId !== providerId) {
            return false; // Not assigned to this provider or already expired
        }

        // Clear timeout
        clearTimeout(assignment.timeoutId);
        this.pendingAssignments.delete(complaintId);

        // Update complaint
        await ComplaintModel.findByIdAndUpdate(complaintId, {
            providerAccepted: true,
            providerAcceptedAt: new Date(),
            providerAssignmentExpiry: null,
        });

        console.log(`Provider ${providerId} accepted complaint ${complaintId}`);

        // Emit acceptance event
        const complaint = await ComplaintModel.findById(complaintId).populate("user");
        const userId = (complaint?.user as any)?._id?.toString() || "";

        socketService.emitToUser(
            userId,
            "complaint:provider_accepted",
            { complaintId, providerId },
            "Provider Accepted",
            "A service provider has accepted your request"
        );

        return true;
    }

    /**
     * Provider rejects the assignment
     */
    async rejectAssignment(complaintId: string, providerId: string): Promise<void> {
        const assignment = this.pendingAssignments.get(complaintId);

        if (!assignment || assignment.providerId !== providerId) {
            return; // Not assigned to this provider
        }

        // Clear timeout
        clearTimeout(assignment.timeoutId);
        this.pendingAssignments.delete(complaintId);

        console.log(`Provider ${providerId} rejected complaint ${complaintId}`);

        // Reassign to next provider immediately
        await this.reassignToNextProvider(complaintId);
    }

    /**
     * Handle timeout - reassign to next provider
     */
    private async handleTimeout(complaintId: string, providerId: string): Promise<void> {
        console.log(`Timeout for complaint ${complaintId} - provider ${providerId} did not accept`);

        this.pendingAssignments.delete(complaintId);

        // Emit timeout event to provider
        socketService.emitToProvider(providerId, "complaint:timeout", {
            complaintId,
        }, false);

        // Reassign to next provider
        await this.reassignToNextProvider(complaintId);
    }

    /**
     * Find next available provider and assign
     */
    private async reassignToNextProvider(complaintId: string): Promise<void> {
        // TODO: Implement logic to find next available provider
        // For now, just update complaint to remove current provider
        const complaint = await ComplaintModel.findById(complaintId).populate("user");
        if (!complaint) return;

        await ComplaintModel.findByIdAndUpdate(complaintId, {
            provider: null,
            providerAccepted: false,
            providerAcceptedAt: null,
            providerAssignmentExpiry: null,
        });

        const userId = (complaint.user as any)?._id?.toString() || "";

        // Notify customer that we're finding another provider
        socketService.emitToUser(
            userId,
            "complaint:provider_timeout",
            { complaintId },
            "Finding New Provider",
            "Previous provider didn't respond. Finding another service provider..."
        );

        // TODO: Trigger provider matching logic here
        console.log(`Complaint ${complaintId} ready for reassignment`);
    }

    /**
     * Clear assignment for a complaint
     */
    private clearAssignment(complaintId: string): void {
        const assignment = this.pendingAssignments.get(complaintId);
        if (assignment) {
            clearTimeout(assignment.timeoutId);
            this.pendingAssignments.delete(complaintId);
        }
    }

    /**
     * Get time remaining for assignment
     */
    getTimeRemaining(complaintId: string): number | null {
        const assignment = this.pendingAssignments.get(complaintId);
        if (!assignment) return null;

        const remaining = assignment.expiryTime - Date.now();
        return remaining > 0 ? remaining : 0;
    }
}

export default new ProviderAssignmentService();
