import { HydratedDocument, Document } from "mongoose";
import { IMedia } from "./media.type";
export type complaintStages = "ENTRANCE" | "QR_VALIDATED" | "ESTIMATION" | "APPROVAL" | "PAYMENT" | "COMPLETED" | "REJECTED";
export interface IComplaint extends Document {
    title: string;
    user: mongodbId;
    provider: mongodbId | null;
    addressId: mongodbId;
    stage: complaintStages;
    parentId: mongodbId | null;
    quote: mongodbId | null;
    deviceId: mongodbId | null;
    deviceTypeId: string | null;
    notes: string;
    media: IMedia[];
    subscriptionId: mongodbId | null;
    payment: mongodbId | null;
    calculatedPaymentAmount?: number | null;
    calculatedPaymentAt?: Date | null;
    cashCollected?: boolean;
    cashCollectedAt?: Date | null;
    rejectionReason?: string | null;
    rejectionMetadata?: {
        rejectedAt: Date;
        rejectedBy: mongodbId;
    } | null;
    paymentVerificationStatus?: "pending" | "verified" | "rejected" | null;
    paymentVerificationToken?: string | null;
    paymentRequestedAt?: Date | null;
    providerAccepted?: boolean;
    providerAcceptedAt?: Date | null;
    providerAssignmentExpiry?: Date | null;
    /** Provider IDs that rejected or timed out (so we don't re-assign) */
    rejectedProviderIds?: mongodbId[];
    entryQrToken?: string | null;
    entryQrExpiresAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export type ComplaintDocument = HydratedDocument<IComplaint>;
export type complaintApiData = {
    complaint: ComplaintDocument | null;
};
export interface ICreateComplaintInput {
    title: string;
    addressId: mongodbId;
    deviceTypeId?: string;
    notes?: string;
    media?: IMedia[];
    parentId?: mongodbId;
    subscriptionId?: mongodbId;
}
export interface IUpdateComplaintInput {
    title?: string;
    addressId?: mongodbId;
    deviceTypeId?: string;
    deviceId?: mongodbId;
    notes?: string;
    media?: IMedia[];
    subscriptionId?: mongodbId;
    payment?: mongodbId;
}
//# sourceMappingURL=comlpaint.type.d.ts.map