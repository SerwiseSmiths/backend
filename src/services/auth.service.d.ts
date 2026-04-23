import ApiSuccess from "../utils/api/ApiSuccess.api.util";
export declare const login: (_phoneNo: string, _userType?: string, appContext?: string) => Promise<ApiSuccess<{
    tokens: import("../types/user.type").IAuthTokens;
    user: import("mongoose").Document<unknown, {}, import("../types/user.type").IUser, {}, {}> & import("../types/user.type").IUser & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    };
    isNewUser: boolean;
}>>;
export declare const generateOtp: (_phoneNo: string) => Promise<ApiSuccess<{
    ttlMinutes: number;
    userExists: boolean;
}>>;
export declare const verifyOtp: (_phoneNo: string, otp: string, _userType?: string, flow?: "login" | "signup", appContext?: string) => Promise<ApiSuccess<{
    tokens: import("../types/user.type").IAuthTokens;
    user: import("mongoose").Document<unknown, {}, import("../types/user.type").IUser, {}, {}> & import("../types/user.type").IUser & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    };
    isNewUser: boolean;
}> | ApiSuccess<{
    phoneNo: string;
    verificationSignature: any;
}>>;
export declare const logout: () => Promise<void>;
export declare const truecallerAuth: (params: {
    payload: string;
    signature: string;
    requestNonce: string;
    userType?: string;
}) => Promise<ApiSuccess<{
    tokens: import("../types/user.type").IAuthTokens;
    user: import("mongoose").Document<unknown, {}, import("../types/user.type").IUser, {}, {}> & import("../types/user.type").IUser & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    };
    isNewUser: boolean;
    authMethod: string;
}>>;
/**
 * Truecaller OAuth 3.2.1 flow: exchange authorization code for token, fetch profile, login.
 */
export declare const truecallerOAuthAuth: (params: {
    authorizationCode: string;
    codeVerifier: string;
    userType?: string;
}) => Promise<ApiSuccess<{
    tokens: import("../types/user.type").IAuthTokens;
    user: import("mongoose").Document<unknown, {}, import("../types/user.type").IUser, {}, {}> & import("../types/user.type").IUser & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    };
    isNewUser: boolean;
    authMethod: string;
}>>;
//# sourceMappingURL=auth.service.d.ts.map