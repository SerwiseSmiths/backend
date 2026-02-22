"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cashfree_pg_1 = require("cashfree-pg");
// Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID!;
// Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET!;
// Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION; // or SANDBOX
// const cashfree = new Cashfree({
//   env: process.env.CASHFREE_ENV === "PROD" ? "PROD" : "TEST",
// });
const cashfree = new cashfree_pg_1.Cashfree(process.env.CASHFREE_ENV === "PROD"
    ? cashfree_pg_1.CFEnvironment.PRODUCTION
    : cashfree_pg_1.CFEnvironment.SANDBOX, process.env.CASHFREE_CLIENT_ID, process.env.CASHFREE_CLIENT_SECRET);
exports.default = cashfree;
//# sourceMappingURL=cashfree.config.js.map