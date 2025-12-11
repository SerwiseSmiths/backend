"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const authService = require("../services/auth.service");
const login = async (req, res, next) => {
    const { phoneNo } = req.body;
    const loginResult = await authService.login(phoneNo);
    return res.status(loginResult.statusCode).json(loginResult);
};
exports.login = login;
//# sourceMappingURL=auth.controller.js.map