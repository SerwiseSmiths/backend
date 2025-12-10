import * as crypto from "crypto";

export const verifySignature = (signature: string, payload: any) => {
  const secret = process.env.CASHFREE_WEBHOOK_SECRET!;

  const computed = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(payload))
    .digest("base64");

  return computed === signature;
};
