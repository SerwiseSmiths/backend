import * as walletRepo from "../repositories/wallet.repo";
import * as mongoose from "mongoose";
import ApiError from "../utils/api/ApiError.api.util";
import ApiSuccess from "../utils/api/ApiSuccess.api.util";
import {
    WalletLedgerSource,
    WalletLedgerType,
} from "../types/wallet.type";

export const getWallet = async (userId: string) => {
    let wallet = await walletRepo.getWalletByUserId(userId);
    if (!wallet) {
        // Optionally auto-create wallet if it doesn't exist, or throw error
        // For now, let's auto-create for better UX if user is valid?
        // User validation should strictly happen before this call in controller or upstream
        wallet = await walletRepo.createWallet(userId);
    }

    return new ApiSuccess(200, "Wallet fetched successfully", { wallet });
};

export const creditWallet = async (
    userId: string,
    amount: number,
    source: WalletLedgerSource,
    refId?: string,
    meta?: any
) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let wallet = await walletRepo.getWalletByUserId(userId);
        if (!wallet) {
            wallet = await walletRepo.createWallet(userId);
        }

        const openingBalance = wallet.balance;
        const closingBalance = openingBalance + amount;

        // Update Wallet Balance
        const updatedWallet = await walletRepo.updateWalletBalance(
            userId,
            amount,
            session
        );

        if (!updatedWallet) {
            throw new ApiError(500, "Failed to update wallet balance");
        }

        // Create Ledger Entry
        await walletRepo.createLedgerEntry(
            {
                wallet: updatedWallet._id.toString(),
                user: userId,
                type: WalletLedgerType.CREDIT,
                source,
                amount,
                openingBalance,
                closingBalance,
                refId: refId || undefined,
                meta,
            },
            session
        );

        await session.commitTransaction();
        session.endSession();

        return new ApiSuccess(200, "Wallet credited successfully", {
            wallet: updatedWallet,
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const debitWallet = async (
    userId: string,
    amount: number,
    source: WalletLedgerSource,
    refId?: string,
    meta?: any
) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const wallet = await walletRepo.getWalletByUserId(userId);
        if (!wallet) {
            throw new ApiError(404, "Wallet not found for user");
        }

        if (wallet.balance < amount) {
            throw new ApiError(400, "Insufficient wallet balance");
        }

        const openingBalance = wallet.balance;
        const closingBalance = openingBalance - amount;

        // Update Wallet Balance
        const updatedWallet = await walletRepo.updateWalletBalance(
            userId,
            -amount, // Negative amount for debit
            session
        );

        if (!updatedWallet) {
            throw new ApiError(500, "Failed to update wallet balance");
        }

        // Create Ledger Entry
        await walletRepo.createLedgerEntry(
            {
                wallet: updatedWallet._id.toString(),
                user: userId,
                type: WalletLedgerType.DEBIT,
                source,
                amount,
                openingBalance,
                closingBalance,
                refId: refId || undefined,
                meta,
            },
            session
        );

        await session.commitTransaction();
        session.endSession();

        return new ApiSuccess(200, "Wallet debited successfully", {
            wallet: updatedWallet,
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const getWalletHistory = async (userId: string, page: number = 1, limit: number = 20) => {
    const skip = (page - 1) * limit;
    const history = await walletRepo.getLedgerByUserId(userId, limit, skip);
    return new ApiSuccess(200, "Wallet history fetched successfully", { history });
}
