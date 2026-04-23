import type { Request, Response } from "express";
/**
 * GET /config/app-version?app=radix|serwise
 * Public endpoint. Returns latest version, minimum required version, and store URL.
 * Client compares current app version:
 *   - If current < minRequiredVersion → force update
 *   - If current < latestVersion → optional update
 */
export declare function getAppVersion(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * GET /config/serwise
 * Returns configuration for Serwise app.
 */
export declare function getSerwiseConfig(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * GET /config/radix
 * Returns configuration for Radix app.
 */
export declare function getRadixConfig(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=config.controller.d.ts.map