import { verifyToken } from "@clerk/backend";
import { ENV } from "../config/env.js";

export async function authenticateSocket(socket, next) {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      console.log("Socket authentication failed: token missing");
      return next(new Error("Authentication token missing"));
    }

    const payload = await verifyToken(token, {
      secretKey: ENV.CLERK_SECRET_KEY,
    });

    socket.data.user = {
      clerkId: payload.sub,
    };

    console.log(`Socket authenticated: ${socket.id} -> ${payload.sub}`);

    next();
  } catch (error) {
    console.error("Socket authentication failed:", error);

    next(new Error("Unauthorized"));
  }
}
