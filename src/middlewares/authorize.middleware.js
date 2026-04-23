"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (roles.length && !roles.includes(req.user.userType)) {
            // return res.status(403).json({ message: "Forbidden" });
            // Using ApiError for consistency if possible, or just json
            return next(new ApiError_api_util_1.default(403, "Forbidden: Insufficient rights", "FORBIDDEN"));
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=authorize.middleware.js.map