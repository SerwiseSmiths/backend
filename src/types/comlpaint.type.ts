import { HydratedDocument, Document } from "mongoose";
import { IMedia } from "./media.type";

export type complaintStages =
  | "ENTRANCE"
  | "ESTIMATION"
  | "APPROVAL"
  | "PAYMENT"
  | "COMPLETED"
  | "REJECTED";

export interface IComplaint extends Document {
  title: string;
  user: mongodbId;
  provider: mongodbId | null;
  addressId: mongodbId;
  stage: complaintStages;
  parentId: mongodbId | null;
  quote: mongodbId | null;
  deviceId: mongodbId | null;
  deviceTypeId: string | null; // Strapi CMS ID
  notes: string;
  media: IMedia[];
  subscriptionId: mongodbId | null;
  payment: mongodbId | null; // ref to WalletLedger

  // Rejection tracking
  rejectionReason?: string | null;
  rejectionMetadata?: {
    rejectedAt: Date;
    rejectedBy: mongodbId;
  } | null;

  // Payment verification
  paymentVerificationStatus?: "pending" | "verified" | "rejected" | null;
  paymentVerificationToken?: string | null;
  paymentRequestedAt?: Date | null;

  // Provider acceptance
  providerAccepted?: boolean;
  providerAcceptedAt?: Date | null;
  providerAssignmentExpiry?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

export type ComplaintDocument = HydratedDocument<IComplaint>;

export type complaintApiData = { complaint: ComplaintDocument | null };

// Input type for creating a complaint (fields from request body)
export interface ICreateComplaintInput {
  title: string;
  addressId: mongodbId;
  deviceTypeId?: string;
  notes?: string;
  media?: IMedia[];
  parentId?: mongodbId;
  subscriptionId?: mongodbId;
}

// Input type for updating a complaint
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