"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.deleteEventThumbnail = exports.deleteProfilePicture = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
//Copyright of script: https://medium.com/@bviveksingh96/uploading-images-files-with-multer-in-node-js-f942e9319600
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(__dirname, "/uploads/"));
    },
    filename: function (req, file, cb) {
        const uniqueFilename = `${(0, uuid_1.v4)()}-${file.originalname}`;
        cb(null, uniqueFilename);
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png") {
        cb(null, true);
    }
    else {
        cb(new Error("Image uploaded is not of type jpg/jpeg or png"), false);
    }
};
function deleteProfilePicture(filename) {
    try {
        const filePath = path_1.default.join(__dirname, filename);
        fs_1.default.unlinkSync(filePath);
        console.log(`Deleted profile picture: ${filename}`);
    }
    catch (error) {
        console.error(`Error deleting profile picture: ${filename}`, error);
        throw error;
    }
}
exports.deleteProfilePicture = deleteProfilePicture;
function deleteEventThumbnail(filename) {
    /* try {
      const filePath = path.join(__dirname, filename);
      fs.unlinkSync(filePath);
      console.log(`Deleted event thumbnail: ${filename}`);
    } catch (error) {
      console.error(`Error deleting event thumbnail: ${filename}`, error);
      throw error;
    } */
}
exports.deleteEventThumbnail = deleteEventThumbnail;
// file size : 10 MB limit
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 },
});
//# sourceMappingURL=FileUpload.js.map