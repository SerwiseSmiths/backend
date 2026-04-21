import * as Regex from "../constants/regex.constant";
import UserModel from "../models/schema/User.schema";
import { IUser, UserDocument } from "../types/user.type";

export const retriveUserByPhoneNo = async (
  _phoneNo: string
): Promise<UserDocument | null> => {
  //validate phone number
  console.log("Validating phone no: ",_phoneNo, " ", _phoneNo.match(Regex.phoneRegex), Regex.phoneRegex);
  if (
    _phoneNo === "" ||
    typeof _phoneNo !== "string" 
    // ||
    // !_phoneNo.match(Regex.phoneRegex)
  ) {
    return null;
  }

  console.log("Phone no valid");
  //fetch user from database by phone number
  const user = await UserModel.findOne({ phoneNo: _phoneNo, isDeleted: false });
  if (!user) {
    return null;
  }

  //return user
  return user;
};

export const retriveUserByEmail = async (
  _email: string
): Promise<UserDocument | null> => {
  //validate email
  if (
    _email === "" ||
    typeof _email !== "string" ||
    !_email.match(Regex.emailRegex)
  ) {
    return null;
  }

  //fetch user from database by email
  const user = await UserModel.findOne({ email: _email, isDeleted: false });
  if (!user) {
    return null;
  }

  //return user
  return user;
};

export const createUser = async (
  data: Partial<IUser>
): Promise<UserDocument | null> => {
  const newUser = new UserModel(data);
  await newUser.save();
  return newUser;
};

export const retriveUserById = async (
  _id: mongodbId
): Promise<UserDocument | null> => {
  const user = await UserModel.findById(_id);

  if (!user) {
    return null;
  }

  return user;
};

export const retrieveUserByRefCode = async (
  refCode: string
): Promise<UserDocument | null> => {
  try {
    if (!refCode || typeof refCode !== "string") {
      return null;
    }

    // Clean the reference code
    const cleanCode = refCode.trim().toUpperCase();

    // Find the user by referenceCode
    const user = await UserModel.findOne({ refrenceCode: cleanCode });

    return user;
  } catch (error) {
    console.error("Error retrieving user by reference code:", error);
    return null;
  }
};

export const retrieveAllUsers = async (
): Promise<UserDocument[] | null> => {
  try {

    // Find the user by referenceCode
    const user = await UserModel.find();

    return user;
  } catch (error) {
    console.error("Error retrieving user by reference code:", error);
    return null;
  }
};

export const retrieveUserByRefreshToken = async (
  refreshToken: string
): Promise<UserDocument | null> => {
  if (!refreshToken || typeof refreshToken !== "string") {
    return null;
  }
  return UserModel.findOne({ refreshToken, isDeleted: false });
};

export const updateUserById = async (
  _id: mongodbId,
  data: Partial<IUser>
): Promise<UserDocument | null> => {
  try {
    const user = await UserModel.findByIdAndUpdate(
      _id,
      { $set: data },
      { new: true, runValidators: true }
    );
    return user;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
};