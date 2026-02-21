// controllers/upload.controller.ts
import { Request, Response, NextFunction } from "express";
import * as uploadService from "../services/upload.service";

export const uploadSingle = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await uploadService.uploadSingleFile(req);
        res.status(result.statusCode).json(result);
    } catch (err) {
        next(err);
    }
};

export const uploadMultiple = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await uploadService.uploadMultipleFiles(req);
        res.status(result.statusCode).json(result);
    } catch (err) {
        next(err);
    }
};

export const uploadProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await uploadService.uploadProfileFile(req);
        res.status(result.statusCode).json(result);
    } catch (err) {
        next(err);
    }
};