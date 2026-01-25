"use server";

import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function deleteImageFromCloudinary(url: string) {
  const parts = url.split("/upload/")[1];
  const publicId = parts.includes("/")
    ? parts.split("/").slice(1).join("/").split(".")[0]
    : parts.split(".")[0];
  const response = await cloudinary.v2.uploader.destroy(publicId);
  return response;
}
