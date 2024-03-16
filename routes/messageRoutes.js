import { Router } from "express";
import {
  addMessage,
  allMessages,
  sendMessage,
} from "../controllers/messageController.js";
import { verify } from "../middleware/authMiddleware.js";
const messageRouter = Router();

messageRouter.post("/", verify, sendMessage);
messageRouter.get("/:chatId", verify, allMessages);

export default messageRouter;
