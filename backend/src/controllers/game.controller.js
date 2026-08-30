import { Game } from "../models/game.model.js";
import { User } from "../models/user.model.js";

export const saveGame = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { redPlayerId, winner, blueScore, redScore, gridSize } = req.body;

    if (!winner || blueScore == null || redScore == null || !gridSize) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required game information" });
    }
    if (
      blueScore < 0 ||
      redScore < 0 ||
      blueScore + redScore > (gridSize - 1) * (gridSize - 1)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid scores" });
    }
    const bluePlayer = await User.findOne({ clerkId });

    if (!bluePlayer) {
      return res
        .status(404)
        .json({ success: false, message: "Blue player not found" });
    }

    let redPlayer = null;

    if (redPlayerId) {
      redPlayer = await User.findOne({ clerkId: redPlayerId });
    }

    const savedGame = await Game.create({
      players: { blue: bluePlayer._id, red: redPlayer?._id || null },
      gridSize,
      scores: { blue: blueScore, red: redScore },
      winner,
    });

    return res.status(201).json({
      success: true,
      message: "Game saved successfully",
      game: savedGame,
    });
  } catch (error) {
    console.error("Error in saveGame controller:", error);

    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getGamesHistory = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const user = await User.findOne({ clerkId });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { page = 1, limit = 10 } = req.query;
    const currentPage = Math.max(Number(page) || 1, 1);
    const currentLimit = Math.max(Number(limit) || 10, 1);
    const games = await Game.find({
      $or: [{ "players.blue": user._id }, { "players.red": user._id }],
    })
      .populate("players.blue", "name avatarUrl")
      .populate("players.red", "name avatarUrl")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * currentLimit)
      .limit(currentLimit);

    return res.status(200).json({
      success: true,
      message: "Game history fetched successfully",
      data: games,
    });
  } catch (error) {
    console.error("Error in getGamesHistory controller:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
