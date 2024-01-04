import { ChatResource, MessageResource } from "../Resources";
import { Chat } from "../model/EventModel";
import { User } from "../model/UserModel";

export class ChatService {
  async getChat(chatID: string): Promise<ChatResource> {
    if (!chatID) throw new Error(`Chat ID: ${chatID} is invalid.`);
    const chat = await Chat.findById(chatID).exec();
    if (!chat) throw new Error("Chat not found");
    return {
      messages: chat.messages.map((message) => ({
        user: message.user.toString(),
        message: message.message.toString(),
      })),
    };
  }

  async sendMessage(
    chatID: string,
    userID: string,
    message: string
  ): Promise<ChatResource> {
    if (!chatID) throw new Error(`Chat ID: ${chatID} is invalid.`);
    const chat = await Chat.findById(chatID).exec();
    if (!chat) throw new Error("Chat not found");
    const user = await User.findById(userID).exec();
    if(!user) throw new Error("User not found");

    chat.messages.push({ user: user._id, message: message });
    const newChat = await chat.save();

    return {
      messages: newChat.messages.map((message) => ({
        user: message.user.toString(),
        message: message.message.toString(),
      })),
    };
  }
}
