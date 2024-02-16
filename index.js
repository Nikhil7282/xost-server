import { config } from "dotenv";
import cors from "cors";
config();
import express from "express";
const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen({ port: process.env.PORT }, () => {
  console.log("Running on port " + process.env.PORT);
});
