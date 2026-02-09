import UserModel from "../models/schema/User.schema";
import ApiError from "../utils/api/ApiError.api.util";
import * as UserRepo from "../repositories/user.repo";
import ApiSuccess from "../utils/api/ApiSuccess.api.util";

export const login = async (_phoneNo: string) => {
  if (!_phoneNo) {
    throw new ApiError(401, "Phone no required");
  }

  console.log(_phoneNo);

  const user = await UserRepo.retriveUserByPhoneNo(_phoneNo);
  console.log(user);

  if (!user) {
    throw new ApiError(401, "invalid phone no");
  }

  //generate token
  const tokens = await user.generateAuthTokens();

  //return res
  return new ApiSuccess(200, "User looged in sucessfully", { tokens, user });
};

export const logout = async () => { };
