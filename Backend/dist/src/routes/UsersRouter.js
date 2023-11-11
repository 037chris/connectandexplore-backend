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
const authentication_1 = require("./authentication");
const UsersRouter = express_1.default.Router();
const userService = new UserService_1.UserService();
UsersRouter.get("/users", authentication_1.requiresAuthentication, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.role !== "a") {
        res.status(403);
        next(new Error("Invalid authorization"));
    }
    else {
        try {
            const users = yield userService.getUsers();
            res.status(200).send(users);
        }
        catch (err) {
            res.status(404);
            next(err);
        }
    }
}));
exports.default = UsersRouter;
//# sourceMappingURL=UsersRouter.js.map