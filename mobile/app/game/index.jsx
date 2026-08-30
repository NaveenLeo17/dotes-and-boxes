import React, { useEffect, useState } from "react";

import { View, Text, Pressable } from "react-native";

import { useRouter } from "expo-router";

import { useColorScheme } from "nativewind";

import SafeScreen from "../../components/SafeScreen.jsx";
import GameBoard from "../../components/GameBoard.jsx";
import { useSocket } from "../../components/SocketProvider.jsx";

const Game = () => {
  const router = useRouter();

  const { socket, isSocketConnected } = useSocket();

  const { colorScheme } = useColorScheme();

  const isDark = colorScheme === "dark";

  const [gameState, setGameState] = useState(null);
  const [gameError, setGameError] = useState(null);

  const [boardArea, setBoardArea] = useState({
    width: 0,
    height: 0,
  });

  /* ================================= */
  /* SOCKET LISTENERS */
  /* ================================= */

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleGameState = (game) => {
      console.log("GAME STATE:", game);

      setGameState(game);
      setGameError(null);
    };

    const handleGameError = (error) => {
      console.log("GAME ERROR:", error);

      setGameError(error?.message || "Something went wrong.");
    };

    socket.on("gameState", handleGameState);
    socket.on("gameError", handleGameError);

    return () => {
      socket.off("gameState", handleGameState);
      socket.off("gameError", handleGameError);
    };
  }, [socket]);

  /* ================================= */
  /* CREATE GAME */
  /* ================================= */

  const createGame = () => {
    if (!socket || !isSocketConnected) {
      setGameError("Socket is not connected.");
      return;
    }

    setGameError(null);

    socket.emit("createGame");
  };

  /* ================================= */
  /* MAKE MOVE */
  /* ================================= */

  const makeMove = ({ row, col, direction }) => {
    if (!socket || !isSocketConnected) {
      console.log("Socket is not connected");
      return;
    }

    if (!gameState) {
      console.log("No active game");
      return;
    }

    setGameError(null);

    const playerColor = gameState.turn.currentPlayer;

    console.log("MAKE MOVE:", {
      gameId: gameState.gameId,
      playerColor,
      row,
      col,
      direction,
    });

    socket.emit("makeMove", {
      gameId: gameState.gameId,
      playerColor,
      row,
      col,
      direction,
    });
  };

  /* ================================= */
  /* END TURN */
  /* ================================= */

  const endTurn = () => {
    if (!socket || !isSocketConnected) {
      console.log("Socket is not connected");
      return;
    }

    if (!gameState) {
      console.log("No active game");
      return;
    }

    setGameError(null);

    const playerColor = gameState.turn.currentPlayer;

    socket.emit("endTurn", {
      gameId: gameState.gameId,
      playerColor,
    });
  };

  /* ================================= */
  /* CURRENT PLAYER */
  /* ================================= */

  const currentPlayer = gameState?.turn?.currentPlayer;

  const isBlueTurn = currentPlayer === "blue";

  const isGameOver = gameState?.status === "finished";

  /* ================================= */
  /* GRID */
  /* ================================= */

  const gridRows = gameState?.gridRows || 14;
  const gridCols = gameState?.gridCols || 8;

  /*
   * 14 rows × 8 columns
   *
   * Board width / height is based on the
   * number of spaces between dots.
   *
   * 8 columns  -> 7 horizontal spaces
   * 14 rows    -> 13 vertical spaces
   */

  const BOARD_ASPECT_RATIO = (gridCols - 1) / (gridRows - 1);

  /* ================================= */
  /* BOARD SIZE */
  /* ================================= */

  let boardWidth = 0;
  let boardHeight = 0;

  if (boardArea.width > 0 && boardArea.height > 0) {
    /*
     * First try to use the full available width.
     */

    const widthBasedHeight = boardArea.width / BOARD_ASPECT_RATIO;

    if (widthBasedHeight <= boardArea.height) {
      /*
       * Width fits.
       */

      boardWidth = boardArea.width;
      boardHeight = widthBasedHeight;
    } else {
      /*
       * Width does not fit.
       *
       * Calculate board from available height.
       */

      boardHeight = boardArea.height;
      boardWidth = boardHeight * BOARD_ASPECT_RATIO;
    }
  }

  /*
   * Leave a tiny safety margin so the board
   * never touches the surrounding UI.
   */

  boardWidth = Math.floor(boardWidth);
  boardHeight = Math.floor(boardHeight);

  /* ================================= */
  /* SCREEN */
  /* ================================= */

  return (
    <SafeScreen>
      <View className="flex-1 bg-app-light px-4 py-2.5 dark:bg-app-dark">
        {/* ================================= */}
        {/* TOP BAR */}
        {/* ================================= */}

        <View className="mb-2.5 flex-row items-center justify-between">
          {/* BACK BUTTON */}

          <Pressable
            onPress={() => router.back()}
            className="h-[42px] w-[42px] items-center justify-center rounded-xl border border-border-light bg-surface-light dark:border-border-dark dark:bg-surface-dark"
          >
            {({ pressed }) => (
              <Text
                className={`text-[28px] font-normal leading-[30px] text-text-light dark:text-text-dark ${
                  pressed ? "opacity-70" : "opacity-100"
                }`}
              >
                ‹
              </Text>
            )}
          </Pressable>

          {/* TITLE + CONNECTION */}

          <View className="items-center">
            <Text className="text-[18px] font-extrabold text-text-light dark:text-text-dark">
              Dots & Boxes
            </Text>

            <View className="mt-0.5 flex-row items-center">
              <View
                className={`mr-[5px] h-[7px] w-[7px] rounded-full ${
                  isSocketConnected
                    ? "bg-success-light dark:bg-success-dark"
                    : "bg-secondary-light dark:bg-secondary-dark"
                }`}
              />

              <Text className="text-[10px] text-text-secondaryLight dark:text-text-secondaryDark">
                {isSocketConnected ? "Connected" : "Disconnected"}
              </Text>
            </View>
          </View>

          {/* RIGHT SPACER */}

          <View className="h-[42px] w-[42px]" />
        </View>

        {/* ================================= */}
        {/* NO ACTIVE GAME */}
        {/* ================================= */}

        {!gameState && (
          <View className="flex-1 items-center justify-center px-2">
            <View className="w-full max-w-[360px] items-center rounded-[20px] border border-border-light bg-surface-light px-6 py-7 dark:border-border-dark dark:bg-surface-dark">
              {/* SMALL GAME ICON */}

              <View className="relative mb-[18px] h-[58px] w-[58px] items-center justify-center rounded-2xl border border-border-light bg-elevated-light dark:border-border-dark dark:bg-elevated-dark">
                {/* Horizontal line */}

                <View className="absolute left-[14px] top-5 h-1 w-[30px] rounded-full bg-primary-light dark:bg-primary-dark" />

                {/* Bottom line */}

                <View className="absolute bottom-5 right-[14px] h-1 w-[30px] rounded-full bg-secondary-light dark:bg-secondary-dark" />

                {/* Blue dot */}

                <View className="absolute left-3 top-[17px] h-[7px] w-[7px] rounded-full bg-primary-light dark:bg-primary-dark" />

                {/* Red dot */}

                <View className="absolute bottom-[17px] right-3 h-[7px] w-[7px] rounded-full bg-secondary-light dark:bg-secondary-dark" />
              </View>

              {/* READY TITLE */}

              <Text className="text-center text-[24px] font-black text-text-light dark:text-text-dark">
                Ready to Play?
              </Text>

              {/* DESCRIPTION */}

              <Text className="mt-[7px] max-w-[260px] text-center text-[14px] leading-5 text-text-secondaryLight dark:text-text-secondaryDark">
                Start a new offline game and play against another player on this
                device.
              </Text>

              {/* GAME ERROR */}

              {gameError && (
                <View className="mt-[14px] w-full rounded-[10px] border border-secondary-light bg-error-backgroundLight px-[14px] py-2.5 dark:border-secondary-dark dark:bg-error-backgroundDark">
                  <Text className="text-center text-[12px] font-semibold text-secondary-light dark:text-secondary-dark">
                    {gameError}
                  </Text>
                </View>
              )}

              {/* START GAME */}

              <View className="mt-5 w-full">
                <Pressable
                  onPress={createGame}
                  disabled={!isSocketConnected}
                  className={`mt-[30px] h-[52px] w-full items-center justify-center rounded-[13px] border ${
                    isSocketConnected
                      ? "border-success-light bg-success-backgroundLight dark:border-success-dark dark:bg-success-backgroundDark"
                      : "border-border-light bg-elevated-light dark:border-border-dark dark:bg-elevated-dark"
                  }`}
                >
                  {({ pressed }) => (
                    <View
                      className={`flex-row items-center justify-center ${
                        pressed && isSocketConnected ? "opacity-75" : ""
                      }`}
                    >
                      <View
                        className={`mr-2 h-2 w-2 rounded-full ${
                          isSocketConnected
                            ? "bg-success-light dark:bg-success-dark"
                            : "bg-text-mutedLight dark:bg-text-mutedDark"
                        }`}
                      />

                      <Text
                        className={`text-[15px] font-black tracking-[0.3px] ${
                          isSocketConnected
                            ? "text-success-light dark:text-success-dark"
                            : "text-text-mutedLight dark:text-text-mutedDark"
                        }`}
                      >
                        {isSocketConnected
                          ? "START GAME"
                          : "CONNECTION UNAVAILABLE"}
                      </Text>
                    </View>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* ================================= */}
        {/* ACTIVE GAME */}
        {/* ================================= */}

        {gameState && (
          <View className="flex-1">
            {/* ================================= */}
            {/* SCORE BAR */}
            {/* ================================= */}

            <View className="mb-2.5 flex-row items-center justify-between self-center rounded-[14px] border border-border-light bg-surface-light px-4 py-2 dark:border-border-dark dark:bg-surface-dark">
              {/* BLUE PLAYER */}

              <View className="flex-1 items-start">
                <View className="flex-row items-center">
                  <View className="mr-1.5 h-[9px] w-[9px] rounded-full bg-primary-light dark:bg-primary-dark" />

                  <Text className="text-[13px] font-bold text-text-light dark:text-text-dark">
                    Blue
                  </Text>
                </View>

                <Text className="text-[25px] font-black text-primary-light dark:text-primary-dark">
                  {gameState.scores.blue}
                </Text>
              </View>

              {/* TURN */}

              <View className="items-center px-2.5">
                <Text className="text-[9px] font-bold uppercase text-text-secondaryLight dark:text-text-secondaryDark">
                  {isGameOver ? "Game" : "Turn"}
                </Text>

                <View
                  className={`mt-[3px] rounded-full px-2.5 py-1 ${
                    isBlueTurn
                      ? "bg-primary-light dark:bg-primary-dark"
                      : "bg-secondary-light dark:bg-secondary-dark"
                  }`}
                >
                  <Text className="text-[10px] font-black text-white">
                    {isGameOver ? "OVER" : isBlueTurn ? "BLUE" : "RED"}
                  </Text>
                </View>
              </View>

              {/* RED PLAYER */}

              <View className="flex-1 items-end">
                <View className="flex-row items-center">
                  <Text className="text-[13px] font-bold text-text-light dark:text-text-dark">
                    Red
                  </Text>

                  <View className="ml-1.5 h-[9px] w-[9px] rounded-full bg-secondary-light dark:bg-secondary-dark" />
                </View>

                <Text className="text-[25px] font-black text-secondary-light dark:text-secondary-dark">
                  {gameState.scores.red}
                </Text>
              </View>
            </View>

            {/* ================================= */}
            {/* BOARD */}
            {/* ================================= */}

            <View
              className="min-h-0 flex-1 items-center justify-center"
              onLayout={(event) => {
                const { width: measuredWidth, height: measuredHeight } =
                  event.nativeEvent.layout;

                setBoardArea({
                  width: measuredWidth,
                  height: measuredHeight,
                });
              }}
            >
              {boardWidth > 0 && boardHeight > 0 && (
                <View
                  style={{
                    width: boardWidth,
                    height: boardHeight,
                  }}
                  className="items-center justify-center"
                >
                  <GameBoard
                    gridRows={gridRows}
                    gridCols={gridCols}
                    boardWidth={boardWidth}
                    boardHeight={boardHeight}
                    gameState={gameState}
                    onMakeMove={makeMove}
                  />
                </View>
              )}
            </View>

            {/* ================================= */}
            {/* TURN MESSAGE */}
            {/* ================================= */}

            <View className="mt-1.5 items-center">
              <Text
                className={`text-center text-[12px] ${
                  gameState.turn.canEndTurn
                    ? "font-bold text-success-light dark:text-success-dark"
                    : "font-medium text-text-secondaryLight dark:text-text-secondaryDark"
                }`}
              >
                {gameState.turn.canEndTurn
                  ? "Box completed! You can end your turn."
                  : isGameOver
                    ? "Game finished"
                    : `${isBlueTurn ? "Blue" : "Red"}'s turn`}
              </Text>
            </View>

            {/* ================================= */}
            {/* END TURN */}
            {/* ================================= */}

            <Pressable
              onPress={endTurn}
              disabled={!gameState.turn.canEndTurn}
              className={`mb-0.5 mt-[7px] self-center items-center rounded-[11px] py-[11px] ${
                gameState.turn.canEndTurn
                  ? "bg-primary-light dark:bg-primary-dark"
                  : "bg-elevated-light dark:bg-elevated-dark"
              }`}
              style={{
                width: boardWidth > 0 ? boardWidth : "100%",
              }}
            >
              {({ pressed }) => (
                <Text
                  className={`text-[14px] font-extrabold ${
                    gameState.turn.canEndTurn
                      ? "text-white"
                      : "text-text-mutedLight dark:text-text-mutedDark"
                  } ${pressed ? "opacity-80" : ""}`}
                >
                  End Turn
                </Text>
              )}
            </Pressable>
          </View>
        )}
      </View>
    </SafeScreen>
  );
};

export default Game;
