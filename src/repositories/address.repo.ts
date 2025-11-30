import AddressModel from "../models/schema/Address.scema";
import { IAddress, AddressDocument } from "../types/address.type";
// import { mongodbId } from "../types/common";

export const createAddress = async (
  data: Partial<IAddress>
): Promise<AddressDocument> => {
  const newAddress = new AddressModel(data);
  await newAddress.save();
  return newAddress;
};

export const getAddressesByUser = async (
  userId: mongodbId
): Promise<AddressDocument[]> => {
  return AddressModel.find({ user: userId, is_deleted: false }).populate("user");
};

export const getAddressById = async (
  id: mongodbId
): Promise<AddressDocument | null> => {
  return AddressModel.findOne({ _id: id, is_deleted: false });
};

export const updateAddress = async (
  id: mongodbId,
  data: Partial<IAddress>
): Promise<AddressDocument | null> => {
  return AddressModel.findOneAndUpdate(
    { _id: id, is_deleted: false },
    data,
    { new: true }
  );
};

export const deleteAddress = async (
  id: mongodbId
): Promise<boolean> => {
  const result = await AddressModel.updateOne(
    { _id: id },
    { is_deleted: true }
  );
  return result.modifiedCount > 0;
};
