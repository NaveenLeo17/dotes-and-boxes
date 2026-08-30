import { randomUUID } from "crypto";
import { addGame, getGame, deleteGame } from "../store/activeGames.store.js";
import { Game } from "../models/game.model.js";
import { User } from "../models/user.model.js";
import { DotsAndBoxesEngine } from "../engine/dotsAndBoxes.engine.js";

const DEFAULT_GRID_ROWS = 14;
const DEFAULT_GRID_COLS = 8;

export const createGame = ({
  playerId,
  socketId,
  gridRows = DEFAULT_GRID_ROWS,
  gridCols = DEFAULT_GRID_COLS,
}) => {
  const gameId = randomUUID();

  const game = {
    gameId,
    players: {
      blue: {
        userId: playerId,
        socketId,
      },
      red: {
        userId: null,
        socketId,
      },
    },
    gridRows,
    gridCols,
    turn: {
      currentPlayer: "blue",
      canEndTurn: false,
    },
    lines: new Set(),
    boxes: [],
    scores: {
      blue: 0,
      red: 0,
    },
    winner: null,
    status: "playing",
    createdAt: Date.now(),
  };

  addGame(gameId, game);

  return game;
};

export const endTurn = ({ gameId, playerId, playerColor }) => {
  const game = getGame(gameId);

  if (!game) {
    throw new Error("Game not found");
  }

  return DotsAndBoxesEngine.endTurn(game, playerId, playerColor);
};

export const findGameById = (gameId) => {
  return getGame(gameId);
};

export const makeMove = ({
  gameId,
  playerId,
  playerColor,
  row,
  col,
  direction,
}) => {
  const game = getGame(gameId);

  if (!game) {
    throw new Error("Game not found");
  }

  return DotsAndBoxesEngine.applyMove(game, {
    playerId,
    playerColor,
    row,
    col,
    direction,
  });
};

export const removeGame = (gameId) => {
  deleteGame(gameId);
};

export const saveFinishedGame = async (gameId) => {
  const game = getGame(gameId);

  if (!game) {
    throw new Error("Game not found");
  }

  if (game.status !== "finished") {
    throw new Error("Game is not finished");
  }

  /*
   * The game engine stores Clerk IDs.
   *
   * MongoDB Game model, however, stores references
   * to the User documents using MongoDB ObjectIds.
   *
   * Therefore, convert Clerk IDs -> MongoDB User._id
   * only when saving the finished game.
   */

  const blueUser = await User.findOne({ clerkId: game.players.blue.userId });

  if (!blueUser) {
    throw new Error("Blue player not found");
  }

  const savedGame = await Game.create({
    players: {
      blue: blueUser._id,
      red: null,
    },
    gridRows: game.gridRows,
    gridCols: game.gridCols,
    scores: {
      blue: game.scores.blue,
      red: game.scores.red,
    },
    winner: game.winner,
    createdAt: game.createdAt,
  });

  deleteGame(gameId);

  return savedGame;
};
