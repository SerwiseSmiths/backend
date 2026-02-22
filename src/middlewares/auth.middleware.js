"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jwt = require("jsonwebtoken");
const ACCESS_SECRET = process.env.JWT_SECRET;
const auth = (req, res, next) => {
    console.log("Auth Middleware Invoked");
    try {
        const token = req.headers.authorization?.split(" ")[1];
        console.log("Authorization Header:", req.headers.authorization);
        if (!token)
            return res.status(401).json({ message: "Access Denied: No Token Provided" });
        const decoded = jwt.verify(token, ACCESS_SECRET);
        console.log("Decoded JWT:", decoded);
        req.user = decoded;
        // ============================================================
        // Rolling 30-day access token — re-issue on every request
        // ============================================================
        const newAccessToken = jwt.sign({
            id: decoded.id,
            phoneNo: decoded.phoneNo,
            userType: decoded.userType,
        }, ACCESS_SECRET, { expiresIn: "30d" });
        // Send the fresh token in a response header so the client can save it
        res.setHeader("x-new-access-token", newAccessToken);
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid or Expired Token" });
    }
};
exports.auth = auth;
//# sourceMappingURL=auth.middleware.js.map