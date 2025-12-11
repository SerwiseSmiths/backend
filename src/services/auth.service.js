"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = void 0;
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
const UserRepo = require("../repositories/user.repo");
const ApiSuccess_api_util_1 = require("../utils/api/ApiSuccess.api.util");
const login = async (_phoneNo) => {
    if (!_phoneNo) {
        throw new ApiError_api_util_1.default(401, "Phone no required");
    }
    console.log(_phoneNo);
    const user = await UserRepo.retriveUserByPhoneNo(_phoneNo);
    console.log(user);
    if (!user) {
        throw new ApiError_api_util_1.default(401, "invalid phone no");
    }
    //generate token
    const tokens = await user.generateAuthTokens();
    //return res
    return new ApiSuccess_api_util_1.default(200, "User looged in sucessfully", { tokens });
};
exports.login = login;
const logout = async () => { };
exports.logout = logout;
//# sourceMappingURL=auth.service.js.map