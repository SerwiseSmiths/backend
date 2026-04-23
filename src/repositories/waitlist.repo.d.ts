import { WaitlistDocument } from "../models/schema/Waitlist.schema";
export declare const findByPhoneNo: (phoneNo: string) => Promise<WaitlistDocument | null>;
export declare const create: (data: {
    phoneNo: string;
    countryCode: string;
    source?: string;
}) => Promise<WaitlistDocument>;
export declare const markTruecallerNotified: (phoneNo: string) => Promise<void>;
export declare const getAll: () => Promise<WaitlistDocument[]>;
export declare const count: () => Promise<number>;
//# sourceMappingURL=waitlist.repo.d.ts.map