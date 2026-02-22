import { IWalletLedger, WalletDocument, WalletLedgerDocument } from "../types/wallet.type";
export declare const createWallet: (userId: string) => Promise<WalletDocument>;
export declare const getWalletByUserId: (userId: string) => Promise<WalletDocument | null>;
export declare const updateWalletBalance: (userId: string, amount: number, // can be positive or negative
session?: any) => Promise<WalletDocument | null>;
export declare const createLedgerEntry: (entry: Partial<IWalletLedger>, session?: any) => Promise<WalletLedgerDocument>;
export declare const getLedgerByWalletId: (walletId: string, limit?: number, skip?: number) => Promise<WalletLedgerDocument[]>;
export declare const getLedgerByUserId: (userId: string, limit?: number, skip?: number) => Promise<WalletLedgerDocument[]>;
//# sourceMappingURL=wallet.repo.d.ts.map