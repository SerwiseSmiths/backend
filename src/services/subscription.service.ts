/**
 * @file subscription.service.ts
 * @description Business logic for Subscription Management
 */

import ApiError from "../utils/api/ApiError.api.util";
import ApiSuccess from "../utils/api/ApiSuccess.api.util";

import * as subRepo from "../repositories/subscription.repo";
import { ISubscription } from "../models/schema/subscription.schema";
// import { mongodbId } from "../types/common";

/** CREATE SUBSCRIPTION */
export async function createSubscription(
  userId: mongodbId,
  body: {
    remaining_service: number;
    payment_remaining: number;
    auto_renew: boolean;
  }
): Promise<ApiSuccess<ISubscription>> {
  const { remaining_service, payment_remaining, auto_renew } = body;

  if (!remaining_service || remaining_service <= 0)
    throw new ApiError(400, "Invalid remaining_service");

  const startDate = new Date();
  const monthsToAdd = remaining_service / 12;
  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + monthsToAdd);

  const subData: Partial<ISubscription> = {
    user: userId,
    created_at: startDate,
    end_at: endDate,

    remaining_service,
    used_service: 0,

    state: "pending",
    auto_renew: auto_renew ?? false,

    payment_remaining,
  };

  const newSub = await subRepo.createSubscription(subData);
  return new ApiSuccess<ISubscription>(201, "Subscription created", newSub!);
}

/** GET BY ID */
export async function retrieveSubscriptionById(_id: mongodbId) {
  const sub = await subRepo.retrieveSubscriptionById(_id);
  if (!sub) throw new ApiError(400, "Invalid subscription");

  return new ApiSuccess(200, "Subscription retrieved", sub);
}

/** GET ALL */
export async function retrieveAllSubscriptions() {
  const subs = await subRepo.retrieveAllSubscriptions();
  return new ApiSuccess(200, "Subscriptions retrieved", subs);
}

/** CHANGE STATE */
export async function changeState(
  _id: mongodbId,
  newState: ISubscription["state"]
) {
  const allowed = ["active", "expired", "completed", "cancelled", "pending"];
  if (!allowed.includes(newState))
    throw new ApiError(400, "Invalid state");

  const updated = await subRepo.updateSubscription(_id, { state: newState });
  if (!updated) throw new ApiError(400, "Invalid subscription");

  return new ApiSuccess(200, "State updated successfully", updated);
}

/** UPDATE PAYMENT REMAINING */
export async function updatePaymentRemaining(
  _id: mongodbId,
  amount: number
) {
  if (amount < 0) throw new ApiError(400, "Invalid amount");

  const updated = await subRepo.updateSubscription(_id, {
    payment_remaining: amount,
  });

  if (!updated) throw new ApiError(400, "Invalid subscription");

  return new ApiSuccess(200, "Payment remaining updated", updated);
}
