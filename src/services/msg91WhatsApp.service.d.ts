export interface SendWhatsAppTextOptions {
    /** Recipient mobile number with country code (e.g. 919876543210) */
    recipientNumber: string;
    /**
     * Value for template variable (e.g. OTP code).
     * Mapped to MSG91 body_var_1.
     */
    text: string;
}
/**
 * Send a text message via MSG91 WhatsApp (session-based outbound message).
 * Ref: https://docs.msg91.com/whatsapp/send-message-in-text
 *
 * Requires a 24h session to be started with the recipient (user must have
 * messaged the business number first, or use Send WhatsApp Template for OTP).
 */
export declare const sendWhatsAppText: (options: SendWhatsAppTextOptions) => Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
}>;
//# sourceMappingURL=msg91WhatsApp.service.d.ts.map