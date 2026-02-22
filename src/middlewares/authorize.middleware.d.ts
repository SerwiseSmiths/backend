import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
export declare const authorize: (roles?: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=authorize.middleware.d.ts.map