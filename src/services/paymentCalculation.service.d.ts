declare class PaymentCalculationService {
    /**
     * Fetch a part from Strapi by ID
     */
    private fetchPartFromStrapi;
    /**
     * Fetch multiple parts from Strapi by IDs
     */
    private fetchPartsFromStrapi;
    calculatePaymentAmount(complaintId: string): Promise<number>;
    processPaymentCompletion(complaintId: string): Promise<void>;
    /**
     * Read the persisted remaining payment amount from the complaint.
     * This is set by calculateComplaintAmount and updated after payments.
     */
    getRemainingPaymentAmount(complaintId: string): Promise<number>;
}
declare const _default: PaymentCalculationService;
export default _default;
//# sourceMappingURL=paymentCalculation.service.d.ts.map