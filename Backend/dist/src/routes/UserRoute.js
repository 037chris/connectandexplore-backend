"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserService_1 = require("../services/UserService");
const FileUpload_1 = require("../utils/FileUpload");
const UserRouter = express_1.default.Router();
const userService = new UserService_1.UserService();
UserRouter.post('/register', FileUpload_1.upload.single('profilePicture'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        if (req.file) {
            console.log(req.file.filename);
            req.body.profilePicture = `/uploads/${req.file.filename}`;
            console.log(req.body);
        }
        const newUser = yield userService.registerUser(req.body);
        return res.status(201).json(newUser);
    }
    catch (error) {
        if (error.message === 'User already exists') {
            return res.status(409).json({ "Error": 'User already exists' });
        }
        else {
            return res.status(500).json({ "Error": 'Registration failed' });
        }
    }
}));
exports.default = UserRouter;
//# sourceMappingURL=UserRoute.js.map