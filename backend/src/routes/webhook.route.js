import express from "express";
import { clerkWebhook } from "../controllers/clerkWebhook.controller.js";

const router = express.Router();

// Webhook Route
router.post("/clerk", clerkWebhook);

export default router;
