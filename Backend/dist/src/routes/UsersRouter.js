"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserService_1 = require("../services/UserService");
const authentication_1 = require("./authentication");
const UsersRouter = express_1.default.Router();
const userService = new UserService_1.UserService();
UsersRouter.get("/users", authentication_1.requiresAuthentication, async (req, res, next) => {
    if (req.role !== "a") {
        res.status(403);
        next(new Error("Invalid authorization"));
    }
    else {
        try {
            const users = await userService.getUsers();
            res.status(200).send(users);
        }
        catch (err) {
            res.status(404);
            next(err);
        }
    }
});
exports.default = UsersRouter;
//# sourceMappingURL=UsersRouter.js.map