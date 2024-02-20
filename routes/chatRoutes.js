import { Router } from "express";
import { verify } from "../middleware/authMiddleware.js";
import { accessChat, fetchChats } from "../controllers/chatController.js";

const chatRouter = Router();

chatRouter.post("/accessChat", verify, accessChat);
chatRouter.get("/fetchChats", verify, fetchChats);
// chatRouter.post("/createGroup");
// chatRouter.put("/renameGroup");
// chatRouter.put("/removeGroup");
// chatRouter.put("/addToGroup");

export default chatRouter;
