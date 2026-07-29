export const DIRECTIONS = [
  { bit: 1, opposite: 4, row: -1, column: 0 },
  { bit: 2, opposite: 8, row: 0, column: 1 },
  { bit: 4, opposite: 1, row: 1, column: 0 },
  { bit: 8, opposite: 2, row: 0, column: -1 }
];

export function rotate(mask, turns = 1) {
  let result = mask;
  for (let index = 0; index < ((turns % 4) + 4) % 4; index += 1) {
    result = ((result << 1) & 15) | ((result >> 3) & 1);
  }
  return result;
}

export function generateSolvedBoard(size = 6, random = Math.random) {
  if (!Number.isInteger(size) || size < 1) {
    throw new RangeError("size must be a positive integer");
  }
  const board = Array.from({ length: size * size }, () => 0);
  const visited = new Set([0]);
  const frontier = [];

  function addFrontier(index) {
    const row = Math.floor(index / size);
    const column = index % size;
    DIRECTIONS.forEach((direction) => {
      const nextRow = row + direction.row;
      const nextColumn = column + direction.column;
      if (nextRow < 0 || nextRow >= size || nextColumn < 0 || nextColumn >= size) return;
      const next = nextRow * size + nextColumn;
      if (!visited.has(next)) frontier.push({ from: index, to: next, direction });
    });
  }

  addFrontier(0);
  while (visited.size < board.length) {
    const choice = Math.floor(random() * frontier.length);
    const edge = frontier.splice(choice, 1)[0];
    if (visited.has(edge.to)) continue;
    board[edge.from] |= edge.direction.bit;
    board[edge.to] |= edge.direction.opposite;
    visited.add(edge.to);
    addFrontier(edge.to);
  }

  return board;
}

export function scrambleBoard(board, random = Math.random, size = Math.sqrt(board.length)) {
  if (!Number.isInteger(size) || size < 1 || size * size !== board.length) {
    throw new RangeError("board must be a non-empty square");
  }
  if (board.length === 1) return [...board];

  for (let attempt = 0; attempt < 100; attempt += 1) {
    const scrambled = board.map((mask) => rotate(mask, Math.floor(random() * 4)));
    if (!isSolved(scrambled, size)) return scrambled;
  }

  // Also terminates with a pathological random function, such as () => 0.
  for (let index = 0; index < board.length; index += 1) {
    for (let turns = 1; turns < 4; turns += 1) {
      const scrambled = [...board];
      scrambled[index] = rotate(scrambled[index], turns);
      if (!isSolved(scrambled, size)) return scrambled;
    }
  }
  return [...board];
}

export function rotationsToSolution(board, solvedBoard) {
  if (board.length !== solvedBoard.length) {
    throw new RangeError("boards must have the same length");
  }

  return board.map((mask, index) => {
    for (let turns = 0; turns < 4; turns += 1) {
      if (rotate(mask, turns) === solvedBoard[index]) return turns;
    }
    throw new Error(`tile ${index} cannot be rotated to its solved state`);
  });
}

export function connectedCells(board, size = 6, source = 0) {
  if (board.length === 0 || source < 0 || source >= board.length) return new Set();
  const connected = new Set([source]);
  const queue = [source];

  while (queue.length) {
    const index = queue.shift();
    const row = Math.floor(index / size);
    const column = index % size;
    for (const direction of DIRECTIONS) {
      if (!(board[index] & direction.bit)) continue;
      const nextRow = row + direction.row;
      const nextColumn = column + direction.column;
      if (nextRow < 0 || nextRow >= size || nextColumn < 0 || nextColumn >= size) continue;
      const next = nextRow * size + nextColumn;
      if (!(board[next] & direction.opposite) || connected.has(next)) continue;
      connected.add(next);
      queue.push(next);
    }
  }

  return connected;
}

export function isSolved(board, size = 6) {
  return connectedCells(board, size).size === board.length;
}
