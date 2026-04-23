"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubscription = exports.retrieveAllSubscriptions = exports.retrieveSubscriptionById = exports.createSubscription = void 0;
const UserSubscription_schema_1 = require("../models/schema/UserSubscription.schema");
/** Create Subscription */
const createSubscription = async (data) => {
    const newSub = new UserSubscription_schema_1.UserSubscriptionModel(data);
    await newSub.save();
    return newSub;
};
exports.createSubscription = createSubscription;
/** Retrieve by ID */
const retrieveSubscriptionById = async (_id) => {
    return await UserSubscription_schema_1.UserSubscriptionModel.findById(_id).populate("user");
};
exports.retrieveSubscriptionById = retrieveSubscriptionById;
/** Retrieve all */
const retrieveAllSubscriptions = async () => {
    return await UserSubscription_schema_1.UserSubscriptionModel.find().populate("user");
};
exports.retrieveAllSubscriptions = retrieveAllSubscriptions;
/** Update partial fields */
const updateSubscription = async (_id, update) => {
    return await UserSubscription_schema_1.UserSubscriptionModel.findByIdAndUpdate(_id, update, {
        new: true,
    });
};
exports.updateSubscription = updateSubscription;
//# sourceMappingURL=subscription.repo.js.map