import { Router } from "express";
import { addMessage } from "../controllers/messageController.js";

const messageRouter = Router();

messageRouter.post("/addMessage", addMessage);

export default messageRouter;
