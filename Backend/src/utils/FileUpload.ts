import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
//Copyright of script: https://medium.com/@bviveksingh96/uploading-images-files-with-multer-in-node-js-f942e9319600
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "/uploads/"));
  },

  filename: function (req: any, file: any, cb: any) {
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueFilename);
  },
});
const fileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Image uploaded is not of type jpg/jpeg or png"), false);
  }
};
export function deleteProfilePicture(filename: string): void {
  try {
    const filePath = path.join(__dirname, filename);
    fs.unlinkSync(filePath);
  } catch (error) {
    throw error;
  }
}

export function deleteEventThumbnail(filename: string): void {
  /* try {
    const filePath = path.join(__dirname, filename);
    fs.unlinkSync(filePath);
    console.log(`Deleted event thumbnail: ${filename}`);
  } catch (error) {
    console.error(`Error deleting event thumbnail: ${filename}`, error);
    throw error;
  } */
}

// file size : 10 MB limit
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});
