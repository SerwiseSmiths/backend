/**
 * Payment Calculation Service
 * Calculates payment amount for complaints considering subscriptions
 */
declare class PaymentCalculationService {
    /**
     * Fetch a part from Strapi by ID
     */
    private fetchPartFromStrapi;
    /**
     * Fetch multiple parts from Strapi by IDs
     */
    private fetchPartsFromStrapi;
    /**
     * Fetch subscription details from Strapi by plan type
     */
    private fetchSubscriptionFromStrapi;
    /**
     * Get subscription services/parts IDs that are included in the subscription
     */
    private getSubscriptionIncludedIds;
    /**
     * Calculate payment amount for a complaint
     * - If complaint has subscription, get related services from subscription type from Strapi
     * - For subscription services, cost is zero
     * - For remaining services, cost should be considered from Strapi
     * - Result is cached in complaint to avoid recalculation
     */
    calculatePaymentAmount(complaintId: string): Promise<number>;
    /**
     * Get remaining payment amount (after any cash collected)
     */
    getRemainingPaymentAmount(complaintId: string): Promise<number>;
    /**
     * Recalculate payment amount (force recalculation, ignore cache)
     */
    recalculatePaymentAmount(complaintId: string): Promise<number>;
}
declare const _default: PaymentCalculationService;
export default _default;
//# sourceMappingURL=paymentCalculation.service.d.ts.map