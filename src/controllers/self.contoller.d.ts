export type HomeStats = {
    name: string;
    notifications: number;
    wallet: number;
};
export declare const home: (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => Promise<any>;
export declare const getSelfAddress: (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => Promise<any>;
export declare const getSelfDevices: (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => Promise<any>;
export declare const getSelfWallet: (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => Promise<any>;
export declare const getSelfComaplints: (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => Promise<any>;
export declare const updateProfileImage: (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => Promise<any>;
export declare const updateSelfInfo: (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => Promise<any>;
//# sourceMappingURL=self.contoller.d.ts.map