/**
 * @file global.d.ts
 * @description Global type declarations
 * @module types/global
 */
import "express";
import type { Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNextFunction } from "express";
import {ApiErrorType as ErrorType} from "../utils/api/ApiError.api.util";
import {ApiSuccessType as SuccessType} from "../utils/api/ApiSuccess.api.util";
import {mongodbId} from "../config/mongo.config"

/**
 * Global TypeScript type declarations.
 * These are automatically available throughout the project
 * (no need to import manually).
 */
declare global {
    type ExpressRequest = ExpressRequest;
    type ExpressResponse = ExpressResponse;
    type ExpressNextFunction = ExpressNextFunction;

    /**
   * Standard API error structure for uniform error handling.
   */
    type ApiErrorType = ErrorType;
    
    /**
   * Standard API success structure for uniform success responses.
   */
    type ApiSuccessType<T> = SuccessType<T>;

    /** 
     * MONgodb ObjectId type */
    type mongodbId = mongodbId;
}