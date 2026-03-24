import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const ACCESS_SECRET = process.env.JWT_SECRET as string;

/**
 * Optional Auth middleware — populates req.user if a valid Bearer token is present,
 * but does NOT block the request if no token is provided.
 * Use this for endpoints that should work both authenticated and anonymous.
 */
export const authOptional = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
            const decoded = jwt.verify(token, ACCESS_SECRET) as jwt.JwtPayload;
            (req as any).user = decoded;
        }
    } catch {
        // Invalid token — treat as unauthenticated (don't block)
    }
    next();
};
