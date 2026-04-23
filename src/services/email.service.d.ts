declare class EmailService {
    private transporter;
    private adminEmail;
    constructor();
    /**
     * Lazy initialize transporter
     */
    private getTransporter;
    /**
     * Generate a secure verification token
     */
    generateVerificationToken(): string;
    /**
     * Send payment verification email to admin
     */
    sendPaymentVerificationEmail(complaintId: string, customerName: string, amount: number, verificationToken: string): Promise<void>;
}
declare const _default: EmailService;
export default _default;
//# sourceMappingURL=email.service.d.ts.map