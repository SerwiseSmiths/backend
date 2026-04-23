"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWalletHistory = exports.debitWallet = exports.creditWallet = exports.createWallet = exports.getWallet = void 0;
const walletRepo = require("../repositories/wallet.repo");
const userRepo = require("../repositories/user.repo");
const mongoose = require("mongoose");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
const ApiSuccess_api_util_1 = require("../utils/api/ApiSuccess.api.util");
const wallet_type_1 = require("../types/wallet.type");
const getWallet = async (userId) => {
    let wallet = await walletRepo.getWalletByUserId(userId);
    if (!wallet) {
        // Optionally auto-create wallet if it doesn't exist, or throw error
        // For now, let's auto-create for better UX if user is valid?
        // User validation should strictly happen before this call in controller or upstream
        wallet = await walletRepo.createWallet(userId);
    }
    return new ApiSuccess_api_util_1.default(200, "Wallet fetched successfully", { wallet });
};
exports.getWallet = getWallet;
const createWallet = async (userId) => {
    const wallet = await walletRepo.createWallet(userId);
    return new ApiSuccess_api_util_1.default(201, "Wallet created successfully", { wallet });
};
exports.createWallet = createWallet;
const creditWallet = async (userId, amount, source, refId, meta) => {
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
        const updatedWallet = await walletRepo.updateWalletBalance(userId, amount, session);
        if (!updatedWallet) {
            throw new ApiError_api_util_1.default(500, "Failed to update wallet balance");
        }
        // Create Ledger Entry
        await walletRepo.createLedgerEntry({
            wallet: updatedWallet._id.toString(),
            user: userId,
            type: wallet_type_1.WalletLedgerType.CREDIT,
            source,
            amount,
            openingBalance,
            closingBalance,
            ...(refId && { refId }),
            meta,
        }, session);
        await session.commitTransaction();
        session.endSession();
        return new ApiSuccess_api_util_1.default(200, "Wallet credited successfully", {
            wallet: updatedWallet,
        });
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
exports.creditWallet = creditWallet;
const debitWallet = async (userId, amount, source, refId, meta) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const wallet = await walletRepo.getWalletByUserId(userId);
        if (!wallet) {
            throw new ApiError_api_util_1.default(404, "Wallet not found for user");
        }
        if (wallet.balance < amount && source !== wallet_type_1.WalletLedgerSource.ORDER_PAYMENT) {
            throw new ApiError_api_util_1.default(400, "Insufficient wallet balance");
        }
        const openingBalance = wallet.balance;
        const closingBalance = openingBalance - amount;
        // Update Wallet Balance (debit from sender)
        const updatedWallet = await walletRepo.updateWalletBalance(userId, -amount, // Negative amount for debit
        session);
        if (!updatedWallet) {
            throw new ApiError_api_util_1.default(500, "Failed to update wallet balance");
        }
        // Create Ledger Entry for sender (debit)
        const ledgerEntry = await walletRepo.createLedgerEntry({
            wallet: updatedWallet._id.toString(),
            user: userId,
            type: wallet_type_1.WalletLedgerType.DEBIT,
            source,
            amount,
            openingBalance,
            closingBalance,
            ...(refId && { refId }),
            meta,
        }, session);
        // If source is transfer and refId is provided (recipient's phone number),
        // credit the recipient's wallet
        if (source === wallet_type_1.WalletLedgerSource.TRASFER && refId) {
            const recipientUser = await userRepo.retriveUserByPhoneNo(refId);
            if (!recipientUser) {
                throw new ApiError_api_util_1.default(404, "Recipient user not found with the provided phone number");
            }
            // Get or create recipient's wallet
            let recipientWallet = await walletRepo.getWalletByUserId(recipientUser._id.toString());
            if (!recipientWallet) {
                recipientWallet = await walletRepo.createWallet(recipientUser._id.toString());
            }
            const recipientOpeningBalance = recipientWallet.balance;
            const recipientClosingBalance = recipientOpeningBalance + amount;
            // Update recipient's wallet balance
            const updatedRecipientWallet = await walletRepo.updateWalletBalance(recipientUser._id.toString(), amount, session);
            if (!updatedRecipientWallet) {
                throw new ApiError_api_util_1.default(500, "Failed to update recipient wallet balance");
            }
            // Create Ledger Entry for recipient (credit)
            await walletRepo.createLedgerEntry({
                wallet: updatedRecipientWallet._id.toString(),
                user: recipientUser._id.toString(),
                type: wallet_type_1.WalletLedgerType.CREDIT,
                source: wallet_type_1.WalletLedgerSource.TRASFER,
                amount,
                openingBalance: recipientOpeningBalance,
                closingBalance: recipientClosingBalance,
                refId: userId, // Sender's user ID as reference
                meta: {
                    ...(meta || {}),
                    senderUserId: userId,
                    transferType: "incoming",
                },
            }, session);
        }
        await session.commitTransaction();
        session.endSession();
        return new ApiSuccess_api_util_1.default(200, "Wallet debited successfully", {
            wallet: updatedWallet,
            ledger: ledgerEntry,
        });
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
exports.debitWallet = debitWallet;
const getWalletHistory = async (userId, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const history = await walletRepo.getLedgerByUserId(userId, limit, skip);
    return new ApiSuccess_api_util_1.default(200, "Wallet history fetched successfully", { history });
};
exports.getWalletHistory = getWalletHistory;
//# sourceMappingURL=wallet.services.js.map