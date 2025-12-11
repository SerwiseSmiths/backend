import ApiSuccess from "../utils/api/ApiSuccess.api.util";
import { complaintStages, IComplaint } from "../types/comlpaint.type";
export declare const createComplaint: (data: Partial<IComplaint>, userId: mongodbId) => Promise<ApiSuccess<{
    complaint: import("mongoose").Document<unknown, {}, IComplaint, {}, {}> & IComplaint & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    };
}>>;
export declare const getComplaint: (id: mongodbId) => Promise<ApiSuccess<{
    complaint: import("mongoose").Document<unknown, {}, IComplaint, {}, {}> & IComplaint & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    };
}>>;
export declare const listComplaints: () => Promise<ApiSuccess<{
    complaints: (import("mongoose").Document<unknown, {}, IComplaint, {}, {}> & IComplaint & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[];
}>>;
export declare const updateComplaint: (id: mongodbId, data: Partial<IComplaint>) => Promise<ApiSuccess<{
    complaint: import("mongoose").Document<unknown, {}, IComplaint, {}, {}> & IComplaint & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    };
}>>;
export declare const deleteComplaint: (id: mongodbId) => Promise<ApiSuccess<null>>;
export declare const updateStage: (id: mongodbId, stage: complaintStages) => Promise<ApiSuccess<{
    complaint: import("mongoose").Document<unknown, {}, IComplaint, {}, {}> & IComplaint & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    };
}>>;
export declare const addQuote: (id: mongodbId, quoteId: mongodbId) => Promise<ApiSuccess<{
    complaint: import("mongoose").Document<unknown, {}, IComplaint, {}, {}> & IComplaint & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    };
}>>;
//# sourceMappingURL=complaint.service.d.ts.map