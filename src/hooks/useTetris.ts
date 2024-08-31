import { useCallback, useState } from "react";
import { useTetrisBoard } from "./useTetrisBoard";
import { useInterval } from "./useInterval";
import { BoardShape } from "../types";

enum DropSpeed {
  Normal = 800,
}

export function useTetris() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [dropSpeed, setDropSpeed] = useState<DropSpeed | null>(null);

  const [
    { board, droppingBlock, droppingColumn, droppingRow, droppingShape },
    dispatchBoardState,
  ] = useTetrisBoard();

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setDropSpeed(DropSpeed.Normal);
    dispatchBoardState({ type: "start" });
  }, [dispatchBoardState]);

  const gameSpeed = useCallback(() => {
    dispatchBoardState({ type: "drop" });
  }, [dispatchBoardState]);

  useInterval(() => {
    if (!isPlaying) {
      return;
    }
    gameSpeed();
  }, dropSpeed);

  const renderedBoard = structuredClone(board) as BoardShape;
  if (isPlaying) {
    droppingShape
      .filter((row) => row.some((isSet) => isSet))
      .forEach((row: boolean[], rowIndex: number) => {
        row.forEach((isSet: boolean, colIndex: number) => {
          if (isSet) {
            renderedBoard[droppingRow + rowIndex][droppingColumn + colIndex] =
              droppingBlock;
          }
        });
      });
  }

  return {
    board: renderedBoard,
    startGame,
    isPlaying,
  };
}
