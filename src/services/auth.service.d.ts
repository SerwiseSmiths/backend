import ApiSuccess from "../utils/api/ApiSuccess.api.util";
export declare const login: (_phoneNo: string, _userType?: string) => Promise<ApiSuccess<{
    tokens: import("../types/user.type").IAuthTokens;
    user: import("mongoose").Document<unknown, {}, import("../types/user.type").IUser, {}, {}> & import("../types/user.type").IUser & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    };
    isNewUser: boolean;
}>>;
export declare const logout: () => Promise<void>;
//# sourceMappingURL=auth.service.d.ts.map