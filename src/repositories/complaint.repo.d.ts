import { IComplaint } from "../types/comlpaint.type";
export declare const createComplaint: (data: Partial<IComplaint>) => Promise<Omit<import("mongoose").Document<unknown, {}, IComplaint, {}, {}> & IComplaint & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, never>>;
export declare const findComplaintById: (id: mongodbId) => Promise<(import("mongoose").Document<unknown, {}, IComplaint, {}, {}> & IComplaint & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}) | null>;
export declare const updateComplaint: (id: mongodbId, data: Partial<IComplaint>) => Promise<(import("mongoose").Document<unknown, {}, IComplaint, {}, {}> & IComplaint & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}) | null>;
export declare const deleteComplaint: (id: mongodbId) => Promise<(import("mongoose").Document<unknown, {}, IComplaint, {}, {}> & IComplaint & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}) | null>;
export declare const listComplaints: () => Promise<(import("mongoose").Document<unknown, {}, IComplaint, {}, {}> & IComplaint & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
})[]>;
export declare const listComplaintsByUser: (userId: mongodbId) => Promise<(import("mongoose").Document<unknown, {}, IComplaint, {}, {}> & IComplaint & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
})[]>;
export declare const listComplaintsByProvider: (providerId: mongodbId) => Promise<(import("mongoose").Document<unknown, {}, IComplaint, {}, {}> & IComplaint & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
})[]>;
export declare const listComplaintsByStage: (stage: string) => Promise<(import("mongoose").Document<unknown, {}, IComplaint, {}, {}> & IComplaint & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
})[]>;
export declare const findComplaintsByParentId: (parentId: mongodbId) => Promise<(import("mongoose").Document<unknown, {}, IComplaint, {}, {}> & IComplaint & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
})[]>;
//# sourceMappingURL=complaint.repo.d.ts.map