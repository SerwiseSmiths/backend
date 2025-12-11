"use strict";
/**
 * @file subscription.service.ts
 * @description Business logic for Subscription Management
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubscription = createSubscription;
exports.retrieveSubscriptionById = retrieveSubscriptionById;
exports.retrieveAllSubscriptions = retrieveAllSubscriptions;
exports.changeState = changeState;
exports.updatePaymentRemaining = updatePaymentRemaining;
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
const ApiSuccess_api_util_1 = require("../utils/api/ApiSuccess.api.util");
const subRepo = require("../repositories/subscription.repo");
// import { mongodbId } from "../types/common";
/** CREATE SUBSCRIPTION */
async function createSubscription(userId, body) {
    const { remaining_service, payment_remaining, auto_renew } = body;
    if (!remaining_service || remaining_service <= 0)
        throw new ApiError_api_util_1.default(400, "Invalid remaining_service");
    const startDate = new Date();
    const monthsToAdd = remaining_service / 12;
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + monthsToAdd);
    const subData = {
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
    return new ApiSuccess_api_util_1.default(201, "Subscription created", newSub);
}
/** GET BY ID */
async function retrieveSubscriptionById(_id) {
    const sub = await subRepo.retrieveSubscriptionById(_id);
    if (!sub)
        throw new ApiError_api_util_1.default(400, "Invalid subscription");
    return new ApiSuccess_api_util_1.default(200, "Subscription retrieved", sub);
}
/** GET ALL */
async function retrieveAllSubscriptions() {
    const subs = await subRepo.retrieveAllSubscriptions();
    return new ApiSuccess_api_util_1.default(200, "Subscriptions retrieved", subs);
}
/** CHANGE STATE */
async function changeState(_id, newState) {
    const allowed = ["active", "expired", "completed", "cancelled", "pending"];
    if (!allowed.includes(newState))
        throw new ApiError_api_util_1.default(400, "Invalid state");
    const updated = await subRepo.updateSubscription(_id, { state: newState });
    if (!updated)
        throw new ApiError_api_util_1.default(400, "Invalid subscription");
    return new ApiSuccess_api_util_1.default(200, "State updated successfully", updated);
}
/** UPDATE PAYMENT REMAINING */
async function updatePaymentRemaining(_id, amount) {
    if (amount < 0)
        throw new ApiError_api_util_1.default(400, "Invalid amount");
    const updated = await subRepo.updateSubscription(_id, {
        payment_remaining: amount,
    });
    if (!updated)
        throw new ApiError_api_util_1.default(400, "Invalid subscription");
    return new ApiSuccess_api_util_1.default(200, "Payment remaining updated", updated);
}
//# sourceMappingURL=subscription.service.js.map