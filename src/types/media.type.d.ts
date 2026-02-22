export interface IMedia {
    publicUrl: string;
    type: string;
}
export type MediaType = "image" | "video" | "document" | "other";
export interface IUploadResponse {
    publicUrl: string;
    publicId: string;
    type: string;
    size?: number;
    originalName?: string;
}
export interface IMultiUploadResponse {
    files: IUploadResponse[];
}
//# sourceMappingURL=media.type.d.ts.map