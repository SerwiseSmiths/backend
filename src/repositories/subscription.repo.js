"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubscription = exports.retrieveAllSubscriptions = exports.retrieveSubscriptionById = exports.createSubscription = void 0;
const subscription_schema_1 = require("../models/schema/subscription.schema");
// import { mongodbId } from "../types/common";
/** Create Subscription */
const createSubscription = async (data) => {
    const newSub = new subscription_schema_1.SubscriptionModel(data);
    await newSub.save();
    return newSub;
};
exports.createSubscription = createSubscription;
/** Retrieve by ID */
const retrieveSubscriptionById = async (_id) => {
    return await subscription_schema_1.SubscriptionModel.findById(_id).populate("user");
};
exports.retrieveSubscriptionById = retrieveSubscriptionById;
/** Retrieve all */
const retrieveAllSubscriptions = async () => {
    return await subscription_schema_1.SubscriptionModel.find().populate("user");
};
exports.retrieveAllSubscriptions = retrieveAllSubscriptions;
/** Update partial fields */
const updateSubscription = async (_id, update) => {
    return await subscription_schema_1.SubscriptionModel.findByIdAndUpdate(_id, update, {
        new: true,
    });
};
exports.updateSubscription = updateSubscription;
//# sourceMappingURL=subscription.repo.js.map