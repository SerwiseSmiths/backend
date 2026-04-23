import { Request, Response, NextFunction } from "express";
export declare const registerDevice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const sendNotification: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getMyNotifications: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const markAsRead: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const testProviderNotification: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=notification.controller.d.ts.map