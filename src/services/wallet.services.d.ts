import ApiSuccess from "../utils/api/ApiSuccess.api.util";
import { WalletLedgerSource } from "../types/wallet.type";
export declare const getWallet: (userId: string) => Promise<ApiSuccess<{
    wallet: import("../types/wallet.type").WalletDocument;
}>>;
export declare const createWallet: (userId: string) => Promise<ApiSuccess<{
    wallet: import("../types/wallet.type").WalletDocument;
}>>;
export declare const creditWallet: (userId: string, amount: number, source: WalletLedgerSource, refId?: string, meta?: any) => Promise<ApiSuccess<{
    wallet: import("../types/wallet.type").WalletDocument;
}>>;
export declare const debitWallet: (userId: string, amount: number, source: WalletLedgerSource, refId?: string, meta?: any) => Promise<ApiSuccess<{
    wallet: import("../types/wallet.type").WalletDocument;
    ledger: import("../types/wallet.type").WalletLedgerDocument;
}>>;
export declare const getWalletHistory: (userId: string, page?: number, limit?: number) => Promise<ApiSuccess<{
    history: import("../types/wallet.type").WalletLedgerDocument[];
}>>;
//# sourceMappingURL=wallet.services.d.ts.map