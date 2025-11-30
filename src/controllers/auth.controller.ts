import * as authService from "../services/auth.service"

export const login = async (req : ExpressRequest, res : ExpressResponse, next : ExpressNextFunction) => {
    const {phoneNo} : {phoneNo : string} = req.body;

    const loginResult = await authService.login(phoneNo!);

    return res.status(loginResult.statusCode).json(loginResult);
}