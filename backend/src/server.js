import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

import { Server } from "socket.io";
import { createServer } from "http";

import webhookRoutes from "./routes/webhook.route.js";

import userRoutes from "./routes/user.route.js";
import gameRoutes from "./routes/game.route.js";

import registerSocketHandlers from "./sockets/game.socket.js";
import { authenticateSocket } from "./middleware/socketAuth.middleware.js";

const app = express();

const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use(authenticateSocket);

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  console.log("Authenticated user:", socket.data.user.clerkId);

  registerSocketHandlers(io, socket);
});

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

// Mount the webhook routes with /api/webhooks prefix
app.use(
  "/api/webhooks",
  express.raw({ type: "application/json" }),
  webhookRoutes,
);

app.use(express.json());
app.use(
  clerkMiddleware({
    ignoredRoutes: ["/api/webhooks/(.*)"],
  }),
);

app.use("/api/user", userRoutes);
app.use("/api/game", gameRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Success" });
});

server.listen(ENV.PORT, async () => {
  await connectDB();
  console.log(`Server is up and running at port ${ENV.PORT}`);
});
