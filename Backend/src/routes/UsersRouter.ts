import express from "express";
import { UserService } from "../services/UserService";
import { requiresAuthentication } from "./authentication";
import { usersResource } from "../Resources";

const UsersRouter = express.Router();
const userService = new UserService();

UsersRouter.get("/users", requiresAuthentication, async (req, res, next) => {
  if (req.role !== "a") {
    res.status(403);
    next(new Error("Invalid authorization"));
  } else {
    try {
      const users: usersResource = await userService.getUsers();
      res.status(200).send(users);
    } catch (err) {
      res.status(404);
      next(err);
    }
  }
});

export default UsersRouter;
