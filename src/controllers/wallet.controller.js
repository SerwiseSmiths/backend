"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistory = exports.debitWallet = exports.creditWallet = exports.getWalletByUserId = exports.createWallet = exports.getWallet = void 0;
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
const walletService = require("../services/wallet.services");
const wallet_validation_1 = require("../models/validation/wallet.validation");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
const getWallet = async (req, res, next) => {
    try {
        // Assuming authentication middleware populates req.user
        const userId = req.user?._id || req.user?.id;
        if (!userId) {
            throw new ApiError_api_util_1.default(401, "Unauthorized");
        }
        const result = await walletService.getWallet(userId);
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getWallet = getWallet;
const createWallet = async (req, res, next) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            throw new ApiError_api_util_1.default(400, "User ID is required");
        }
        const result = await walletService.createWallet(userId);
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.createWallet = createWallet;
const getWalletByUserId = async (req, res, next) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            throw new ApiError_api_util_1.default(400, "User ID is required");
        }
        const result = await walletService.getWallet(userId);
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getWalletByUserId = getWalletByUserId;
const creditWallet = async (req, res, next) => {
    try {
        const { amount, source, refId, meta } = req.body;
        // Assuming authentication middleware populates req.user
        const userId = req.user?._id || req.user?.id;
        // Validate request body
        const { error } = wallet_validation_1.creditWalletSchema.validate({ userId, amount, source, refId, meta });
        if (error) {
            throw new ApiError_api_util_1.default(400, `Validation Error: ${error.details.map(d => d.message).join(", ")}`);
        }
        const result = await walletService.creditWallet(userId, amount, source, refId, meta);
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.creditWallet = creditWallet;
const debitWallet = async (req, res, next) => {
    try {
        const { amount, source, refId, meta } = req.body;
        // Assuming authentication middleware populates req.user
        const userId = req.user?._id || req.user?.id;
        // Validate request body
        const { error } = wallet_validation_1.debitWalletSchema.validate({ userId, amount, source, refId, meta });
        if (error) {
            throw new ApiError_api_util_1.default(400, `Validation Error: ${error.details.map(d => d.message).join(", ")}`);
        }
        const result = await walletService.debitWallet(userId, amount, source, refId, meta);
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.debitWallet = debitWallet;
const getHistory = async (req, res, next) => {
    try {
        const userId = req.user?._id || req.user?.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const result = await walletService.getWalletHistory(userId, page, limit);
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getHistory = getHistory;
//# sourceMappingURL=wallet.controller.js.map