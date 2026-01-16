import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import ApiError from "../utils/api/ApiError.api.util";

export const authorize = (roles: string[] = []) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (roles.length && !roles.includes(req.user.userType)) {
            // return res.status(403).json({ message: "Forbidden" });
            // Using ApiError for consistency if possible, or just json
            return next(new ApiError(403, "Forbidden: Insufficient rights", "FORBIDDEN"));
        }

        next();
    };
};
