"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authOptional = void 0;
const jwt = require("jsonwebtoken");
const ACCESS_SECRET = process.env.JWT_SECRET;
/**
 * Optional Auth middleware — populates req.user if a valid Bearer token is present,
 * but does NOT block the request if no token is provided.
 * Use this for endpoints that should work both authenticated and anonymous.
 */
const authOptional = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
            const decoded = jwt.verify(token, ACCESS_SECRET);
            req.user = decoded;
        }
    }
    catch {
        // Invalid token — treat as unauthenticated (don't block)
    }
    next();
};
exports.authOptional = authOptional;
//# sourceMappingURL=authOptional.middleware.js.map