import * as walletRepo from "../repositories/wallet.repo";
import * as userRepo from "../repositories/user.repo";
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

export const createWallet = async (userId: string) => {
    const wallet = await walletRepo.createWallet(userId);
    return new ApiSuccess(201, "Wallet created successfully", { wallet });
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
                ...(refId && { refId }),
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

        if (wallet.balance < amount && source !== WalletLedgerSource.ORDER_PAYMENT) {
            throw new ApiError(400, "Insufficient wallet balance");
        }

        const openingBalance = wallet.balance;
        const closingBalance = openingBalance - amount;

        // Update Wallet Balance (debit from sender)
        const updatedWallet = await walletRepo.updateWalletBalance(
            userId,
            -amount, // Negative amount for debit
            session
        );

        if (!updatedWallet) {
            throw new ApiError(500, "Failed to update wallet balance");
        }

        // Create Ledger Entry for sender (debit)
        const ledgerEntry = await walletRepo.createLedgerEntry(
            {
                wallet: updatedWallet._id.toString(),
                user: userId,
                type: WalletLedgerType.DEBIT,
                source,
                amount,
                openingBalance,
                closingBalance,
                ...(refId && { refId }),
                meta,
            },
            session
        );

        // If source is transfer and refId is provided (recipient's phone number),
        // credit the recipient's wallet
        if (source === WalletLedgerSource.TRASFER && refId) {
            const recipientUser = await userRepo.retriveUserByPhoneNo(refId);
            if (!recipientUser) {
                throw new ApiError(404, "Recipient user not found with the provided phone number");
            }

            // Get or create recipient's wallet
            let recipientWallet = await walletRepo.getWalletByUserId(recipientUser._id.toString());
            if (!recipientWallet) {
                recipientWallet = await walletRepo.createWallet(recipientUser._id.toString());
            }

            const recipientOpeningBalance = recipientWallet.balance;
            const recipientClosingBalance = recipientOpeningBalance + amount;

            // Update recipient's wallet balance
            const updatedRecipientWallet = await walletRepo.updateWalletBalance(
                recipientUser._id.toString(),
                amount,
                session
            );

            if (!updatedRecipientWallet) {
                throw new ApiError(500, "Failed to update recipient wallet balance");
            }

            // Create Ledger Entry for recipient (credit)
            await walletRepo.createLedgerEntry(
                {
                    wallet: updatedRecipientWallet._id.toString(),
                    user: recipientUser._id.toString(),
                    type: WalletLedgerType.CREDIT,
                    source: WalletLedgerSource.TRASFER,
                    amount,
                    openingBalance: recipientOpeningBalance,
                    closingBalance: recipientClosingBalance,
                    refId: userId, // Sender's user ID as reference
                    meta: {
                        ...(meta || {}),
                        senderUserId: userId,
                        transferType: "incoming",
                    },
                },
                session
            );
        }

        await session.commitTransaction();
        session.endSession();

        return new ApiSuccess(200, "Wallet debited successfully", {
            wallet: updatedWallet,
            ledger: ledgerEntry,
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
