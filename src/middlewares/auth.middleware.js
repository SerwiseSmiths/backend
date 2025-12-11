"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token)
            return res.status(401).json({ message: "Access Denied: No Token Provided" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid or Expired Token" });
    }
};
exports.auth = auth;
//# sourceMappingURL=auth.middleware.js.map