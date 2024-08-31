import { useCallback, useEffect, useState } from "react";
import { getRandomBlock, hasCollision, useTetrisBoard } from "./useTetrisBoard";
import { useInterval } from "./useInterval";
import { Block, BlockShape, BoardShape } from "../types";

enum DropSpeed {
  Normal = 800,
  Sliding = 100,
  Fast = 50,
}

export function useTetris() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [dropSpeed, setDropSpeed] = useState<DropSpeed | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [upcomingBlocks, setUpcomingBlocks] = useState<Block[]>([]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) {
        return;
      }
      if (event.key === "s") {
        setDropSpeed(DropSpeed.Fast);
      }

      if (event.key === "w") {
        dispatchBoardState({ type: "move", isRotating: true });
      }

      if (event.key === "a") {
        dispatchBoardState({ type: "move", isPressingLeft: true });
      }

      if (event.key === "d") {
        dispatchBoardState({ type: "move", isPressingRight: true });
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "s") {
        setDropSpeed(DropSpeed.Normal);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      setDropSpeed(DropSpeed.Normal);
    };
  }, [isPlaying]);

  const [
    { board, droppingBlock, droppingColumn, droppingRow, droppingShape },
    dispatchBoardState,
  ] = useTetrisBoard();

  const startGame = useCallback(() => {
    const startingBlocks = [
      getRandomBlock(),
      getRandomBlock(),
      getRandomBlock(),
    ];
    setUpcomingBlocks(startingBlocks);
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
    const newBoard = structuredClone(board);
    addShapeToBoard(
      newBoard,
      droppingBlock,
      droppingShape,
      droppingRow,
      droppingColumn
    );

    const newUpcomingBlock = structuredClone(upcomingBlocks);
    const newBlock = newUpcomingBlock.pop();
    newUpcomingBlock.unshift(getRandomBlock());

    setDropSpeed(DropSpeed.Normal);
    setUpcomingBlocks(newUpcomingBlock);
    dispatchBoardState({ type: "save", newBoard, newBlock });
    setIsSaving(false);
  }, [
    board,
    droppingShape,
    droppingRow,
    droppingColumn,
    dispatchBoardState,
    droppingBlock,
    upcomingBlocks,
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

  const renderedBoard = structuredClone(board);
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
