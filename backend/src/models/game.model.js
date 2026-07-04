import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  players: {
    blue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    red: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },

  gridSize: {
    type: Number,
    required: true,
  },

  scores: {
    blue: {
      type: Number,
      default: 0,
    },
    red: {
      type: Number,
      default: 0,
    },
  },

  winner: {
    type: String,
    enum: ["blue", "red", "draw"],
    required: true,
  },

  createdAt: {
    type: String,
    required: true,
  },
});

export const Game = mongoose.model("Game", gameSchema);
