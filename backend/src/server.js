import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "../lib/db.js";
import authRoutes from "../routes/auth.route.js";
import chatRoutes from "../routes/chat.route.js";
import userRoutes from "../routes/user.route.js";
import path from "path";
import compression from "compression";
dotenv.config();

connectDB();
const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(compression());

app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Must match your frontend
    // origin: "https://video-call-chat-front-end-mern.vercel.app", // ✅ Must match your frontend
    credentials: true, // ✅ Allow cookies/auth headers
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.get("/", (req, res) => {
  res.send("Welcome to the backend server!");
});

// app.get("/keep-alive", (req, res) => {
//   res.send("Still alive ✅");
// });

// setInterval(() => {
//   fetch(
//     "https://video-call-chat-backend-website-streamify.onrender.com/keep-alive"
//   )
//     .then(() => console.log("Pinged self to stay awake ✅"))
//     .catch((err) => console.error("Ping failed ❌", err));
// }, 5 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
