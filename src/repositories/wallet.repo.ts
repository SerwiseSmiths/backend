import WalletModel from "../models/schema/Wallet.schema";
import WalletLedgerModel from "../models/schema/WalletLedger.schema";
import {
    IWallet,
    IWalletLedger,
    WalletDocument,
    WalletLedgerDocument,
} from "../types/wallet.type";

// ==========================================
// Wallet Operations
// ==========================================

export const createWallet = async (userId: string): Promise<WalletDocument> => {
    const wallet = new WalletModel({
        user: userId,
        balance: 0,
    });
    return (await wallet.save()) as unknown as WalletDocument;
};

export const getWalletByUserId = async (
    userId: string
): Promise<WalletDocument | null> => {
    return (await WalletModel.findOne({ user: userId })) as unknown as WalletDocument;
};

export const updateWalletBalance = async (
    userId: string,
    amount: number, // can be positive or negative
    session?: any
): Promise<WalletDocument | null> => {
    return (await WalletModel.findOneAndUpdate(
        { user: userId },
        { $inc: { balance: amount } },
        { new: true, session }
    )) as unknown as WalletDocument;
};

// ==========================================
// Ledger Operations
// ==========================================

export const createLedgerEntry = async (
    entry: Partial<IWalletLedger>,
    session?: any
): Promise<WalletLedgerDocument> => {
    const ledger = new WalletLedgerModel(entry);
    return (await ledger.save({ session })) as unknown as WalletLedgerDocument;
};

export const getLedgerByWalletId = async (
    walletId: string,
    limit: number = 20,
    skip: number = 0
): Promise<WalletLedgerDocument[]> => {
    return (await WalletLedgerModel.find({ wallet: walletId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)) as unknown as WalletLedgerDocument[];
};

export const getLedgerByUserId = async (
    userId: string,
    limit: number = 20,
    skip: number = 0
): Promise<WalletLedgerDocument[]> => {
    return (await WalletLedgerModel.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)) as unknown as WalletLedgerDocument[];
};
