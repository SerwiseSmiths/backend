import * as authService from "../services/auth.service"

export const login = async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
    const { phoneNo, userType }: { phoneNo: string, userType?: string } = req.body;

    const loginResult = await authService.login(phoneNo!, userType);

    return res.status(loginResult.statusCode).json(loginResult);
}