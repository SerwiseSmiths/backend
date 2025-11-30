import cloudinary from "../config/cloudinary.config";
import { UploadApiResponse } from "cloudinary";

export const uploadToCloudinary = async (
  filePath: string,
  folder: string = "uploads"
): Promise<UploadApiResponse> => {
  return await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "auto",
  });
};
