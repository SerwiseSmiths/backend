import { Document, Model } from "mongoose";
export interface IWaitlist {
    phoneNo: string;
    countryCode: string;
    joinedAt: Date;
    notifiedViaTruecaller: boolean;
    truecallerNotifiedAt?: Date;
    source?: string;
}
export interface WaitlistDocument extends IWaitlist, Document {
}
declare const WaitlistModel: Model<WaitlistDocument>;
export default WaitlistModel;
//# sourceMappingURL=Waitlist.schema.d.ts.map