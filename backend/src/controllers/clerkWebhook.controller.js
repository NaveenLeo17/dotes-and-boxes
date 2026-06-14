import { ENV } from "../config/env.js";
import { Webhook } from "svix";
import { User } from "../models/user.model.js";

// Function to process webhook
const processClerkWebhook = async (evt) => {
  const eventType = evt.type;
  const eventData = evt.data;

  console.log(`Processing Clerk event: ${eventType}`);

  try {
    if (eventType === "user.created" || eventType === "user.updated") {
      const userData = {
        clerkId: eventData.id,
        email: eventData.email_addresses?.[0]?.email_address || null,
        name: eventData.first_name || null,
      };

      await User.findOneAndUpdate({ clerkId: userData.clerkId }, userData, {
        upsert: true,
        new: true,
      });

      console.log(
        `✅ User ${eventData.id} ${eventType === "user.created" ? "created" : "updated"} successfully`,
      );
    } else if (eventType === "user.deleted") {
      await User.deleteOne({ clerkId: eventData.id });
      console.log(`✅ User ${eventData.id} deleted successfully`);
    }
  } catch (dbError) {
    console.error("❌ Database error in webhook processing:", dbError.message);
  }
};

export const clerkWebhook = async (req, res) => {
  const WEBHOOK_SECRET = ENV.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing CLERK_WEBHOOK_SECRET in .env");
    return res.status(500).json({ error: "Server misconfigured" });
  }

  const payload = req.body;
  const headers = req.headers;

  let evt;
  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    evt = wh.verify(payload, headers);
    console.log(`Webhook verified successfully: ${evt.type}`);
  } catch (err) {
    console.error("Webhook verification failed:", err.message);
    return res.status(400).json({ error: "Invalid signature" });
  }

  // ✅ IMPORTANT: Respond to Clerk immediately to prevent 408 Timeout
  res.status(200).json({ success: true });

  // Process MongoDB operations in background
  processClerkWebhook(evt).catch((err) => {
    console.error("Background processing failed:", err.message);
  });
};
