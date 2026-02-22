import { Request, Response, NextFunction } from "express";
export declare const getWallet: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createWallet: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getWalletByUserId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const creditWallet: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const debitWallet: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getHistory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=wallet.controller.d.ts.map