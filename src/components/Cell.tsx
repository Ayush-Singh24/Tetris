import { CellOptions } from "../types";

interface CellProps {
  type: CellOptions | "hidden";
}
export default function Cell({ type }: CellProps) {
  return <div className={`cell ${type}`}></div>;
}
