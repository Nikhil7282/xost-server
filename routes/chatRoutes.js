import { Router } from "express";
import { verify } from "../middleware/authMiddleware.js";
import {
  accessChat,
  addToGroup,
  createGroupChat,
  fetchChats,
  removeFromGroup,
  renameGroup,
} from "../controllers/chatController.js";

const chatRouter = Router();

chatRouter.post("/accessChat", verify, accessChat);
chatRouter.get("/fetchChats", verify, fetchChats);
chatRouter.post("/createGroup", verify, createGroupChat);
chatRouter.put("/renameGroup", verify, renameGroup);
chatRouter.put("/addToGroup", verify, addToGroup);
chatRouter.put("/removeFromGroup", verify, removeFromGroup);

export default chatRouter;
