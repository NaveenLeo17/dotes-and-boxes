import { randomUUID } from "crypto";
import {
  addGame,
  getGame,
  hasGame,
  deleteGame,
} from "../store/activeGames.store.js";
import { Game } from "../models/game.model.js";
import { DotsAndBoxesEngine } from "../engine/dotsAndBoxes.engine.js";

export const createGame = ({ bluePlayer, redPlayer, gridSize = 10 }) => {
  const gameId = randomUUID();

  const game = {
    gameId,
    players: {
      blue: {
        userId: bluePlayer.userId,
        socketId: bluePlayer.socketId,
      },
      red: {
        userId: redPlayer.userId,
        socketId: redPlayer.socketId,
      },
    },
    gridSize,
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

export const endTurn = ({ gameId, playerId }) => {
  const game = getGame(gameId);

  if (!game) {
    throw new Error("Game not found");
  }

  const updatedGame = DotsAndBoxesEngine.endTurn(game, playerId);

  return updatedGame;
};

export const findGameById = (gameId) => {
  return getGame(gameId);
};

export const makeMove = ({ gameId, playerId, row, col, direction }) => {
  const game = getGame(gameId);

  if (!game) {
    throw new Error("Game not found");
  }

  const updatedGame = DotsAndBoxesEngine.applyMove(game, {
    playerId,
    row,
    col,
    direction,
  });

  return updatedGame;
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

  await Game.create({
    players: {
      blue: game.players.blue.userId,
      red: game.players.red.userId,
    },

    gridSize: game.gridSize,

    scores: {
      blue: game.scores.blue,
      red: game.scores.red,
    },

    winner: game.winner,

    createdAt: game.createdAt,
  });

  // await Game.create({
  //   bluePlayer: game.players.blue.userId,
  //   redPlayer: game.players.red.userId,
  //   gridSize: game.gridSize,
  //   blueScore: game.scores.blue,
  //   redScore: game.scores.red,
  //   winner: game.winner,
  //   createdAt: game.createdAt,
  // });

  deleteGame(gameId);
};
