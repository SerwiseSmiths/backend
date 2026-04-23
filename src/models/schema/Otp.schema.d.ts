import { Document, Model } from "mongoose";
export interface IOtp extends Document {
    phoneNo: string;
    otp: string;
    expiresAt: Date;
    consumed: boolean;
    attempts: number;
}
declare const OtpModel: Model<IOtp>;
export default OtpModel;
//# sourceMappingURL=Otp.schema.d.ts.map