/**
 * @file user.services.ts
 * @description Business logic for user-related operations
 * @module services/user.services
 */
import { IUser, userApiData, UserDocument } from "../types/user.type";
import ApiSuccess from "../utils/api/ApiSuccess.api.util";
/**
 * Registers a new user.
 * @param _data - User data object
 * @returns The newly created user
 * @throws Error if user already exists
 */
export declare function registerUser(_data: Partial<IUser>): Promise<ApiSuccessType<userApiData>>;
/**
 * retirve a user by _id.
 * @param _id - User id
 * @returns user
 * @throws invalid id
 */
export declare function retirveUserById(_id: mongodbId): Promise<ApiSuccessType<userApiData>>;
export declare function retriveUserByRefCode(_refCode: string): Promise<ApiSuccess<userApiData>>;
export declare function retrieveAllUsers(): Promise<ApiSuccessType<{
    user: UserDocument[];
}>>;
//# sourceMappingURL=user.services.d.ts.map