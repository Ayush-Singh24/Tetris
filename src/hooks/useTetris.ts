import { useCallback, useState } from "react";
import { hasCollision, useTetrisBoard } from "./useTetrisBoard";
import { useInterval } from "./useInterval";
import { Block, BlockShape, BoardShape } from "../types";

enum DropSpeed {
  Normal = 800,
  Sliding = 100,
}

export function useTetris() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [dropSpeed, setDropSpeed] = useState<DropSpeed | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [
    { board, droppingBlock, droppingColumn, droppingRow, droppingShape },
    dispatchBoardState,
  ] = useTetrisBoard();

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setDropSpeed(DropSpeed.Normal);
    dispatchBoardState({ type: "start" });
  }, [dispatchBoardState]);

  const savingPostion = useCallback(() => {
    if (!hasCollision(board, droppingShape, droppingRow + 1, droppingColumn)) {
      setIsSaving(false);
      setDropSpeed(DropSpeed.Normal);
      return;
    }
    const newBoard = structuredClone(board) as BoardShape;
    addShapeToBoard(
      newBoard,
      droppingBlock,
      droppingShape,
      droppingRow,
      droppingColumn
    );

    setDropSpeed(DropSpeed.Normal);
    dispatchBoardState({ type: "save", newBoard });
    setIsSaving(false);
  }, [
    board,
    droppingShape,
    droppingRow,
    droppingColumn,
    dispatchBoardState,
    droppingBlock,
  ]);

  const gameSpeed = useCallback(() => {
    if (isSaving) {
      savingPostion();
    } else if (
      hasCollision(board, droppingShape, droppingRow + 1, droppingColumn)
    ) {
      setDropSpeed(DropSpeed.Sliding);
      setIsSaving(true);
    } else {
      dispatchBoardState({ type: "drop" });
    }
  }, [
    board,
    dispatchBoardState,
    droppingColumn,
    droppingRow,
    droppingShape,
    savingPostion,
    isSaving,
  ]);

  useInterval(() => {
    if (!isPlaying) {
      return;
    }
    gameSpeed();
  }, dropSpeed);

  const renderedBoard = structuredClone(board) as BoardShape;
  if (isPlaying) {
    addShapeToBoard(
      renderedBoard,
      droppingBlock,
      droppingShape,
      droppingRow,
      droppingColumn
    );
  }

  return {
    board: renderedBoard,
    startGame,
    isPlaying,
  };
}

function addShapeToBoard(
  board: BoardShape,
  droppingBlock: Block,
  droppingShape: BlockShape,
  droppingRow: number,
  droppingColumn: number
) {
  droppingShape
    .filter((row) => row.some((isSet) => isSet))
    .forEach((row: boolean[], rowIndex: number) => {
      row.forEach((isSet: boolean, colIndex: number) => {
        if (isSet) {
          board[droppingRow + rowIndex][droppingColumn + colIndex] =
            droppingBlock;
        }
      });
    });
}
