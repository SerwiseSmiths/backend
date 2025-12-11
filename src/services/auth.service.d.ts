import ApiSuccess from "../utils/api/ApiSuccess.api.util";
export declare const login: (_phoneNo: string) => Promise<ApiSuccess<{
    tokens: import("../types/user.type").IAuthTokens;
}>>;
export declare const logout: () => Promise<void>;
//# sourceMappingURL=auth.service.d.ts.map