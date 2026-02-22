import ApiSuccess from "../utils/api/ApiSuccess.api.util";
import { complaintStages, IComplaint, ICreateComplaintInput, IUpdateComplaintInput } from "../types/comlpaint.type";
export declare const createComplaint: (data: ICreateComplaintInput, userId: mongodbId) => Promise<ApiSuccess<{
    complaint: Omit<import("mongoose").Document<unknown, {}, IComplaint, {}, {}> & IComplaint & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, never>;
}>>;
export declare const getComplaint: (id: mongodbId) => Promise<ApiSuccess<{
    complaint: import("mongoose").Document<unknown, {}, IComplaint, {}, {}> & IComplaint & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
}>>;
export declare const listComplaints: () => Promise<ApiSuccess<{
    complaints: (import("mongoose").Document<unknown, {}, IComplaint, {}, {}> & IComplaint & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
}>>;
export declare const updateComplaint: (id: mongodbId, data: IUpdateComplaintInput) => Promise<ApiSuccess<{
    complaint: import("mongoose").Document<unknown, {}, IComplaint, {}, {}> & IComplaint & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
}>>;
export declare const deleteComplaint: (id: mongodbId) => Promise<ApiSuccess<null>>;
export declare const updateStage: (id: mongodbId, stage: complaintStages, rejectionReason?: string) => Promise<ApiSuccess<{
    complaint: import("mongoose").Document<unknown, {}, IComplaint, {}, {}> & IComplaint & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
}>>;
export declare const addQuote: (id: mongodbId, quoteId: mongodbId) => Promise<ApiSuccess<{
    complaint: import("mongoose").Document<unknown, {}, IComplaint, {}, {}> & IComplaint & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
}>>;
export declare const addDevice: (id: mongodbId, deviceId: mongodbId) => Promise<ApiSuccess<{
    complaint: import("mongoose").Document<unknown, {}, IComplaint, {}, {}> & IComplaint & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
}>>;
export declare const addPayment: (id: mongodbId, paymentId: mongodbId) => Promise<ApiSuccess<{
    complaint: import("mongoose").Document<unknown, {}, IComplaint, {}, {}> & IComplaint & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
}>>;
export declare const listComplaintsByUser: (userId: mongodbId) => Promise<ApiSuccess<{
    complaints: (import("mongoose").Document<unknown, {}, IComplaint, {}, {}> & IComplaint & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
}>>;
export declare const listComplaintsByProvider: (providerId: mongodbId) => Promise<ApiSuccess<{
    complaints: (import("mongoose").Document<unknown, {}, IComplaint, {}, {}> & IComplaint & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
}>>;
export declare const acceptComplaintAssignment: (complaintId: mongodbId, providerId: mongodbId) => Promise<ApiSuccess<{
    complaint: (import("mongoose").Document<unknown, {}, IComplaint, {}, {}> & IComplaint & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null;
}>>;
export declare const rejectComplaintAssignment: (complaintId: mongodbId, providerId: mongodbId) => Promise<ApiSuccess<{
    message: string;
}>>;
export declare const reopenComplaint: (parentId: mongodbId, data: ICreateComplaintInput, userId: mongodbId) => Promise<ApiSuccess<{
    complaint: Omit<import("mongoose").Document<unknown, {}, IComplaint, {}, {}> & IComplaint & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, never>;
}>>;
export declare const generateEntryQr: (complaintId: mongodbId, userId: mongodbId) => Promise<ApiSuccess<{
    token: any;
    expiresAt: Date;
}>>;
export declare const validateEntryQr: (complaintId: mongodbId, token: string, providerId: mongodbId) => Promise<ApiSuccess<{
    complaint: import("mongoose").Document<unknown, {}, IComplaint, {}, {}> & IComplaint & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
}>>;
//# sourceMappingURL=complaint.service.d.ts.map