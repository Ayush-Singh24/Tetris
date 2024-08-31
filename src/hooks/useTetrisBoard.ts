import { Dispatch, useReducer } from "react";
import { Block, BlockShape, BoardShape, EmptyCell } from "../types";
import { SHAPES } from "../constants";

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export type BoardState = {
  board: BoardShape;
  droppingRow: number;
  droppingColumn: number;
  droppingBlock: Block;
  droppingShape: BlockShape;
};

export function getEmptyBoard(height = BOARD_HEIGHT): BoardShape {
  return Array(height)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(EmptyCell.Empty));
}

export function getRandomBlock(): Block {
  const blockValues = Object.values(Block);
  return blockValues[Math.floor(Math.random() * blockValues.length)];
}

type Action = {
  type: "start" | "drop" | "save" | "move";
  newBoard?: BoardShape;
};

function boardReducer(state: BoardState, action: Action): BoardState {
  const newState = { ...state };
  switch (action.type) {
    case "start": {
      const firstBlock = getRandomBlock();
      return {
        board: getEmptyBoard(),
        droppingRow: 0,
        droppingColumn: 3,
        droppingBlock: firstBlock,
        droppingShape: SHAPES[firstBlock].shape,
      };
    }
    case "drop":
      newState.droppingRow++;
      break;
    case "save":
      return {
        board: action.newBoard!,
        droppingRow: 0,
        droppingColumn: 3,
        droppingBlock: state.droppingBlock,
        droppingShape: state.droppingShape,
      };
      break;
    case "move":
      break;
    default: {
      const unhandledType: never = action.type;
      throw new Error("Unhandled Action Type: " + unhandledType);
    }
  }
  return newState;
}

export function hasCollision(
  board: BoardShape,
  currentShape: BlockShape,
  row: number,
  col: number
): boolean {
  let hasCollision = false;
  currentShape
    .filter((shapeRow) => shapeRow.some((isSet) => isSet))
    .forEach((shapeRow: boolean[], rowIndex: number) => {
      shapeRow.forEach((isSet: boolean, colIndex: number) => {
        if (
          isSet &&
          (row + rowIndex >= board.length ||
            col + colIndex >= board[0].length ||
            col + colIndex < 0 ||
            board[row + rowIndex][col + colIndex] !== EmptyCell.Empty)
        ) {
          hasCollision = true;
        }
      });
    });
  return hasCollision;
}

export function useTetrisBoard(): [BoardState, Dispatch<Action>] {
  const [boardState, dispatchBoardState] = useReducer(
    boardReducer,
    {
      board: [],
      droppingRow: 0,
      droppingColumn: 0,
      droppingBlock: Block.I,
      droppingShape: SHAPES.I.shape,
    },
    (emptyState) => {
      const state = {
        ...emptyState,
        board: getEmptyBoard(),
      };
      return state;
    }
  );

  return [boardState, dispatchBoardState];
}
