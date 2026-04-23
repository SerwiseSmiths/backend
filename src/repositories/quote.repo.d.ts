import { IQuote } from "../models/schema/Quote.schema";
export declare const createQuote: (data: Partial<IQuote>) => Promise<IQuote | null>;
export declare const retrieveAllQuotes: () => Promise<IQuote[]>;
export declare const retrieveQuoteById: (id: string) => Promise<IQuote | null>;
export declare const updateQuoteById: (id: string, data: Partial<IQuote>) => Promise<IQuote | null>;
export declare const deleteQuoteById: (id: string) => Promise<IQuote | null>;
//# sourceMappingURL=quote.repo.d.ts.map