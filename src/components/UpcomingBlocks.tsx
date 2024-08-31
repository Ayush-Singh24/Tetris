import { SHAPES } from "../constants";
import { Block } from "../types";
import Cell from "./Cell";

interface UpcomingBlocksProps {
  upcomingBlock: Block[];
}

export default function UpcomingBlock({ upcomingBlock }: UpcomingBlocksProps) {
  return (
    <div className="upcoming">
      {upcomingBlock.map((block, blockIndex) => {
        const shape = SHAPES[block].shape.filter((row) =>
          row.some((isSet) => isSet)
        );
        return (
          <div key={blockIndex}>
            {shape.map((row, rowIndex) => {
              return (
                <div key={rowIndex} className="row">
                  {row.map((isSet, colIndex) => {
                    const type = isSet ? block : "hidden";
                    return <Cell key={`${rowIndex}-${colIndex}`} type={type} />;
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
