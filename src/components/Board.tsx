import { BoardShape } from "../types";
import Cell from "./Cell";

interface BoardProps {
  currentBoard: BoardShape;
}

export default function Board({ currentBoard }: BoardProps) {
  return (
    <div className="board">
      {currentBoard.map((row, rowIndex) => (
        <div className="row" key={rowIndex}>
          {row.map((cell, colIndex) => {
            return <Cell key={`${rowIndex}-${colIndex}`} type={cell} />;
          })}
        </div>
      ))}
    </div>
  );
}
