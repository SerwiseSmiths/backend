import { HydratedDocument } from "mongoose";
export interface IAddress extends Document {
    user: mongodbId;
    title: string;
    house_no: string;
    society_name: string;
    address_line_one: string;
    address_line_two?: string;
    area: string;
    pin_code: string;
    city: string;
    state: string;
    country: string;
    latitude?: string;
    longitude?: string;
    is_deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export type AddressDocument = HydratedDocument<IAddress>;
export type AddressApiData = {
    address: AddressDocument;
};
//# sourceMappingURL=address.type.d.ts.map