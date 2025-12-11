import { Document } from "mongoose";
import { IService } from "./Service.schema";
export interface IQuote extends Document {
    items: IService[];
    total: number;
    isPaid: boolean;
}
export declare const QuoteModel: import("mongoose").Model<IQuote, {}, {}, {}, Document<unknown, {}, IQuote, {}, {}> & IQuote & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Quote.schema.d.ts.map