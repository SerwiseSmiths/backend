import { IContactEntry } from "../types/contact.type";
import ApiSuccess from "../utils/api/ApiSuccess.api.util";
export declare const syncContacts: (ownerId: string, contacts: IContactEntry[]) => Promise<ApiSuccess<{
    totalSynced: number;
    lastSynced: Date;
}>>;
export declare const getContacts: (ownerId: string) => Promise<ApiSuccess<{
    contacts: IContactEntry[];
    lastSynced: Date | null;
}>>;
//# sourceMappingURL=contact.service.d.ts.map