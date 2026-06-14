import { Game } from "../models/game.model.js";

export const saveGame = async (req, res) => {
  try {
    const { userId: clerkId } = req.auth;
    const bluePlayerName = req.user?._id;
    const { redPlayerName, winner, blueScore, redScore, gridSize } = req.body;

    if (!winner || blueScore == null || redScore == null || !gridSize) {
      return res.status(400).json({
        success: false,
        message: "Missing required game information",
      });
    }

    if (
      blueScore < 0 ||
      redScore < 0 ||
      blueScore + redScore > (gridSize - 1) * (gridSize - 1)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid scores",
      });
    }

    const savedGame = await Game.create({
      clerkId,
      bluePlayerName: bluePlayerName || null,
      redPlayerName: redPlayerName || "Red",
      winner,
      blueScore,
      redScore,
      gridSize,
    });

    return res.status(201).json({
      success: true,
      message: "Game saved successfully",
      game: savedGame,
    });
  } catch (error) {
    console.error("Error in saveGame Controller", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getGamesHistory = async (req, res) => {
  try {
    const { userId: clerkId } = req.auth;
    let { page = 1, limit = 10 } = req.query;

    page = isNaN(page) ? 1 : Number(page);
    limit = isNaN(limit) ? 10 : Number(limit);

    if (page <= 0) {
      page = 1;
    }
    if (limit <= 0) {
      limit = 10;
    }

    const games = await Game.find({ clerkId })
      .populate("bluePlayerName", "name avatarUrl")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select(
        "bluePlayerName redPlayerName winner blueScore redScore gridSize createdAt",
      );

    return res.status(200).json({
      success: true,
      message: "Game history fetched successfully",
      data: games,
    });
  } catch (error) {
    console.error("Error in getGamesHistory controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
