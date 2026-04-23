declare class ProviderAssignmentService {
    private pendingAssignments;
    private readonly TIMEOUT_DURATION;
    /**
     * Start provider assignment with 30-second timeout
     */
    assignToProvider(complaintId: string, providerId: string): Promise<void>;
    /**
     * Provider accepts the assignment
     */
    acceptAssignment(complaintId: string, providerId: string): Promise<boolean>;
    /**
     * Provider rejects the assignment
     */
    rejectAssignment(complaintId: string, providerId: string): Promise<void>;
    /**
     * Handle timeout - reassign to next provider
     */
    private handleTimeout;
    /**
     * Find next available provider (excluding rejected) and assign; if none, set provider to null.
     */
    private reassignToNextProvider;
    /**
     * Clear assignment for a complaint
     */
    private clearAssignment;
    /**
     * Get time remaining for assignment
     */
    getTimeRemaining(complaintId: string): number | null;
}
declare const _default: ProviderAssignmentService;
export default _default;
//# sourceMappingURL=providerAssignment.service.d.ts.map