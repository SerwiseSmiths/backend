import { Document } from "mongoose";
export interface IWallet {
    user: string;
    balance: number;
    isActive: boolean;
}
export interface WalletDocument extends IWallet, Document {
    createdAt: Date;
    updatedAt: Date;
}
export declare enum WalletLedgerType {
    CREDIT = "credit",
    DEBIT = "debit"
}
export declare enum WalletLedgerSource {
    RECHARGE = "recharge",
    ORDER_PAYMENT = "order_payment",
    REFUND = "refund",
    ADMIN_ADJUSTMENT = "admin_adjustment",
    CASHBACK = "cashback",
    TRASFER = "transfer"
}
export interface IWalletLedger {
    wallet: string;
    user: string;
    type: WalletLedgerType;
    source: WalletLedgerSource;
    amount: number;
    openingBalance: number;
    closingBalance: number;
    refId?: string;
    meta?: Record<string, any>;
}
export interface WalletLedgerDocument extends IWalletLedger, Document {
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=wallet.type.d.ts.map