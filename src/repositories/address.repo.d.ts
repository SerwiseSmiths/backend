import { IAddress, AddressDocument } from "../types/address.type";
export declare const createAddress: (data: Partial<IAddress>) => Promise<AddressDocument>;
export declare const getAddressesByUser: (userId: mongodbId) => Promise<AddressDocument[]>;
export declare const getAddressById: (id: mongodbId) => Promise<AddressDocument | null>;
export declare const updateAddress: (id: mongodbId, data: Partial<IAddress>) => Promise<AddressDocument | null>;
export declare const deleteAddress: (id: mongodbId) => Promise<boolean>;
//# sourceMappingURL=address.repo.d.ts.map