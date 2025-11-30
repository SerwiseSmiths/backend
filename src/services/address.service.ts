import * as addressRepo from "../repositories/address.repo";
import { addressValidationSchema } from "../models/validation/address.validation";

import ApiSuccess from "../utils/api/ApiSuccess.api.util";
import ApiError from "../utils/api/ApiError.api.util";
import { AddressApiData } from "../types/address.type";

export async function createAddress(_data: any) {
  const { error, value } = addressValidationSchema.validate(_data);
  if (error) {
    console.log(error)
    throw new ApiError(
      400,
      `Validation Error: ${error.details.map((d) => d.message).join(", ")}`
    );
  }

  const address = await addressRepo.createAddress(value);
  console.log(address)

  return new ApiSuccess<AddressApiData>(201, "Address created successfully", {
    address,
  });
}

export async function getUserAddresses(userId: any) {
  const addresses = await addressRepo.getAddressesByUser(userId);

  return new ApiSuccess(200, "Addresses retrieved", { addresses });
}

export async function getAddress(id: any) {
  const address = await addressRepo.getAddressById(id);
  if (!address) throw new ApiError(404, "Address not found");

  return new ApiSuccess(200, "Address retrieved", { address });
}

export async function updateAddress(id: any, data: any) {
  const address = await addressRepo.updateAddress(id, data);
  if (!address) throw new ApiError(404, "Address not found");

  return new ApiSuccess(200, "Address updated successfully", { address });
}

export async function deleteAddress(id: any) {
  const deleted = await addressRepo.deleteAddress(id);
  if (!deleted) throw new ApiError(404, "Address not found");

  return new ApiSuccess(200, "Address deleted successfully");
}
