import { Router } from "express";
import {
  getAllUser,
  loginUser,
  signUpUser,
} from "../controllers/userController.js";

const userRouter = Router();

userRouter.get("/", getAllUser);
userRouter.post("/signup", signUpUser);
userRouter.post("/login", loginUser);

export default userRouter;
