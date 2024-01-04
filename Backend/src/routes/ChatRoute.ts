import express from "express";
import { ChatService } from "../services/ChatService";
import { requiresAuthentication } from "./authentication";
import { body, param } from "express-validator";
import server from "../../server";

const ChatRouter = express.Router();
const chatService = new ChatService();

ChatRouter.get(
  "/:id",
  requiresAuthentication,
  param("id").isMongoId(),
  async (req, res, next) => {
    try {
      const chatID = req.params.id;
      const chat = await chatService.getChat(chatID);
      res.status(200).json({ chat });
      //testing res.sendFile(__dirname + "/index.html");
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

ChatRouter.post(
  "/:id",
  requiresAuthentication,
  param("id").isMongoId(),
  body("message").isString().notEmpty(),
  async (req, res, next) => {
    try {
      const chatID = req.params.id;
      const result = await chatService.sendMessage(
        chatID,
        req.userId,
        req.body.message
      );
      res.status(200).json({ result });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default ChatRouter;
