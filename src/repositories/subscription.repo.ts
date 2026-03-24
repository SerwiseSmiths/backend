import { UserSubscriptionModel, IUserSubscription } from "../models/schema/UserSubscription.schema";

/** Create Subscription */
export const createSubscription = async (
  data: Partial<IUserSubscription>
): Promise<IUserSubscription | null> => {
  const newSub = new UserSubscriptionModel(data);
  await newSub.save();
  return newSub;
};

/** Retrieve by ID */
export const retrieveSubscriptionById = async (
  _id: mongodbId
): Promise<IUserSubscription | null> => {
  return await UserSubscriptionModel.findById(_id).populate("user");
};

/** Retrieve all */
export const retrieveAllSubscriptions = async (): Promise<IUserSubscription[]> => {
  return await UserSubscriptionModel.find().populate("user");
};

/** Update partial fields */
export const updateSubscription = async (
  _id: mongodbId,
  update: Partial<IUserSubscription>
): Promise<IUserSubscription | null> => {
  return await UserSubscriptionModel.findByIdAndUpdate(_id, update, {
    new: true,
  });
};
