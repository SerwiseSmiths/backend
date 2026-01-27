import { HydratedDocument } from "mongoose";
import { IQuote } from "../models/schema/Quote.schema";
import { IUser } from "./user.type";
import { IAddress } from "./address.type";
import { IDevice } from "./device.type";


export interface IComplaint extends Document {
  title: string;
  user: mongodbId;
  provider: mongodbId | null;
  address: mongodbId;
  stage: complaintStages;
  parent: mongodbId | null;
  quote: mongodbId | null;
  device: mongodbId | null;
  deviceType: mongodbId | null;
}

export type ComplaintDocument = HydratedDocument<IComplaint>;

export type complaintApiData = { complaint: ComplaintDocument | null };

export type complaintStages = "Entrance" | "Estimation" | "Approval" | "Payment";