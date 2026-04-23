import ApiSuccess from "../utils/api/ApiSuccess.api.util";
export declare const joinWaitlist: (phoneNo: string, countryCode?: string, source?: string) => Promise<ApiSuccess<{
    alreadyJoined: boolean;
    joinedAt: Date;
}>>;
export declare const getWaitlist: () => Promise<ApiSuccess<{
    total: number;
    entries: import("../models/schema/Waitlist.schema").WaitlistDocument[];
}>>;
//# sourceMappingURL=waitlist.service.d.ts.map