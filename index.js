import { config } from "dotenv";
config();
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import express from "express";
import connectDb from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import colors from "colors";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

const { yellow } = colors;
const app = express();
app.use(express.json());
connectDb();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/user", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);
app.use(notFound);
app.use(errorHandler);

const expressServer = app.listen({ port: process.env.PORT }, () => {
  console.log(`Running on port ${process.env.PORT}`.yellow.bold);
});

const io = new Server(expressServer, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});
io.on("connection", (socket) => {
  console.log(`Connected to socket`);
  socket.on("setup", (userData) => {
    // console.log(userData);
    socket.join(userData.id);
    socket.emit("connected");
  });

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`Joined room ${roomId}}`.blue.bold);
  });
});
