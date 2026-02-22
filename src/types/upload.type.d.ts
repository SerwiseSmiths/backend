export interface IUploadedFile {
    publicUrl: string;
    publicId: string;
    type: string;
    size?: number;
    originalName?: string;
    format?: string;
    width?: number;
    height?: number;
}
export interface ISingleUploadResponse {
    success: boolean;
    file: IUploadedFile;
}
export interface IMultiUploadResponse {
    success: boolean;
    files: IUploadedFile[];
}
export type AllowedFileTypes = "image" | "video" | "document" | "raw";
export interface IUploadOptions {
    folder?: string;
    resourceType?: AllowedFileTypes;
    maxSize?: number;
}
//# sourceMappingURL=upload.type.d.ts.map