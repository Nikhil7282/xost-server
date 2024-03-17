import { config } from "dotenv";
config();
import cors from "cors";
import express from "express";
import connectDb from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import colors from "colors";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { socketInstance } from "./socket.js";

const { yellow } = colors;
const app = express();
app.use(express.json());
connectDb();
app.use(
  cors({
    origin: ["http://localhost:5173", "https://x-ost.vercel.app"],
    credentials: true,
  })
);

app.use("/api/user", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);
app.use(notFound);
app.use(errorHandler);

const expressServer = app.listen({ port: process.env.PORT }, () => {
  console.log(`Running on port ${process.env.PORT}`.yellow.bold);
});

socketInstance(expressServer);
