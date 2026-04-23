/**
 * Telegram Notification Service
 * Sends formatted event notifications to a Telegram bot.
 *
 * Env vars required:
 *   TELEGRAM_BOT_TOKEN  — bot token from @BotFather
 *   TELEGRAM_CHAT_ID    — target chat / channel / group ID
 */
export declare function notifyNewUser(user: any): Promise<void>;
export declare function notifyComplaintCreated(complaint: any): Promise<void>;
export declare function notifyComplaintUpdated(complaint: any, changes?: Record<string, any>): Promise<void>;
export declare function notifySubscriptionCreated(sub: any): Promise<void>;
export declare function notifyWaitlistJoin(params: {
    phoneNo: string;
    countryCode: string;
    source: string;
    joinedAt: Date | string;
}): Promise<void>;
export declare function notifyPaymentVerified(params: {
    sub: any;
    amountRupees: number;
    paymentId: string;
    paymentRef: string;
}): Promise<void>;
//# sourceMappingURL=telegram.service.d.ts.map