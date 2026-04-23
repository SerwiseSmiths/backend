import { Request, Response, NextFunction, RequestHandler } from "express";
import multer from "multer";
import * as fs from "fs";
import { uploadToCloudinary } from "../utils/upload.util";

// temporary storage
const upload = multer({ dest: "/tmp/uploads/" });


export const cloudinaryUploadMiddleware: RequestHandler[] = [
  upload.single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(!req.file);
      console.log(req.body);
      let result:any;

      if (!req.file){
        // result = {
        //   secure_url:"url",
        //   public_id:"id",
        //   }
        }
        // return res.status(400).json({ message: "No file uploaded" });}
      else{

      // Upload to Cloudinary
      result = await uploadToCloudinary(req.file.path, "myApp");

      // remove temp file after upload
      fs.unlinkSync(req.file.path);

      console.log(result);
      // attach cloudinary response to req (only when a file was uploaded and upload succeeded)
      if (result?.secure_url != null) {
        (req as any).cloudinary = {
          url: result.secure_url,
          publicId: result.public_id,
        };
      }

      }

      next();
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      return res.status(500).json({ message: "File upload failed" });
    }
  }
];
