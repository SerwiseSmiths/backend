"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSubscriptionCron = startSubscriptionCron;
const node_cron_1 = require("node-cron");
const UserSubscription_schema_1 = require("../models/schema/UserSubscription.schema");
/**
 * Runs every day at 12:10 AM (00:10).
 * Activates all "scheduled" subscriptions whose startDate has arrived.
 * Also expires "active" subscriptions past their expiryDate.
 */
function startSubscriptionCron() {
    node_cron_1.default.schedule("10 0 * * *", async () => {
        const now = new Date();
        try {
            // Activate subscriptions whose start date has arrived
            const activated = await UserSubscription_schema_1.UserSubscriptionModel.updateMany({ status: "scheduled", startDate: { $lte: now } }, { $set: { status: "active" } });
            // Expire active subscriptions past their expiry date
            const expired = await UserSubscription_schema_1.UserSubscriptionModel.updateMany({ status: "active", expiryDate: { $lte: now } }, { $set: { status: "expired" } });
            if (activated.modifiedCount > 0 || expired.modifiedCount > 0) {
                console.log(`[SubscriptionCron] Activated: ${activated.modifiedCount}, Expired: ${expired.modifiedCount}`);
            }
        }
        catch (err) {
            console.error("[SubscriptionCron] Error:", err);
        }
    });
    console.log("[SubscriptionCron] Scheduled — runs daily at midnight");
}
//# sourceMappingURL=subscription.cron.js.map