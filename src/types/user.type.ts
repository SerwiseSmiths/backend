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
  lastName: string;

  userType: UserType;
  refreshToken?: string | null;
  refrenceCode?: string;

  isActive: boolean;
  isDeleted: boolean;

  // 🔥 Newly Added for Chat:
  username?: string;
  hasSetUsername: boolean;
  circles: string[]; // Array of Circle IDs

  source?: string; // Tracking for whitelisted providers or other entry points

  // -------- Instance Methods --------
  fullName(): string;

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
