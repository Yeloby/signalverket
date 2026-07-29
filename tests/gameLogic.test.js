import test from "node:test";
import assert from "node:assert/strict";
import {
  connectedCells,
  generateSolvedBoard,
  isSolved,
  rotate,
  rotationsToSolution,
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
  assert.throws(() => rotationsToSolution([1], [1, 2]), RangeError);
});

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
}

test("alle nivåer er garantert løsbare etter stokking", () => {
  for (const size of [5, 6, 7]) {
    for (let seed = 1; seed <= 500; seed += 1) {
      const random = seededRandom(seed * 97 + size);
      const solved = generateSolvedBoard(size, random);
      const scrambled = scrambleBoard(solved, random, size);
      const turns = rotationsToSolution(scrambled, solved);
      const restored = scrambled.map((mask, index) => rotate(mask, turns[index]));

      assert.equal(isSolved(solved, size), true, `løsningsbrett ${size}×${size}, seed ${seed}`);
      assert.equal(isSolved(scrambled, size), false, `startbrett ${size}×${size}, seed ${seed}`);
      assert.deepEqual(restored, solved, `rotasjonsløsning ${size}×${size}, seed ${seed}`);
      assert.equal(isSolved(restored, size), true, `gjenopprettet brett ${size}×${size}, seed ${seed}`);
    }
  }
});
