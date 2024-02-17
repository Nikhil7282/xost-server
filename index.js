import { config } from "dotenv";
config();
import cors from "cors";
import express from "express";
import connectDb from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import colors from "colors";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
const { yellow } = colors;
const app = express();
app.use(express.json());
connectDb();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/user", userRouter);
app.use(notFound);
app.use(errorHandler);

app.listen({ port: process.env.PORT }, () => {
  console.log(`Running on port ${process.env.PORT}`.yellow.bold);
});
