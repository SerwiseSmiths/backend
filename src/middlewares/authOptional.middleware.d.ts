import { Request, Response, NextFunction } from "express";
/**
 * Optional Auth middleware — populates req.user if a valid Bearer token is present,
 * but does NOT block the request if no token is provided.
 * Use this for endpoints that should work both authenticated and anonymous.
 */
export declare const authOptional: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=authOptional.middleware.d.ts.map