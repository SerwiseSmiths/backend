import * as authService from "../services/auth.service";
import * as UserRepo from "../repositories/user.repo";
import ApiSuccess from "../utils/api/ApiSuccess.api.util";
import ApiError from "../utils/api/ApiError.api.util";

export const login = async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
    const { phoneNo, userType }: { phoneNo: string, userType?: string } = req.body;
    const loginResult = await authService.login(phoneNo!, userType);
    return res.status(loginResult.statusCode).json(loginResult);
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