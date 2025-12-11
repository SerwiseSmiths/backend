import { IUser, UserDocument } from "../types/user.type";
export declare const retriveUserByPhoneNo: (_phoneNo: string) => Promise<UserDocument | null>;
export declare const retriveUserByEmail: (_email: string) => Promise<UserDocument | null>;
export declare const createUser: (data: Partial<IUser>) => Promise<UserDocument | null>;
export declare const retriveUserById: (_id: mongodbId) => Promise<UserDocument | null>;
export declare const retrieveUserByRefCode: (refCode: string) => Promise<UserDocument | null>;
export declare const retrieveAllUsers: () => Promise<UserDocument[] | null>;
//# sourceMappingURL=user.repo.d.ts.map