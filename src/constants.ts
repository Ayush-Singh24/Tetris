import { ShapesBoolObj } from "./types";

export const SHAPES: ShapesBoolObj = {
  I: {
    shape: [
      [false, false, false, false],
      [false, false, false, false],
      [true, true, true, true],
      [false, false, false, false],
    ],
  },
  J: {
    shape: [
      [false, false, false],
      [true, false, false],
      [true, true, true],
    ],
  },
  L: {
    shape: [
      [false, false, false],
      [false, false, true],
      [true, true, true],
    ],
  },
  O: {
    shape: [
      [true, true],
      [true, true],
    ],
  },
  S: {
    shape: [
      [false, false, false],
      [false, true, true],
      [true, true, false],
    ],
  },
  T: {
    shape: [
      [false, false, false],
      [true, true, true],
      [false, true, false],
    ],
  },
  Z: {
    shape: [
      [false, false, false],
      [true, true, false],
      [false, true, true],
    ],
  },
};
