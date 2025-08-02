import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();
import { getStreamToken } from "../controller/chat.controller.js";

router.get("/token", protectRoute, getStreamToken);

export default router;
