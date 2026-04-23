import ApiSuccess from "../utils/api/ApiSuccess.api.util";
import { IQuote } from "../models/schema/Quote.schema";
export declare function createQuote(data: Partial<IQuote>): Promise<ApiSuccess<{
    quote: IQuote | null;
}>>;
export declare function getAllQuotes(): Promise<ApiSuccess<{
    quotes: IQuote[];
}>>;
export declare function getQuoteById(id: string): Promise<ApiSuccess<{
    quote: IQuote;
}>>;
export declare function updateQuote(id: string, data: Partial<IQuote>): Promise<ApiSuccess<{
    quote: IQuote;
}>>;
export declare function updateQuoteStatus(id: string, status: "PENDING" | "APPROVED" | "REJECTED", reason?: string): Promise<ApiSuccess<{
    quote: IQuote;
    complaintId: import("mongoose").Types.ObjectId | undefined;
}>>;
export declare function deleteQuote(id: string): Promise<ApiSuccess<unknown>>;
//# sourceMappingURL=quote.service.d.ts.map