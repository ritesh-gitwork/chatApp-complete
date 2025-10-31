import express from "express";
import dotenv from "dotenv";
import cookieparser from "cookie-parser";
import cors from "cors";

import authRoutes from "../src/routes/auth.routes.js";
import messageRoutes from "../src/routes/message.routes.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;

app.use(express.json());

app.use(cookieparser());

//routes
app.use("api/auth", authRoutes);
app.use("api/message", messageRoutes);

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

connectDB();

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
