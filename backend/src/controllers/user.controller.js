import uploadOnCloudinary from "../config/cloudinary.js";
import { User } from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const { userId: clerkId } = req.auth;

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
    if (name) {
      const user = User.findByIdAndUpdate(
        req.user._id,
        {
          $set: { name },
        },
        { returnDocument: "after" },
      );

      res.status(200).json({ message: `User is updated successfully ${user}` });
    } else if (avatarLocalPath) {
      const avatar = await uploadOnCloudinary(avatarLocalPath);

      if (!avatar) {
        res.status(400).json({ message: "Error while uploading an avatar" });
      }

      const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
          $set: {
            avatarUrl: avatar.url,
          },
        },
        { returnDocument: "after" },
      );

      res
        .status(200)
        .json({ message: `Avatar image is uploaded successfully ${user}` });
    }
  } catch (error) {
    console.error("Error in updateUserProfile controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
