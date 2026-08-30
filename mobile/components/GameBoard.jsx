import React from "react";

import { Canvas, Circle, Line, Group } from "@shopify/react-native-skia";

import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { runOnJS } from "react-native-worklets";

import { useColorScheme } from "nativewind";

import colors from "../theme/colors.js";

const DOT_RADIUS = 3;
const TOUCH_RADIUS = 16;

// Extra space so the edge dots are never clipped.
const BOARD_PADDING = 8;

const GameBoard = ({
  gridRows = 14,
  gridCols = 8,
  boardWidth = 300,
  boardHeight = 500,
  gameState,
  onMakeMove,
}) => {
  const { colorScheme } = useColorScheme();

  const isDark = colorScheme === "dark";

  /*
   * =================================
   * ACTIVE THEME
   * =================================
   *
   * GameBoard uses Skia, so Tailwind classes
   * cannot be used for the actual dots/lines.
   *
   * We therefore read the same centralized
   * colors used by the rest of the application.
   */

  const theme = isDark ? colors.dark : colors.light;

  const boardColors = {
    dot: theme.dot,
    line: theme.line,

    blue: theme.blue,
    red: theme.red,

    blueHighlight: theme.blueHighlight,
    redHighlight: theme.redHighlight,
  };

  /*
   * =================================
   * INTERNAL BOARD SIZE
   * =================================
   *
   * The Canvas has its own dimensions.
   *
   * We keep some internal padding so that
   * the first and last dots are not sitting
   * directly on the Canvas edges.
   */

  const innerWidth = Math.max(0, boardWidth - BOARD_PADDING * 2);

  const innerHeight = Math.max(0, boardHeight - BOARD_PADDING * 2);

  /*
   * =================================
   * GRID SPACING
   * =================================
   *
   * gridCols = number of dots horizontally
   * gridRows = number of dots vertically
   *
   * Therefore:
   *
   * horizontal spaces = gridCols - 1
   * vertical spaces   = gridRows - 1
   */

  const horizontalSpacing = gridCols > 1 ? innerWidth / (gridCols - 1) : 0;

  const verticalSpacing = gridRows > 1 ? innerHeight / (gridRows - 1) : 0;

  /*
   * =================================
   * GET DOT POSITION
   * =================================
   */

  const getDotPosition = (row, col) => {
    return {
      x: BOARD_PADDING + col * horizontalSpacing,
      y: BOARD_PADDING + row * verticalSpacing,
    };
  };

  /*
   * =================================
   * CHECK EXISTING LINE
   * =================================
   */

  const hasLine = (key) => {
    const lines = gameState?.lines;

    if (!lines) {
      return false;
    }

    if (Array.isArray(lines)) {
      return lines.includes(key);
    }

    if (lines instanceof Set) {
      return lines.has(key);
    }

    if (typeof lines === "object") {
      return Object.prototype.hasOwnProperty.call(lines, key);
    }

    return false;
  };

  /*
   * =================================
   * FIND TOUCHED LINE
   * =================================
   */

  const findTouchedLine = (x, y) => {
    let closestLine = null;

    let closestDistance = Infinity;

    /*
     * =================================
     * HORIZONTAL LINES
     * =================================
     */

    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols - 1; col++) {
        const start = getDotPosition(row, col);

        const end = getDotPosition(row, col + 1);

        const distance = distanceToLineSegment(
          x,
          y,
          start.x,
          start.y,
          end.x,
          end.y,
        );

        if (distance < closestDistance) {
          closestDistance = distance;

          closestLine = {
            row,
            col,
            direction: "h",
          };
        }
      }
    }

    /*
     * =================================
     * VERTICAL LINES
     * =================================
     */

    for (let row = 0; row < gridRows - 1; row++) {
      for (let col = 0; col < gridCols; col++) {
        const start = getDotPosition(row, col);

        const end = getDotPosition(row + 1, col);

        const distance = distanceToLineSegment(
          x,
          y,
          start.x,
          start.y,
          end.x,
          end.y,
        );

        if (distance < closestDistance) {
          closestDistance = distance;

          closestLine = {
            row,
            col,
            direction: "v",
          };
        }
      }
    }

    /*
     * =================================
     * TOUCH DISTANCE
     * =================================
     */

    if (closestDistance > TOUCH_RADIUS) {
      return null;
    }

    return closestLine;
  };

  /*
   * =================================
   * HANDLE TAP
   * =================================
   */

  const handleLineTap = (x, y) => {
    const line = findTouchedLine(x, y);

    if (!line) {
      console.log("No line detected");
      return;
    }

    console.log("TOUCHED LINE:", line);

    /*
     * IMPORTANT:
     *
     * Only send the move after a TAP.
     *
     * Pan / finger movement does not trigger
     * this function.
     */

    onMakeMove(line);
  };

  /*
   * =================================
   * TAP ONLY
   * =================================
   */

  const tapGesture = Gesture.Tap()
    .maxDuration(250)
    .maxDistance(10)
    .onEnd((event, success) => {
      if (!success) {
        return;
      }

      runOnJS(handleLineTap)(event.x, event.y);
    });

  /*
   * =================================
   * RENDER
   * =================================
   */

  return (
    <GestureDetector gesture={tapGesture}>
      <Canvas
        style={{
          width: boardWidth,
          height: boardHeight,
        }}
      >
        <Group>
          {/* ================================= */}
          {/* HORIZONTAL LINES */}
          {/* ================================= */}

          {Array.from({
            length: gridRows,
          }).map((_, row) =>
            Array.from({
              length: gridCols - 1,
            }).map((_, col) => {
              const key = `${row}-${col}-h`;

              if (!hasLine(key)) {
                return null;
              }

              const start = getDotPosition(row, col);

              const end = getDotPosition(row, col + 1);

              return (
                <Line
                  key={key}
                  p1={{
                    x: start.x,
                    y: start.y,
                  }}
                  p2={{
                    x: end.x,
                    y: end.y,
                  }}
                  strokeWidth={4}
                  strokeCap="round"
                  color={boardColors.line}
                />
              );
            }),
          )}

          {/* ================================= */}
          {/* VERTICAL LINES */}
          {/* ================================= */}

          {Array.from({
            length: gridRows - 1,
          }).map((_, row) =>
            Array.from({
              length: gridCols,
            }).map((_, col) => {
              const key = `${row}-${col}-v`;

              if (!hasLine(key)) {
                return null;
              }

              const start = getDotPosition(row, col);

              const end = getDotPosition(row + 1, col);

              return (
                <Line
                  key={key}
                  p1={{
                    x: start.x,
                    y: start.y,
                  }}
                  p2={{
                    x: end.x,
                    y: end.y,
                  }}
                  strokeWidth={4}
                  strokeCap="round"
                  color={boardColors.line}
                />
              );
            }),
          )}

          {/* ================================= */}
          {/* DOTS */}
          {/* ================================= */}

          {Array.from({
            length: gridRows,
          }).map((_, row) =>
            Array.from({
              length: gridCols,
            }).map((_, col) => {
              const { x, y } = getDotPosition(row, col);

              return (
                <Circle
                  key={`dot-${row}-${col}`}
                  cx={x}
                  cy={y}
                  r={DOT_RADIUS}
                  color={boardColors.dot}
                />
              );
            }),
          )}
        </Group>
      </Canvas>
    </GestureDetector>
  );
};

/*
 * =================================
 * DISTANCE TO LINE SEGMENT
 * =================================
 */

function distanceToLineSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  if (dx === 0 && dy === 0) {
    return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
  }

  const t = ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy);

  const clampedT = Math.max(0, Math.min(1, t));

  const closestX = x1 + clampedT * dx;

  const closestY = y1 + clampedT * dy;

  return Math.sqrt((px - closestX) ** 2 + (py - closestY) ** 2);
}

export default GameBoard;
