"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Complaint_schema_1 = require("../models/schema/Complaint.schema");
const User_schema_1 = require("../models/schema/User.schema");
const socket_service_1 = require("./socket.service");
class ProviderAssignmentService {
    pendingAssignments = new Map();
    TIMEOUT_DURATION = 30000; // 30 seconds
    /**
     * Start provider assignment with 30-second timeout
     */
    async assignToProvider(complaintId, providerId) {
        // Clear any existing assignment for this complaint
        this.clearAssignment(complaintId);
        const expiryTime = Date.now() + this.TIMEOUT_DURATION;
        // Update complaint with provider and expiry
        await Complaint_schema_1.ComplaintModel.findByIdAndUpdate(complaintId, {
            provider: providerId,
            providerAccepted: false,
            providerAcceptedAt: null,
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
        // Fetch complaint with populated fields for popup
        const complaint = await Complaint_schema_1.ComplaintModel.findById(complaintId)
            .populate("user")
            .populate("addressId")
            .populate("deviceId");
        // Emit event to provider (include complaint so Radix can show popup)
        socket_service_1.default.emitToProvider(providerId, "complaint:assigned", {
            complaintId,
            expiryIn: this.TIMEOUT_DURATION,
            complaint: complaint ?? undefined,
        }, true);
    }
    /**
     * Provider accepts the assignment
     */
    async acceptAssignment(complaintId, providerId) {
        const assignment = this.pendingAssignments.get(complaintId);
        if (!assignment || assignment.providerId !== providerId) {
            return false; // Not assigned to this provider or already expired
        }
        // Clear timeout
        clearTimeout(assignment.timeoutId);
        this.pendingAssignments.delete(complaintId);
        // Update complaint
        await Complaint_schema_1.ComplaintModel.findByIdAndUpdate(complaintId, {
            providerAccepted: true,
            providerAcceptedAt: new Date(),
            providerAssignmentExpiry: null,
        });
        console.log(`Provider ${providerId} accepted complaint ${complaintId}`);
        // Emit acceptance event
        const complaint = await Complaint_schema_1.ComplaintModel.findById(complaintId).populate("user");
        const userId = complaint?.user?._id?.toString() || "";
        socket_service_1.default.emitToUser(userId, "complaint:provider_accepted", { complaintId, providerId }, "Provider Accepted", "A service provider has accepted your request");
        return true;
    }
    /**
     * Provider rejects the assignment
     */
    async rejectAssignment(complaintId, providerId) {
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
    async handleTimeout(complaintId, providerId) {
        console.log(`Timeout for complaint ${complaintId} - provider ${providerId} did not accept`);
        this.pendingAssignments.delete(complaintId);
        // Emit timeout event to provider
        socket_service_1.default.emitToProvider(providerId, "complaint:timeout", {
            complaintId,
        }, false);
        // Reassign to next provider
        await this.reassignToNextProvider(complaintId);
    }
    /**
     * Find next available provider (excluding rejected) and assign; if none, set provider to null.
     */
    async reassignToNextProvider(complaintId) {
        const complaint = await Complaint_schema_1.ComplaintModel.findById(complaintId).populate("user");
        if (!complaint)
            return;
        const currentProviderId = typeof complaint.provider === "object" && complaint.provider?._id
            ? complaint.provider._id.toString()
            : complaint.provider?.toString() || null;
        const rejectedIds = Array.from(complaint.rejectedProviderIds || []).map((id) => typeof id === "object" && id?._id ? id._id.toString() : id?.toString()).filter(Boolean);
        if (currentProviderId) {
            rejectedIds.push(currentProviderId);
        }
        const nextProvider = await User_schema_1.default.findOne({
            userType: "provider",
            isDeleted: false,
            _id: { $nin: rejectedIds },
        });
        if (nextProvider) {
            await Complaint_schema_1.ComplaintModel.findByIdAndUpdate(complaintId, {
                rejectedProviderIds: rejectedIds,
            });
            await this.assignToProvider(complaintId, nextProvider._id.toString());
            console.log(`Complaint ${complaintId} reassigned to provider ${nextProvider._id}`);
            return;
        }
        // No more providers: clear provider and notify user
        await Complaint_schema_1.ComplaintModel.findByIdAndUpdate(complaintId, {
            provider: null,
            providerAccepted: false,
            providerAcceptedAt: null,
            providerAssignmentExpiry: null,
            rejectedProviderIds: rejectedIds,
        });
        const userId = complaint.user?._id?.toString() || "";
        socket_service_1.default.emitToUser(userId, "complaint:provider_timeout", { complaintId }, "No Provider Available", "We couldn't find an available provider right now. We'll notify you when one is available.");
        console.log(`Complaint ${complaintId}: no more providers; provider set to empty`);
    }
    /**
     * Clear assignment for a complaint
     */
    clearAssignment(complaintId) {
        const assignment = this.pendingAssignments.get(complaintId);
        if (assignment) {
            clearTimeout(assignment.timeoutId);
            this.pendingAssignments.delete(complaintId);
        }
    }
    /**
     * Get time remaining for assignment
     */
    getTimeRemaining(complaintId) {
        const assignment = this.pendingAssignments.get(complaintId);
        if (!assignment)
            return null;
        const remaining = assignment.expiryTime - Date.now();
        return remaining > 0 ? remaining : 0;
    }
}
exports.default = new ProviderAssignmentService();
//# sourceMappingURL=providerAssignment.service.js.map