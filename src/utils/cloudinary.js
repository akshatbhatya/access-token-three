import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.cloudinary_cloud_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret,
});

async function UploadFiles(LocalFile) {
  try {
    await cloudinary.uploader.upload(LocalFile, { resource_type: "auto" });
    fs.unlinkSync(LocalFile);
  } catch (error) {
    fs.unlinkSync(LocalFile);
    return error;
  }
}

export default UploadFiles;
