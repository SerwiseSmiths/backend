import { SubscriptionModel } from "../models/schema/subscription.schema";
import { ISubscription } from "../models/schema/subscription.schema";
// import { mongodbId } from "../types/common";

/** Create Subscription */
export const createSubscription = async (
  data: Partial<ISubscription>
): Promise<ISubscription | null> => {
  const newSub = new SubscriptionModel(data);
  await newSub.save();
  return newSub;
};

/** Retrieve by ID */
export const retrieveSubscriptionById = async (
  _id: mongodbId
): Promise<ISubscription | null> => {
  return await SubscriptionModel.findById(_id).populate("user");
};

/** Retrieve all */
export const retrieveAllSubscriptions = async (): Promise<ISubscription[]> => {
  return await SubscriptionModel.find().populate("user");
};

/** Update partial fields */
export const updateSubscription = async (
  _id: mongodbId,
  update: Partial<ISubscription>
): Promise<ISubscription | null> => {
  return await SubscriptionModel.findByIdAndUpdate(_id, update, {
    new: true,
  });
};
