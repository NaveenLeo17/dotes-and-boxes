import uploadOnCloudinary from "../config/cloudinary.js";
import { User } from "../models/user.model.js";
import { clerkClient } from "@clerk/express";

export const getCurrentUser = async (req, res) => {
  try {
    const { clerkId } = req.user;

    if (!clerkId) {
      res
        .status(401)
        .json({ message: "clerkId is not found in getCurrentUser" });
    }

    const user = await User.findOne({ clerkId }).populate("userStats");

    if (!user) {
      res.status(401).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error in getCurrentUser controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  const { name } = req.body;
  const avatarLocalPath = req.file?.path;

  try {
    if (avatarLocalPath) {
      const avatar = await uploadOnCloudinary(avatarLocalPath);

      if (!avatar) {
        res
          .status(400)
          .json({ message: "Error while uploading on Cloudinary" });
      }

      await clerkClient.users.updateUserProfileImage(req.user.clerkId, {
        file: avatar,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }

  try {
    if (name) {
      await clerkClient.users.updateUser(req.user.clerkId, { username: name });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
