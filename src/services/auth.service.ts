import UserModel from "../models/schema/User.schema";
import ApiError from "../utils/api/ApiError.api.util";
import * as UserRepo from "../repositories/user.repo";
import ApiSuccess from "../utils/api/ApiSuccess.api.util";

export const login = async (_phoneNo: string, _userType?: string) => {
  if (!_phoneNo) {
    throw new ApiError(401, "Phone no required");
  }

  console.log(`Login attempt for: ${_phoneNo}, userType: ${_userType || 'customer'}`);

  // Find existing user by phone number
  let user = await UserRepo.retriveUserByPhoneNo(_phoneNo);
  const isNewUser = !user;

  if (!user) {
    // Auto-register new user with basic information
    console.log(`Creating new user: ${_phoneNo}`);

    user = await UserModel.create({
      phoneNo: _phoneNo,
      userType: _userType || 'customer', // Default to customer if not specified
      firstName: "User",
      lastName: _phoneNo.slice(-4), // Use last 4 digits as temporary last name
    });

    console.log(`New user created with ID: ${user._id}`);
  } else {
    console.log(`Existing user found: ${user._id}`);
  }

  // Generate authentication tokens
  const tokens = await user.generateAuthTokens();

  // Return success with tokens, user data, and isNewUser flag
  return new ApiSuccess(200, "User logged in successfully", {
    tokens,
    user,
    isNewUser
  });
};

export const logout = async () => { };
