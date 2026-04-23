import { Request, Response, NextFunction } from "express";
// Actually user.controller.ts used `ExpressRequest` which implies it is either globally defined or imported. 
// Checking user.controller.ts again... it has no imports for ExpressRequest. It must be global d.ts or similar.
// But to be safe I will just use `any` or standard express types if I can't find the definition file easily, 
// OR better, I will just assume it is available in global scope as seen in user.controller.ts. 
// Wait, I see `import type { Application, Request, Response } from "express";` in app.ts.
// In user.controller.ts: `req: ExpressRequest`. I will assume global namespace.
// But strict mode might complain.
// Let's assume standard express Request/Response for now to avoid compilation errors if global types are not reliable for me to see.
// Actually, I saw user.controller.ts uses `req: ExpressRequest`.
// I will try to use the same. If it fails I will fix it.

import * as walletService from "../services/wallet.services";
import { creditWalletSchema, debitWalletSchema } from "../models/validation/wallet.validation";
import ApiError from "../utils/api/ApiError.api.util";
import ApiSuccess from "../utils/api/ApiSuccess.api.util";


export const getWallet = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Assuming authentication middleware populates req.user
        const userId = (req as any).user?._id || (req as any).user?.id;
        if (!userId) {
            throw new ApiError(401, "Unauthorized");
        }

        const result = await walletService.getWallet(userId);
        res.status(result.statusCode).json(result);
    } catch (error) {
        next(error);
    }
};

export const createWallet = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            throw new ApiError(400, "User ID is required");
        }

        const result = await walletService.createWallet(userId);
        res.status(result.statusCode).json(result);
    } catch (error) {
        next(error);
    }
};

export const getWalletByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            throw new ApiError(400, "User ID is required");
        }

        const result = await walletService.getWallet(userId as string);
        res.status(result.statusCode).json(result);
    } catch (error) {
        next(error);
    }
};

export const creditWallet = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { amount, source, refId, meta } = req.body;
        // Assuming authentication middleware populates req.user
        const userId = (req as any).user?._id || (req as any).user?.id;

        // Validate request body
        const { error } = creditWalletSchema.validate({ userId, amount, source, refId, meta });
        if (error) {
            throw new ApiError(400, `Validation Error: ${error.details.map(d => d.message).join(", ")}`);
        }

        const result = await walletService.creditWallet(userId, amount, source, refId, meta);
        res.status(result.statusCode).json(result);
    } catch (error) {
        next(error);
    }
};

export const debitWallet = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { amount, source, refId, meta } = req.body;
        // Assuming authentication middleware populates req.user
        const userId = (req as any).user?._id || (req as any).user?.id;

        // Validate request body
        const { error } = debitWalletSchema.validate({ userId, amount, source, refId, meta });
        if (error) {
            throw new ApiError(400, `Validation Error: ${error.details.map(d => d.message).join(", ")}`);
        }

        const result = await walletService.debitWallet(userId, amount, source, refId, meta);
        res.status(result.statusCode).json(result);
    } catch (error) {
        next(error);
    }
};

export const getHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = (req as any).user?._id || (req as any).user?.id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const result = await walletService.getWalletHistory(userId, page, limit);
        res.status(result.statusCode).json(result);
    } catch (error) {
        next(error);
    }
}
