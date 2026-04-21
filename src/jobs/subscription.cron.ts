import cron from "node-cron";
import { UserSubscriptionModel } from "../models/schema/UserSubscription.schema";

/**
 * Runs every day at 12:10 AM (00:10).
 * Activates all "scheduled" subscriptions whose startDate has arrived.
 * Also expires "active" subscriptions past their expiryDate.
 */
export function startSubscriptionCron() {
    cron.schedule("10 0 * * *", async () => {
        const now = new Date();

        try {
            // Activate subscriptions whose start date has arrived
            const activated = await UserSubscriptionModel.updateMany(
                { status: "scheduled", startDate: { $lte: now } },
                { $set: { status: "active" } }
            );

            // Expire active subscriptions past their expiry date
            const expired = await UserSubscriptionModel.updateMany(
                { status: "active", expiryDate: { $lte: now } },
                { $set: { status: "expired" } }
            );

            if (activated.modifiedCount > 0 || expired.modifiedCount > 0) {
                console.log(
                    `[SubscriptionCron] Activated: ${activated.modifiedCount}, Expired: ${expired.modifiedCount}`
                );
            }
        } catch (err) {
            console.error("[SubscriptionCron] Error:", err);
        }
    });

    console.log("[SubscriptionCron] Scheduled — runs daily at midnight");
}
