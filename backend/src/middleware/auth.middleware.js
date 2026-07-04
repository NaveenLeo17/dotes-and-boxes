import { getAuth } from "@clerk/express";
import { ENV } from "../config/env.js";
import { User } from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const { userId: clerkId } = await getAuth(req);
    // console.log(req.headers);
    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized - invalid token" });
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log("req:", req.auth);
    req.user = user;
    console.log("req.user:", req.user);
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
