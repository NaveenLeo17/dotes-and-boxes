import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      index: true, // Very important for fast queries
    },
    bluePlayerName: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    redPlayerName: {
      type: String,
      default: "Red",
    },
    winner: {
      type: String,
      enum: ["blue", "red", "draw", null],
      default: null,
    },
    blueScore: {
      type: Number,
      default: 0,
    },
    redScore: {
      type: Number,
      default: 0,
    },
    gridSize: {
      type: Number,
      required: true,
      default: 5,
    },
  },
  { timestamps: true },
);

export const Game = mongoose.model("Game", gameSchema);
