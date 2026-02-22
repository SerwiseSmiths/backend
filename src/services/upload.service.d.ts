import { Request } from "express";
import ApiSuccess from "../utils/api/ApiSuccess.api.util";
import { IUploadedFile } from "../types/upload.type";
export declare const uploadSingleFile: (req: Request) => Promise<ApiSuccess<{
    file: IUploadedFile;
}>>;
export declare const uploadMultipleFiles: (req: Request) => Promise<ApiSuccess<{
    files: IUploadedFile[];
    errors: string[] | undefined;
}>>;
export declare const uploadProfileFile: (req: Request) => Promise<ApiSuccess<{
    url: string;
    publicId: string;
}>>;
//# sourceMappingURL=upload.service.d.ts.map