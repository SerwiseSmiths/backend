// Media type definitions for complaint media attachments

export interface IMedia {
    publicUrl: string;
    type: string; // MIME type like "image/jpeg", "video/mp4"
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
