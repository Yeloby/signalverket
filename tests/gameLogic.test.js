import test from "node:test";
import assert from "node:assert/strict";
import {
  connectedCells,
  generateSolvedBoard,
  isSolved,
  rotate,
  scrambleBoard
} from "../gameLogic.js";

test("fire rotasjoner gir opprinnelig brikke", () => {
  assert.equal(rotate(3, 4), 3);
  assert.equal(rotate(1), 2);
});

test("generatoren lager et sammenhengende løst brett", () => {
  const board = generateSolvedBoard(6, () => 0.37);
  assert.equal(board.length, 36);
  assert.equal(connectedCells(board, 6).size, 36);
  assert.equal(isSolved(board, 6), true);
});

test("et stokket brett starter ikke ferdig", () => {
  const solved = generateSolvedBoard(3, () => 0.42);
  let value = 0;
  const scrambled = scrambleBoard(solved, () => {
    value = (value + 0.31) % 1;
    return value;
  });
  assert.equal(isSolved(scrambled, 3), false);
});

test("stokking terminerer selv med en konstant tilfeldig verdi", () => {
  const solved = generateSolvedBoard(3, () => 0.42);
  const scrambled = scrambleBoard(solved, () => 0);
  assert.equal(isSolved(scrambled, 3), false);
});

test("ugyldig brettstørrelse avvises", () => {
  assert.throws(() => generateSolvedBoard(0), RangeError);
  assert.throws(() => scrambleBoard([1, 2]), RangeError);
});
