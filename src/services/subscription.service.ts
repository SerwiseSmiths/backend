/**
 * @file subscription.service.ts
 * @description Business logic for Subscription Management (Rebuilt)
 */

import ApiError from "../utils/api/ApiError.api.util";
import ApiSuccess from "../utils/api/ApiSuccess.api.util";
import { UserSubscriptionModel, IUserSubscription } from "../models/schema/UserSubscription.schema";
import { SubscriptionUsageModel } from "../models/schema/SubscriptionUsage.schema";
import { SubscriptionPaymentModel } from "../models/schema/SubscriptionPayment.schema";
import * as strapiService from "./strapi.service";

/** PURCHASE SUBSCRIPTION */
export async function purchaseSubscription(
  userId: mongodbId,
  body: {
    planId: string; // Strapi documentId
    startDate: string; // ISO String
    paymentModel: "flat" | "metered";
    addonIds?: string[]; // Optional Array of Addon Document IDs
  }
): Promise<ApiSuccess<IUserSubscription>> {
  const { planId, startDate, paymentModel, addonIds = [] } = body;

  // 1. Fetch plan from Strapi with full population for component and relations
  const plan = await strapiService.fetchFromStrapi(`/subscriptions/${planId}?populate[serviceMapping][populate][parts]=*`);
  if (!plan || !plan.data) throw new ApiError(404, "Plan not found in CMS");

  const planAttributes = plan.data.attributes || plan.data;
  
  let addonsTotalSales = 0;
  let addonsSnapshot = [];
  if (addonIds.length > 0) {
    for (const addonId of addonIds) {
      const addonRes = await strapiService.fetchFromStrapi(`/subscriptions/${addonId}`);
      if (addonRes?.data) {
        const addonAttr = addonRes.data.attributes || addonRes.data;
        addonsTotalSales += addonAttr.sub_sales;
        addonsSnapshot.push({
          name: addonAttr.name,
          pricing: {
            cost: addonAttr.cost,
            sub_sales: addonAttr.sub_sales,
            non_sub_sales: addonAttr.non_sub_sales,
            sub_profit: addonAttr.sub_profit,
            non_sub_profit: addonAttr.non_sub_profit,
          }
        });
      }
    }
  }

  const start = new Date(startDate);
  const expiry = new Date(start);
  expiry.setMonth(start.getMonth() + planAttributes.validityDuration);

  // 2. Create UserSubscription with snapshot
  const subData: Partial<IUserSubscription> = {
    user: userId,
    plan_snapshot: {
      name: planAttributes.name,
      plan_type: planAttributes.plan_type,
      totalServices: planAttributes.totalServices,
      serviceMapping: planAttributes.serviceMapping, // JSON from Strapi
      pricing: {
        cost: planAttributes.cost,
        sub_sales: planAttributes.sub_sales,
        non_sub_sales: planAttributes.non_sub_sales,
        sub_profit: planAttributes.sub_profit,
        non_sub_profit: planAttributes.non_sub_profit,
      },
      maxDiscount: planAttributes.maxDiscount,
      lockInPeriod: planAttributes.lockInPeriod,
      validityDuration: planAttributes.validityDuration,
    },
    startDate: start,
    expiryDate: expiry,
    // Status and payment are always "pending" on creation.
    // The Razorpay webhook activates the subscription once payment is confirmed.
    status: "pending",
    paymentModel,
    paymentStatus: "pending",
    totalPaid: 0,
    remainingAmount: planAttributes.sub_sales + addonsTotalSales,
    addons_snapshot: addonsSnapshot,
  };

  const newSub = await UserSubscriptionModel.create(subData);

  // Cashback is credited by the Razorpay webhook once payment is confirmed.
  return new ApiSuccess<IUserSubscription>(201, "Subscription registered. Awaiting payment.", newSub);
}

/** GET USER SUBSCRIPTIONS */
export async function retrieveSubscriptionsByUser(userId: mongodbId) {
  const subs = await UserSubscriptionModel.find({ user: userId }).sort({ createdAt: -1 });
  return new ApiSuccess(200, "User subscriptions retrieved", subs);
}

/** VALIDATE USAGE FOR COMPLAINT */
export async function validateSubscriptionForComplaint(
  userId: mongodbId,
  userSubscriptionId: mongodbId
) {
  const sub = await UserSubscriptionModel.findById(userSubscriptionId);
  if (!sub) throw new ApiError(404, "Subscription not found");

  if (sub.user.toString() !== userId.toString()) 
    throw new ApiError(403, "Unauthorized: Subscription does not belong to user");

  if (sub.status !== "active")
    throw new ApiError(400, `Subscription is ${sub.status}`);

  if (new Date() > sub.expiryDate) {
    sub.status = "expired";
    await sub.save();
    throw new ApiError(400, "Subscription has expired");
  }

  // Count usage
  const usageCount = await SubscriptionUsageModel.countDocuments({ subscription: userSubscriptionId });
  if (usageCount >= sub.plan_snapshot.totalServices) {
    sub.status = "expired"; // Mark as expired if usage exhausted
    await sub.save();
    throw new ApiError(400, "All services in this plan have been used");
  }

  const nextIndex = usageCount + 1;
  const mapping = sub.plan_snapshot.serviceMapping?.find((m: any) => m.usageIndex === nextIndex);

  return new ApiSuccess(200, "Subscription is valid", {
    subscription: sub,
    nextIndex,
    mapping,
  });
}

