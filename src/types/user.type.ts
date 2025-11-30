import { HydratedDocument } from "mongoose";
import { UserType } from "../constants/user.constant";

// ===============================
// Token Return Type
// ===============================
export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ===============================
// IUser Interface
// ===============================
export interface IUser extends Document {
  phoneNo: string;
  email?: string;
  profileImage: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  source?: string;

  userType: UserType;
  refreshToken?: string | null;
  refrenceCode?: string;

  isActive: boolean;
  isDeleted: boolean;
  isStaff: boolean;

  // -------- Instance Methods --------
  fullName(): string;
  validateprofileImage(_enteredprofileImage: string): Promise<boolean>;

  // 🔥 Newly Added:
  generateAuthTokens(): Promise<IAuthTokens>;
  logout(): Promise<boolean>;
}

// ===============================
// Hydrated Document Type
// ===============================
export type UserDocument = HydratedDocument<IUser>;

// ===============================
// Returned API Data Structure
// ===============================
export type userApiData = { user: UserDocument };
