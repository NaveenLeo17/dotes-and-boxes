export class DotsAndBoxesEngine {
  //  Main entry point
  static applyMove(game, move) {
    const { playerId, playerColor, row, col, direction } = move;

    if (!["blue", "red"].includes(playerColor)) {
      throw new Error("Invalid player");
    }

    if (game.status !== "playing") {
      throw new Error("Game is not active");
    }

    /* * Make sure the requested player is * actually allowed to play this color. */
    this.validatePlayer(game, playerId, playerColor);

    /* * Make sure it is this player's turn. */
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

  static endTurn(game, playerId, playerColor) {
    if (!["blue", "red"].includes(playerColor)) {
      throw new Error("Invalid player");
    }

    if (game.status !== "playing") {
      throw new Error("Game is not active");
    }

    this.validatePlayer(game, playerId, playerColor);

    if (game.turn.currentPlayer !== playerColor) {
      throw new Error("Not your turn");
    }

    if (!game.turn.canEndTurn) {
      throw new Error("You cannot end your turn right now");
    }

    this.switchTurn(game);
    return game;
  }

  // Validate Player
  static validatePlayer(game, playerId, playerColor) {
    if (playerColor === "blue") {
      if (game.players.blue.userId !== playerId) {
        throw new Error("You are not the blue player");
      }
      return;
    }

    if (playerColor === "red") {
      if (game.players.red.socketId !== game.players.blue.socketId) {
        throw new Error("You are not the red player");
      }
      return;
    }

    throw new Error("Invalid player");
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
    const maxRow = game.gridRows - 1;

    const maxCol = game.gridCols - 1;

    if (!["h", "v"].includes(direction)) {
      throw new Error("Invalid Direction");
    }

    if (!Number.isInteger(row) || !Number.isInteger(col)) {
      throw new Error("Invalid Coordinates");
    }

    if (row < 0 || col < 0) {
      throw new Error("Coordinates cannot be negative");
    }

    /*
     * Horizontal line
     *
     * Starts at:
     * row = 0 ... gridRows - 1
     *
     * col = 0 ... gridCols - 2
     */

    if (direction === "h") {
      if (row > maxRow || col >= maxCol) {
        throw new Error("Invalid horizontal line");
      }
    }

    /*
     * Vertical line
     *
     * Starts at:
     * row = 0 ... gridRows - 2
     *
     * col = 0 ... gridCols - 1
     */

    if (direction === "v") {
      if (row >= maxRow || col > maxCol) {
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
      if (row < game.gridRows - 1 && this.isBoxComplete(game, row, col)) {
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
      if (col < game.gridCols - 1 && this.isBoxComplete(game, row, col)) {
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
    const totalBoxes = (game.gridRows - 1) * (game.gridCols - 1);
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
