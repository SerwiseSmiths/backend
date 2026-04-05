/**
 * @file user.services.ts
 * @description Business logic for user-related operations
 * @module services/user.services
 */

import { IUser, userApiData, UserDocument } from "../types/user.type";
import { userValidationSchema } from "../models/validation/user.validation";
import * as userRepo from "../repositories/user.repo";
import ApiError from "../utils/api/ApiError.api.util";
import ApiSuccess from "../utils/api/ApiSuccess.api.util";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import usernameService from "./username.service";
import { creditWallet } from "./wallet.services";
import { WalletLedgerSource } from "../types/wallet.type";
import { fetchSignupBonusConfig } from "./strapi.service";
import { notifyNewUser } from "./telegram.service";

/**
 * Registers a new user.
 * @param _data - User data object
 * @returns The newly created user
 * @throws Error if user already exists
 */
export async function registerUser(
  _data: Partial<IUser>
): Promise<ApiSuccessType<userApiData>> {
  //validate user data
  const { error, value } = userValidationSchema.validate(_data);
  if (error) {
    throw new ApiError(
      400,
      `Validation Error: ${error.details.map((d) => d.message).join(", ")}`,
      error
    );
  }

  //check if user already exsist
  let user = await userRepo.retriveUserByPhoneNo(_data.phoneNo!);
  if (user) {
    throw new ApiError(409, "User with this phone number already exists");
  }

  if (_data.email) {
    user = await userRepo.retriveUserByEmail(_data.email!);
    if (user) {
      throw new ApiError(409, "User with this email already exists");
    }
  }

  console.log(value);

  // generate unique username
  const username = await usernameService.generateUniqueUsername(value.firstName, value.lastName);
  value.username = username;

  //save user to database
  const newUser = await userRepo.createUser(value);

  console.log(newUser);

  // Telegram notification (fire-and-forget)
  notifyNewUser(newUser).catch(() => {});

  // Credit signup bonus if configured in Strapi
  try {
    console.log("[SignupBonus] Fetching bonus config from Strapi...");
    const bonusConfig = await fetchSignupBonusConfig();
    console.log("[SignupBonus] Config received:", JSON.stringify(bonusConfig));

    if (!bonusConfig) {
      console.warn("[SignupBonus] No config returned from Strapi — skipping");
    } else if (!bonusConfig.enabled) {
      console.warn("[SignupBonus] Bonus is disabled in Strapi — skipping");
    } else if (bonusConfig.bonusAmount <= 0) {
      console.warn("[SignupBonus] bonusAmount is 0 or negative — skipping");
    } else {
      console.log(`[SignupBonus] Crediting ₹${bonusConfig.bonusAmount} to user ${newUser!._id}`);
      await creditWallet(
        newUser!._id.toString(),
        bonusConfig.bonusAmount,
        WalletLedgerSource.CASHBACK,
        undefined,
        { description: `Welcome bonus — ₹${bonusConfig.bonusAmount}` }
      );
      console.log(`[SignupBonus] ✅ ₹${bonusConfig.bonusAmount} credited successfully to ${newUser!._id}`);
    }
  } catch (err) {
    console.error("[SignupBonus] ❌ Failed to credit signup bonus:", err);
  }

  return new ApiSuccess<userApiData>(
    201,
    "User created successfully",
    { user: newUser! }
  );
}

/**
 * retirve a user by _id.
 * @param _id - User id
 * @returns user
 * @throws invalid id
 */
export async function retirveUserById(
  _id: mongodbId
): Promise<ApiSuccessType<userApiData>> {
  const user = await userRepo.retriveUserById(_id);

  if (!user) {
    throw new ApiError(400, "Inavlid User", null);
  }

  return new ApiSuccess<userApiData>(
    200,
    "User retrived successful",
    { user: user! }
  );
}

export async function retriveUserByRefCode(_refCode: string) {
  const user = await userRepo.retrieveUserByRefCode(_refCode);


  if (!user) {
    throw new ApiError(400, "Inavlid Refrence code", null);
  }

  return new ApiSuccess<userApiData>(
    200,
    "Refrence Code verified sucessfully"
  );
}

export async function retrieveAllUsers(): Promise<ApiSuccessType<{ user: UserDocument[] }>> {
  const users = (await userRepo.retrieveAllUsers()) ?? [];
  return new ApiSuccess<{ user: UserDocument[] }>(
    200,
    "Users retrived successfully",
    { user: users }
  );
}

/**
 * Updates a user's profile image.
 * @param _id - User id
 * @param profileImageUrl - URL of the profile image
 * @returns Updated user
 */
export async function updateProfileImage(
  _id: mongodbId,
  profileImageUrl: string
): Promise<ApiSuccessType<userApiData>> {
  const updatedUser = await userRepo.updateUserById(_id, { profileImage: profileImageUrl });

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return new ApiSuccess<userApiData>(
    200,
    "Profile image updated successfully",
    { user: updatedUser }
  );
}

/**
 * Updates a user's basic info.
 */
export async function updateSelfInfo(
  _id: mongodbId,
  data: { firstName?: string; lastName?: string; profileImage?: string; email?: string }
): Promise<ApiSuccessType<userApiData>> {
  const updatedUser = await userRepo.updateUserById(_id, data);

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return new ApiSuccess<userApiData>(
    200,
    "Profile updated successfully",
    { user: updatedUser }
  );
}