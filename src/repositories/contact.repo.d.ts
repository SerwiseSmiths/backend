import { ContactDocument, IContactEntry } from "../types/contact.type";
import mongoose from "mongoose";
export declare const upsertContacts: (ownerId: mongoose.Types.ObjectId | string, contacts: IContactEntry[]) => Promise<ContactDocument>;
export declare const getContactsByOwner: (ownerId: mongoose.Types.ObjectId | string) => Promise<ContactDocument | null>;
//# sourceMappingURL=contact.repo.d.ts.map