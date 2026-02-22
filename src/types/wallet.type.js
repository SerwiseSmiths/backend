"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletLedgerSource = exports.WalletLedgerType = void 0;
var WalletLedgerType;
(function (WalletLedgerType) {
    WalletLedgerType["CREDIT"] = "credit";
    WalletLedgerType["DEBIT"] = "debit";
})(WalletLedgerType || (exports.WalletLedgerType = WalletLedgerType = {}));
var WalletLedgerSource;
(function (WalletLedgerSource) {
    WalletLedgerSource["RECHARGE"] = "recharge";
    WalletLedgerSource["ORDER_PAYMENT"] = "order_payment";
    WalletLedgerSource["REFUND"] = "refund";
    WalletLedgerSource["ADMIN_ADJUSTMENT"] = "admin_adjustment";
    WalletLedgerSource["CASHBACK"] = "cashback";
    WalletLedgerSource["TRASFER"] = "transfer";
})(WalletLedgerSource || (exports.WalletLedgerSource = WalletLedgerSource = {}));
//# sourceMappingURL=wallet.type.js.map