import { IOtp } from "../models/schema/Otp.schema";
export declare const upsertOtp: (phoneNo: string, hash: string, expiresAt: Date) => Promise<IOtp>;
export declare const findLatestActiveOtp: (phoneNo: string) => Promise<IOtp | null>;
export declare const consumeOtp: (id: string) => Promise<void>;
export declare const incrementAttempts: (id: string) => Promise<void>;
//# sourceMappingURL=otp.repo.d.ts.map