import { Document } from "mongoose";

export interface IWallet {
  user: string; // User ID
  balance: number;
  isActive: boolean;
}

export interface WalletDocument extends IWallet, Document {
  createdAt: Date;
  updatedAt: Date;
}

export enum WalletLedgerType {
  CREDIT = "credit",
  DEBIT = "debit",
}

export enum WalletLedgerSource {
  RECHARGE = "recharge",
  ORDER_PAYMENT = "order_payment",
  REFUND = "refund",
  ADMIN_ADJUSTMENT = "admin_adjustment",
  CASHBACK = "cashback",
  TRASFER = "transfer"
}

export interface IWalletLedger {
  wallet: string; // Wallet ID
  user: string; // User ID
  type: WalletLedgerType;
  source: WalletLedgerSource;
  amount: number;
  openingBalance: number;
  closingBalance: number;
  refId?: string; // Reference ID (Order ID, etc.)
  meta?: Record<string, any>;
}

export interface WalletLedgerDocument extends IWalletLedger, Document {
  createdAt: Date;
  updatedAt: Date;
}
