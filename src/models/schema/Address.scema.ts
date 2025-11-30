import mongoose, { Schema, Model } from "mongoose";
import { IAddress } from "../../types/address.type";

const AddressSchema = new Schema<IAddress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: false, trim: true },
    house_no: { type: String, required: true },
    society_name: { type: String, required: true },
    address_line_one: { type: String, required: false },
    address_line_two: { type: String },
    area: { type: String, required: false },
    pin_code: { type: String, required: true, maxlength: 6 },
    city: { type: String, required: true },
    state: { type: String, required: false },
    country: { type: String, required: false, default:"India" },
    latitude: { type: String },
    longitude: { type: String },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

AddressSchema.index({ user: 1, is_deleted: 1 });

const AddressModel: Model<IAddress> = mongoose.model<IAddress>(
  "Address",
  AddressSchema
);

export default AddressModel;