/** RECORD USAGE (After service completion) */
export async function recordUsage(
  subscriptionId: mongodbId,
  complaintId: mongodbId,
  serviceIndex: number
) {
  const sub = await UserSubscriptionModel.findById(subscriptionId);
  if (!sub) throw new ApiError(404, "Subscription not found");

  const usage = await SubscriptionUsageModel.create({
    subscription: subscriptionId,
    user: sub.user,
    complaint: complaintId,
    serviceIndex,
    usedAt: new Date(),
  });

  // Check if this was the last service
  const usageCount = await SubscriptionUsageModel.countDocuments({ subscription: subscriptionId });
  if (usageCount >= sub.plan_snapshot.totalServices) {
    sub.status = "expired";
    await sub.save();
  }

  return usage;
}

/** RECORD PAYMENT */
export async function recordSubscriptionPayment(
  subscriptionId: mongodbId,
  amount: number,
  type: "upfront" | "metered_emi" | "metered_completion",
  ref: string
) {
  const sub = await UserSubscriptionModel.findById(subscriptionId);
  if (!sub) throw new ApiError(404, "Subscription not found");

  const payment = await SubscriptionPaymentModel.create({
    subscription: subscriptionId,
    user: sub.user,
    amount,
    paymentType: type,
    transactionRef: ref,
    status: "completed",
    paidAt: new Date(),
  });

  sub.totalPaid += amount;
  sub.remainingAmount -= amount;
  
  if (sub.remainingAmount <= 0) {
    sub.paymentStatus = "completed";
  } else {
    sub.paymentStatus = "partial";
  }

  await sub.save();
  return payment;
}

/**
 * Compute how much to charge the user at complaint creation time for a metered subscription.
 * 
 * Rules:
 *  - Flat plan: always ₹0 (all paid upfront)
 *  - Metered plan:
 *    - lockInPeriod = 0 → no metered option (should not reach here)
 *    - lockInServices = Math.floor((lockInPeriod / validityDuration) * totalServices)
 *    - nextUsageIndex (1-based) <= lockInServices → charge ₹200 visiting fee
 *    - nextUsageIndex > lockInServices → charge remaining subscription balance
 *      (this is the "post lock-in" charge that activates the remaining free services)
 */
export async function getSubscriptionChargeForComplaint(
  userSubscriptionId: mongodbId
): Promise<{ chargeType: "none" | "visiting" | "remaining"; amount: number }> {
  const sub = await UserSubscriptionModel.findById(userSubscriptionId);
  if (!sub) throw new ApiError(404, "Subscription not found");

  // Flat plans: no charge at complaint time
  if (sub.paymentModel === "flat") {
    return { chargeType: "none", amount: 0 };
  }

  // Metered plan
  const snap = sub.plan_snapshot;
  const lockInPeriod: number = snap.lockInPeriod || 0;
  const validityDuration: number = snap.validityDuration || 1;
  const totalServices: number = snap.totalServices || 1;

  if (lockInPeriod === 0) {
    return { chargeType: "none", amount: 0 };
  }

  const lockInServices = Math.floor((lockInPeriod / validityDuration) * totalServices);

  // Count how many services have been used so far (0-indexed count → next is +1)
  const usageCount = await SubscriptionUsageModel.countDocuments({ subscription: userSubscriptionId });
  const nextUsageIndex = usageCount + 1; // 1-based

  if (nextUsageIndex <= lockInServices) {
    // Within lock-in period — covered by upfront payment
    return { chargeType: "none", amount: 0 };
  } else if (sub.remainingAmount <= 0) {
    // Beyond lock-in but remaining balance already paid — all services unlocked
    return { chargeType: "none", amount: 0 };
  } else {
    // Beyond lock-in — charge the remaining subscription balance to unlock all remaining services
    return { chargeType: "remaining", amount: sub.remainingAmount };
  }
}

/** GET SUBSCRIPTION BY ID */
export async function getSubscriptionById(id: string) {
  const sub = await UserSubscriptionModel.findById(id);
  if (!sub) throw new ApiError(404, "Subscription not found");

  const lastUsage = await SubscriptionUsageModel.findOne({ subscription: id })
    .sort({ usedAt: -1 })
    .select("usedAt");

  return new ApiSuccess(200, "Subscription retrieved", {
    ...sub.toObject(),
    lastServicedAt: lastUsage?.usedAt ?? null,
  });
}
