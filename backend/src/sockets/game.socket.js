import { createGame, endTurn, makeMove } from "../services/game.service.js";

const serializeGame = (game) => {
  return {
    ...game,
    lines: Array.from(game.lines),
  };
};

export default function registerSocketHandlers(io, socket) {
  console.log(`Socket ${socket.id} connected`);

  socket.on("createGame", () => {
    const playerId = socket.data.user.clerkId;

    try {
      const game = createGame({ playerId, socketId: socket.id });

      socket.emit("gameState", serializeGame(game));
    } catch (error) {
      console.error("Error creating game:", error);
      socket.emit("gameError", { message: error.message });
    }
  });

  socket.on("makeMove", (payload = {}) => {
    console.log("MAKE MOVE PAYLOAD:", payload);

    const playerId = socket.data.user.clerkId;
    const { gameId, playerColor, row, col, direction } = payload;

    try {
      const updatedGame = makeMove({
        gameId,
        playerId,
        playerColor,
        row,
        col,
        direction,
      });
      socket.emit("gameState", serializeGame(updatedGame));
    } catch (error) {
      console.error("Error making move:", error);
      socket.emit("gameError", { message: error.message });
    }
  });

  socket.on("endTurn", (payload = {}) => {
    const playerId = socket.data.user.clerkId;
    const { gameId, playerColor } = payload;

    try {
      const updatedGame = endTurn({ gameId, playerId, playerColor });
      socket.emit("gameState", serializeGame(updatedGame));
    } catch (error) {
      console.error("Error ending turn:", error);
      socket.emit("gameError", { message: error.message });
    }
  });

  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
}
