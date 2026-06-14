import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

import webhookRoutes from "./routes/webhook.route.js";

import userRoutes from "./routes/user.route.js";
import gameRoutes from "./routes/game.route.js";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

// Mount the webhook routes with /api/webhooks prefix
app.use("/api/webhooks", webhookRoutes);

app.use(express.json());
app.use(clerkMiddleware());

app.use("/api/user", userRoutes);
app.use("/api/game", gameRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Success" });
});

app.listen(ENV.PORT, async () => {
  await connectDB();
  console.log(`Server is up and running at port ${ENV.PORT}`);
});
