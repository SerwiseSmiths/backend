import ApiSuccess from "../utils/api/ApiSuccess.api.util";
import { AddressApiData } from "../types/address.type";
export declare function createAddress(_data: any): Promise<ApiSuccess<AddressApiData>>;
export declare function getUserAddresses(userId: any): Promise<ApiSuccess<{
    addresses: (import("mongoose").Document<unknown, {}, import("../types/address.type").IAddress, {}, {}> & import("../types/address.type").IAddress & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[];
}>>;
export declare function getAddress(id: any): Promise<ApiSuccess<{
    address: import("mongoose").Document<unknown, {}, import("../types/address.type").IAddress, {}, {}> & import("../types/address.type").IAddress & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    };
}>>;
export declare function updateAddress(id: any, data: any): Promise<ApiSuccess<{
    address: import("mongoose").Document<unknown, {}, import("../types/address.type").IAddress, {}, {}> & import("../types/address.type").IAddress & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    };
}>>;
export declare function deleteAddress(id: any): Promise<ApiSuccess<unknown>>;
//# sourceMappingURL=address.service.d.ts.map