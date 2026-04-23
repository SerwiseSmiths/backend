import { HydratedDocument, Document } from "mongoose";
import { IMedia } from "./media.type";
export type complaintStages = "ENTRANCE" | "QR_VALIDATED" | "ESTIMATION" | "APPROVAL" | "PAYMENT" | "COMPLETED" | "REJECTED";
export interface IComplaintPayment {
    method: "wallet" | "online" | "cash";
    amount: number;
    referenceId: string;
    date: Date;
}
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
    payments: IComplaintPayment[];
    totalAmount: number;
    remainingAmount: number;
    calculatedPaymentAmount?: number | null;
    calculatedPaymentAt?: Date | null;
    emiApplied?: number | null;
    providerCut?: number | null;
    cashCollected?: boolean;
    cashCollectedAt?: Date | null;
    serviceIndex?: number | null;
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
    paymentRef?: string | null;
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
    userSubscriptionId?: mongodbId;
    useSubscription?: boolean;
    paymentMethod?: "online" | "cash" | "wallet" | "wallet_cash" | "wallet_online";
    paymentRef?: string;
}
export interface IUpdateComplaintInput {
    title?: string;
    addressId?: mongodbId;
    deviceTypeId?: string;
    deviceId?: mongodbId;
    notes?: string;
    media?: IMedia[];
    subscriptionId?: mongodbId;
    userSubscriptionId?: mongodbId;
    serviceIndex?: number;
    payment?: mongodbId;
}
//# sourceMappingURL=comlpaint.type.d.ts.map