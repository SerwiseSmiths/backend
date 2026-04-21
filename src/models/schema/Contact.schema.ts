import mongoose, { Model, Schema } from "mongoose";
import { IContact, ContactDocument } from "../../types/contact.type";

const PhoneNumberSchema = new Schema(
  {
    label: { type: String, default: "mobile" },
    number: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const EmailAddressSchema = new Schema(
  {
    label: { type: String, default: "home" },
    email: { type: String, lowercase: true, trim: true },
  },
  { _id: false }
);

const ContactEntrySchema = new Schema(
  {
    deviceRecordId: { type: String },
    name: { type: String, trim: true, default: "" },
    phoneNumbers: { type: [PhoneNumberSchema], default: [] },
    emailAddresses: { type: [EmailAddressSchema], default: [] },
  },
  { _id: false }
);

const ContactSchema = new Schema<IContact>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    contacts: { type: [ContactEntrySchema], default: [] },
    lastSynced: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const ContactModel: Model<IContact> = mongoose.model<IContact>("Contact", ContactSchema);
export default ContactModel;
