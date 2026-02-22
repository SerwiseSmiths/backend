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