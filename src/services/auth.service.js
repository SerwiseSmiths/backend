"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = void 0;
const User_schema_1 = require("../models/schema/User.schema");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
const UserRepo = require("../repositories/user.repo");
const ApiSuccess_api_util_1 = require("../utils/api/ApiSuccess.api.util");
const login = async (_phoneNo, _userType) => {
    if (!_phoneNo) {
        throw new ApiError_api_util_1.default(401, "Phone no required");
    }
    console.log(`Login attempt for: ${_phoneNo}, userType: ${_userType || 'customer'}`);
    // Find existing user by phone number
    let user = await UserRepo.retriveUserByPhoneNo(_phoneNo);
    const isNewUser = !user;
    if (!user) {
        // Auto-register new user with basic information
        console.log(`Creating new user: ${_phoneNo}`);
        user = await User_schema_1.default.create({
            phoneNo: _phoneNo,
            userType: _userType || 'customer', // Default to customer if not specified
            firstName: "User",
            lastName: _phoneNo.slice(-4), // Use last 4 digits as temporary last name
        });
        console.log(`New user created with ID: ${user._id}`);
    }
    else {
        console.log(`Existing user found: ${user._id}`);
    }
    // Generate authentication tokens
    const tokens = await user.generateAuthTokens();
    // Return success with tokens, user data, and isNewUser flag
    return new ApiSuccess_api_util_1.default(200, "User logged in successfully", {
        tokens,
        user,
        isNewUser
    });
};
exports.login = login;
const logout = async () => { };
exports.logout = logout;
//# sourceMappingURL=auth.service.js.map