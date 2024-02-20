import { Router } from "express";
import {
  getUser,
  loginUser,
  signUpUser,
} from "../controllers/userController.js";
import { verify } from "../middleware/authMiddleware.js";

const userRouter = Router();

userRouter.get("/", verify, getUser);
userRouter.post("/signup", signUpUser);
userRouter.post("/login", loginUser);

export default userRouter;
