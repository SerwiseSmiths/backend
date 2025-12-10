import { Cashfree, CFEnvironment } from "cashfree-pg";

// Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID!;
// Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET!;
// Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION; // or SANDBOX

// const cashfree = new Cashfree({
//   env: process.env.CASHFREE_ENV === "PROD" ? "PROD" : "TEST",
// });

const cashfree = new Cashfree(
process.env.CASHFREE_ENV === "PROD" 
    ? CFEnvironment.PRODUCTION 
    : CFEnvironment.SANDBOX,
  process.env.CASHFREE_CLIENT_ID,
  process.env.CASHFREE_CLIENT_SECRET
);

export default cashfree;
