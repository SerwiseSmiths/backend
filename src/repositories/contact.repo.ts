import ContactModel from "../models/schema/Contact.schema";
import { ContactDocument, IContactEntry } from "../types/contact.type";
import mongoose from "mongoose";

export const upsertContacts = async (
  ownerId: mongoose.Types.ObjectId | string,
  contacts: IContactEntry[]
): Promise<ContactDocument> => {
  const doc = await ContactModel.findOneAndUpdate(
    { owner: ownerId },
    {
      $set: {
        contacts,
        lastSynced: new Date(),
      },
    },
    { upsert: true, new: true }
  );
  return doc!;
};

export const getContactsByOwner = async (
  ownerId: mongoose.Types.ObjectId | string
): Promise<ContactDocument | null> => {
  return ContactModel.findOne({ owner: ownerId });
};
