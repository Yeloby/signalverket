import {
  connectedCells,
  generateSolvedBoard,
  isSolved,
  rotate,
  scrambleBoard
} from "./gameLogic.js";

const size = 6;
const boardElement = document.querySelector("#board");
const timeElement = document.querySelector("#time");
const movesElement = document.querySelector("#moves");
const statusElement = document.querySelector("#status");
const newGameButton = document.querySelector("#new-game");

let board = [];
let solvedBoard = [];
let buttons = [];
let moves = 0;
let startedAt = 0;
let timer = null;
let selected = 0;
let complete = false;

function pipeSvg(mask) {
  const lines = [
    mask & 1 ? '<path d="M50 50V0"/>' : "",
    mask & 2 ? '<path d="M50 50H100"/>' : "",
    mask & 4 ? '<path d="M50 50V100"/>' : "",
    mask & 8 ? '<path d="M50 50H0"/>' : ""
  ].join("");
  return `<svg viewBox="0 0 100 100" aria-hidden="true">${lines}<circle cx="50" cy="50" r="10"/></svg>`;
}

function formatTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function render() {
  const powered = connectedCells(board, size);
  buttons.forEach((button, index) => {
    button.innerHTML = pipeSvg(board[index]);
    button.classList.toggle("powered", powered.has(index));
    button.classList.toggle("selected", selected === index);
    button.setAttribute("aria-label", `Rute ${index + 1}${powered.has(index) ? ", aktiv" : ""}`);
  });
}

function finish() {
  complete = true;
  clearInterval(timer);
  statusElement.textContent = `Nettet er stabilt! Fullført på ${timeElement.textContent} med ${moves} trekk.`;
  statusElement.classList.add("success");
}

function turn(index, amount = 1) {
  if (complete) return;
  board[index] = rotate(board[index], amount);
  moves += 1;
  movesElement.textContent = String(moves);
  render();
  if (isSolved(board, size)) finish();
}

function createBoard() {
  boardElement.replaceChildren();
  buttons = board.map((_, index) => {
    const button = document.createElement("button");
    button.className = "tile";
    button.type = "button";
    button.addEventListener("click", () => {
      selected = index;
      turn(index);
    });
    button.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      selected = index;
      turn(index, -1);
    });
    boardElement.append(button);
    return button;
  });
}

function newGame() {
  clearInterval(timer);
  solvedBoard = generateSolvedBoard(size);
  board = scrambleBoard(solvedBoard);
  moves = 0;
  selected = 0;
  complete = false;
  startedAt = performance.now();
  movesElement.textContent = "0";
  timeElement.textContent = "00:00";
  statusElement.textContent = "Koble energikilden til hele nettet.";
  statusElement.classList.remove("success");
  createBoard();
  render();
  timer = setInterval(() => {
    timeElement.textContent = formatTime(performance.now() - startedAt);
  }, 250);
}

document.addEventListener("keydown", (event) => {
  const row = Math.floor(selected / size);
  const column = selected % size;
  if (event.key === "ArrowUp" && row > 0) selected -= size;
  else if (event.key === "ArrowDown" && row < size - 1) selected += size;
  else if (event.key === "ArrowLeft" && column > 0) selected -= 1;
  else if (event.key === "ArrowRight" && column < size - 1) selected += 1;
  else if (event.key === "Enter" || event.key === " ") turn(selected);
  else return;
  event.preventDefault();
  render();
  buttons[selected].focus();
});

newGameButton.addEventListener("click", newGame);
newGame();
