import * as authService from "../services/auth.service";
import * as UserRepo from "../repositories/user.repo";
import ApiSuccess from "../utils/api/ApiSuccess.api.util";
import ApiError from "../utils/api/ApiError.api.util";
import * as jwt from "jsonwebtoken";

export const login = async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
    const { phoneNo, userType }: { phoneNo: string, userType?: string } = req.body;
    const appContextHeader = req.headers["x-app-context"];
    const appContext = Array.isArray(appContextHeader) ? appContextHeader[0] : appContextHeader;
    const loginResult = await authService.login(phoneNo!, userType, appContext);
    return res.status(loginResult.statusCode).json(loginResult);
};

export const generateOtp = async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
    const { phoneNo }: { phoneNo: string } = req.body;
    const result = await authService.generateOtp(phoneNo);
    return res.status(result.statusCode).json(result);
};

export const verifyOtp = async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
    const { phoneNo, otp, userType, flow }: { phoneNo: string, otp: string, userType?: string, flow?: "login" | "signup" } = req.body;
    const appContextHeader = req.headers["x-app-context"];
    const appContext = Array.isArray(appContextHeader) ? appContextHeader[0] : appContextHeader;
    const result = await authService.verifyOtp(phoneNo, otp, userType, flow, appContext);
    return res.status(result.statusCode).json(result);
};

// ============================================================
// GET /auth/me — returns the authenticated user's profile
// ============================================================
export const me = async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) throw new ApiError(401, "Unauthorized");

        const user = await UserRepo.retriveUserById(userId);
        if (!user) throw new ApiError(404, "User not found");

        return res.status(200).json(
            new ApiSuccess(200, "User profile fetched successfully", {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phoneNo: user.phoneNo,
                    profileImage: user.profileImage ?? null,
                    userType: user.userType,
                    refrenceCode: user.refrenceCode,
                },
            })
        );
    } catch (error) {
        next(error);
    }
};

export const refreshToken = async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
    try {
        const { refreshToken: token } = req.body;
        if (!token) throw new ApiError(400, "Refresh token required");

        // Verify the refresh token is still cryptographically valid
        let decoded: any;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET!);
        } catch {
            throw new ApiError(401, "Refresh token expired or invalid");
        }

        // Find user and confirm the stored refresh token matches
        const user = await UserRepo.retrieveUserByRefreshToken(token);
        if (!user) throw new ApiError(401, "Refresh token revoked or not found");

        const tokens = await user.generateAuthTokens();
        return res.status(200).json(new ApiSuccess(200, "Token refreshed successfully", { tokens }));
    } catch (error) {
        next(error);
    }
};

export const truecallerAuth = async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
    const { payload, signature, requestNonce, userType }: { payload: string; signature: string; requestNonce: string; userType?: string } = req.body;
    const result = await authService.truecallerAuth({
        payload,
        signature,
        requestNonce,
        ...(userType !== undefined && { userType }),
    });
    return res.status(result.statusCode).json(result);
};

export const truecallerOAuthAuth = async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
    const { authorizationCode, codeVerifier, userType }: { authorizationCode: string; codeVerifier: string; userType?: string } = req.body;
    const result = await authService.truecallerOAuthAuth({
        authorizationCode,
        codeVerifier,
        ...(userType !== undefined && { userType }),
    });
    return res.status(result.statusCode).json(result);
};
