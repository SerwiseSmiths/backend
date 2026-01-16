// utils/providerAssignment.util.ts
import UserModel from "../models/schema/User.schema";

export const getAutoAssignedProvider = async () => {
  // Example Algo: pick any random provider with role = "provider"
  const providers = await UserModel.find({ userType: "provider", isDeleted: false });

  console.log("Available providers for assignment:", providers);

  if (!providers || providers.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * providers.length);
  return providers[randomIndex]?._id;
};
