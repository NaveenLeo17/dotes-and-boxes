export class DotsAndBoxesEngine {
  //  Main entry point
  static applyMove(game, move) {
    const { playerId, row, col, direction } = move;
    const playerColor = this.getPlayerColor(game, playerId);

    if (!playerColor) {
      throw new Error("Player is not part of the game");
    }

    if (game.status !== "playing") {
      throw new Error("Game is not active");
    }

    if (game.turn.currentPlayer !== playerColor) {
      throw new Error("Not your turn");
    }

    this.validateMove(game, row, col, direction);

    const lineKey = this.getLineKey(row, col, direction);

    if (game.lines.has(lineKey)) {
      throw new Error("Line already exists");
    }

    game.lines.add(lineKey);

    const completedBoxes = this.checkCompletedBoxes(game, row, col, direction);

    if (completedBoxes.length > 0) {
      completedBoxes.forEach((box) => {
        game.boxes.push({
          ...box,
          owner: playerColor,
        });
      });

      game.scores[playerColor] += completedBoxes.length;
      game.turn.canEndTurn = true;
    } else {
      this.switchTurn(game);
    }

    this.checkWinner(game);

    return game;
  }

  static endTurn(game, playerId) {
    const playerColor = this.getPlayerColor(game, playerId);

    if (!playerColor) {
      throw new Error("Player is not part of the game");
    }

    if (game.status !== "playing") {
      throw new Error("Game is not active");
    }

    if (game.turn.currentPlayer !== playerColor) {
      throw new Error("Not your turn");
    }

    if (!game.turn.canEndTurn) {
      throw new Error("You cannot end your turn right now");
    }

    this.switchTurn(game);

    return game;
  }

  //   Returns blue/red
  static getPlayerColor(game, playerId) {
    if (game.players.blue.userId === playerId) {
      return "blue";
    }
    if (game.players.red.userId === playerId) {
      return "red";
    }

    return null;
  }

  static switchTurn(game) {
    game.turn.currentPlayer =
      game.turn.currentPlayer === "blue" ? "red" : "blue";

    game.turn.canEndTurn = false;
  }

  // Creates unique line id
  static getLineKey(row, col, direction) {
    return `${row}-${col}-${direction}`;
  }

  //   Basic move validation
  static validateMove(game, row, col, direction) {
    const maxIndex = game.gridSize - 1;

    if (!["h", "v"].includes(direction)) {
      throw new Error("Invalid Direction");
    }

    if (!Number.isInteger(row) || !Number.isInteger(col)) {
      throw new Error("Invalid Coordinates");
    }

    if (row < 0 || col < 0) {
      throw new Error("Coordinates cannot be negative");
    }

    if (direction === "h") {
      if (row > maxIndex || col >= maxIndex) {
        throw new Error("Invalid horizontal line");
      }
    }

    if (direction === "v") {
      if (row >= maxIndex || col > maxIndex) {
        throw new Error("Invalid vertical line");
      }
    }
  }

  //   Check boxes affected by latest move
  static checkCompletedBoxes(game, row, col, direction) {
    const completedBoxes = [];

    if (direction === "h") {
      // box above
      if (row > 0 && this.isBoxComplete(game, row - 1, col)) {
        completedBoxes.push({
          row: row - 1,
          col,
        });
      }

      // box below
      if (row < game.gridSize - 1 && this.isBoxComplete(game, row, col)) {
        completedBoxes.push({
          row,
          col,
        });
      }
    }

    if (direction === "v") {
      // box left
      if (col > 0 && this.isBoxComplete(game, row, col - 1)) {
        completedBoxes.push({
          row,
          col: col - 1,
        });
      }

      // box right
      if (col < game.gridSize - 1 && this.isBoxComplete(game, row, col)) {
        completedBoxes.push({
          row,
          col,
        });
      }
    }

    return completedBoxes;
  }

  //   Determines whether a box is complete
  static isBoxComplete(game, row, col) {
    const top = this.getLineKey(row, col, "h");
    const bottom = this.getLineKey(row + 1, col, "h");
    const left = this.getLineKey(row, col, "v");
    const right = this.getLineKey(row, col + 1, "v");

    return (
      game.lines.has(top) &&
      game.lines.has(bottom) &&
      game.lines.has(left) &&
      game.lines.has(right)
    );
  }

  //   Check whether game is over
  static checkWinner(game) {
    const totalBoxes = (game.gridSize - 1) * (game.gridSize - 1);
    const claimedBoxes = game.scores.blue + game.scores.red;

    if (claimedBoxes !== totalBoxes) {
      return;
    }

    game.status = "finished";

    if (game.scores.blue > game.scores.red) {
      game.winner = "blue";
    } else if (game.scores.red > game.scores.blue) {
      game.winner = "red";
    } else {
      game.winner = "draw";
    }
  }
}
