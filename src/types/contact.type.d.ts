import { HydratedDocument } from "mongoose";
import mongoose from "mongoose";
export interface IPhoneNumber {
    label: string;
    number: string;
}
export interface IEmailAddress {
    label: string;
    email: string;
}
export interface IContactEntry {
    deviceRecordId?: string;
    name: string;
    phoneNumbers: IPhoneNumber[];
    emailAddresses: IEmailAddress[];
}
export interface IContact extends Document {
    owner: mongoose.Types.ObjectId;
    contacts: IContactEntry[];
    lastSynced: Date;
}
export type ContactDocument = HydratedDocument<IContact>;
//# sourceMappingURL=contact.type.d.ts.map