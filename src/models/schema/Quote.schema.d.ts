import { Document } from "mongoose";
export interface IQuote extends Document {
    items: (number | string)[];
    total: number;
    isPaid: boolean;
    status: "PENDING" | "APPROVED" | "REJECTED";
}
export declare const QuoteModel: import("mongoose").Model<IQuote, {}, {}, {}, Document<unknown, {}, IQuote, {}, {}> & IQuote & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Quote.schema.d.ts.map