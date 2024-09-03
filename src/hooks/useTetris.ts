import { useCallback, useEffect, useState } from "react";
import {
  BOARD_HEIGHT,
  getRandomBlock,
  hasCollision,
  useTetrisBoard,
} from "./useTetrisBoard";
import { useInterval } from "./useInterval";
import { Block, BlockShape, BoardShape, EmptyCell } from "../types";
import { SHAPES } from "../constants";

enum DropSpeed {
  Normal = 800,
  Sliding = 100,
  Fast = 50,
}

export function useTetris() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [dropSpeed, setDropSpeed] = useState<DropSpeed | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [upcomingBlocks, setUpcomingBlocks] = useState<Block[]>([]);
  const [score, setScore] = useState(0);
  const [
    { board, droppingBlock, droppingColumn, droppingRow, droppingShape },
    dispatchBoardState,
  ] = useTetrisBoard();

  useEffect(() => {
    if (!isPlaying || isPaused) {
      setDropSpeed(null);
      return;
    }

    let isPressingLeft = false;
    let isPressingRight = false;

    const updateMovementInterval = () => {
      clearInterval(moveIntervalID);
      dispatchBoardState({
        type: "move",
        isPressingLeft,
        isPressingRight,
      });
    };
    const moveIntervalID = setInterval(() => {
      dispatchBoardState({
        type: "move",
        isPressingLeft,
        isPressingRight,
      });
    }, 300);

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
        isPressingLeft = true;
        updateMovementInterval();
      }

      if (event.key === "d") {
        isPressingRight = true;
        updateMovementInterval();
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "s") {
        setDropSpeed(DropSpeed.Normal);
      }

      if (event.key === "a") {
        isPressingLeft = false;
        updateMovementInterval();
      }

      if (event.key === "d") {
        isPressingRight = false;
        updateMovementInterval();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      clearInterval(moveIntervalID);
      setDropSpeed(DropSpeed.Normal);
    };
  }, [isPlaying, dispatchBoardState, isPaused]);

  const startGame = useCallback(() => {
    const startingBlocks = [
      getRandomBlock(),
      getRandomBlock(),
      getRandomBlock(),
    ];
    setUpcomingBlocks(startingBlocks);
    setScore(0);
    setIsPlaying(true);
    setIsPaused(false);
    setDropSpeed(DropSpeed.Normal);
    dispatchBoardState({ type: "start" });
  }, [dispatchBoardState]);

  const savingPosition = useCallback(() => {
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

    let numClearedRows = 0;
    for (let i = BOARD_HEIGHT - 1; i >= 0; i--) {
      if (newBoard[i].every((entry) => entry !== EmptyCell.Empty)) {
        numClearedRows++;
        newBoard.splice(i, 1);
      }
    }

    const newUpcomingBlock = structuredClone(upcomingBlocks);
    const newBlock = newUpcomingBlock.pop() as Block;
    newUpcomingBlock.unshift(getRandomBlock());

    if (hasCollision(board, SHAPES[newBlock].shape, 0, 3)) {
      setIsPlaying(false);
      setDropSpeed(null);
    } else {
      setDropSpeed(DropSpeed.Normal);
    }

    setScore((prevScore) => prevScore + getPoints(numClearedRows));
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

  const pauseGame = useCallback(() => {
    if (!isPaused) {
      setIsPaused(true);
      setDropSpeed(null);
    } else {
      setIsPaused(false);
      setDropSpeed(DropSpeed.Normal);
    }
  }, [isPaused]);

  const gameSpeed = useCallback(() => {
    if (isSaving) {
      savingPosition();
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
    savingPosition,
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
    isPaused,
    pauseGame,
    score,
    upcomingBlocks,
  };
}

function getPoints(numClearedRows: number): number {
  switch (numClearedRows) {
    case 0:
      return 0;
    case 1:
      return 100;
    case 2:
      return 300;
    case 3:
      return 500;
    case 4:
      return 800;
    default:
      throw new Error("Unexpected number of rows cleared!");
  }
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
