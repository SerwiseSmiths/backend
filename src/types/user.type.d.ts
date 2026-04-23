import { HydratedDocument } from "mongoose";
import { UserType } from "../constants/user.constant";
export interface IAuthTokens {
    accessToken: string;
    refreshToken: string;
}
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
    username?: string;
    hasSetUsername: boolean;
    circles: string[];
    source?: string;
    fullName(): string;
    generateAuthTokens(): Promise<IAuthTokens>;
    logout(): Promise<boolean>;
}
export type UserDocument = HydratedDocument<IUser>;
export type userApiData = {
    user: UserDocument;
};
//# sourceMappingURL=user.type.d.ts.map