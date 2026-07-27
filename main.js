import {
  connectedCells,
  generateSolvedBoard,
  isSolved,
  rotate,
  scrambleBoard
} from "./gameLogic.js";

let size = 6;
const boardElement = document.querySelector("#board");
const timeElement = document.querySelector("#time");
const movesElement = document.querySelector("#moves");
const poweredElement = document.querySelector("#powered");
const bestElement = document.querySelector("#best");
const statusElement = document.querySelector("#status");
const newGameButton = document.querySelector("#new-game");
const menuDialog = document.querySelector("#menu-dialog");
const openMenuButton = document.querySelector("#open-menu");
const closeMenuButton = document.querySelector("#close-menu");
const boardSizeSelect = document.querySelector("#board-size");
const animationsToggle = document.querySelector("#animations");
const resetBestButton = document.querySelector("#reset-best");

let board = [];
let solvedBoard = [];
let buttons = [];
let moves = 0;
let startedAt = 0;
let timer = null;
let selected = 0;
let complete = false;
let elapsed = 0;

function loadBest() {
  try {
    const value = Number(localStorage.getItem(`signalverket-best-${size}`));
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
}

let bestTime = loadBest();

function loadSettings() {
  try {
    const savedSize = Number(localStorage.getItem("signalverket-size"));
    if ([5, 6, 7].includes(savedSize)) size = savedSize;
    return localStorage.getItem("signalverket-animations") !== "false";
  } catch {
    return true;
  }
}

const animationsEnabled = loadSettings();
bestTime = loadBest();
boardSizeSelect.value = String(size);
animationsToggle.checked = animationsEnabled;
document.documentElement.classList.toggle("no-animations", !animationsEnabled);

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
  poweredElement.textContent = `${powered.size}/${board.length}`;
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
  elapsed = performance.now() - startedAt;
  timeElement.textContent = formatTime(elapsed);
  boardElement.classList.add("complete");
  if (bestTime === null || elapsed < bestTime) {
    bestTime = elapsed;
    bestElement.textContent = formatTime(bestTime);
    try {
      localStorage.setItem(`signalverket-best-${size}`, String(bestTime));
    } catch {
      // The game remains fully playable when storage is unavailable.
    }
  }
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
  boardElement.classList.remove("complete");
  boardElement.style.setProperty("--board-size", String(size));
  bestElement.textContent = bestTime === null ? "—" : formatTime(bestTime);
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
openMenuButton.addEventListener("click", () => menuDialog.showModal());
closeMenuButton.addEventListener("click", () => menuDialog.close());
menuDialog.addEventListener("click", (event) => {
  if (event.target === menuDialog) menuDialog.close();
});
boardSizeSelect.addEventListener("change", () => {
  size = Number(boardSizeSelect.value);
  bestTime = loadBest();
  try {
    localStorage.setItem("signalverket-size", String(size));
  } catch {
    // Settings remain available for the current session.
  }
  menuDialog.close();
  newGame();
});
animationsToggle.addEventListener("change", () => {
  document.documentElement.classList.toggle("no-animations", !animationsToggle.checked);
  try {
    localStorage.setItem("signalverket-animations", String(animationsToggle.checked));
  } catch {
    // Settings remain available for the current session.
  }
});
resetBestButton.addEventListener("click", () => {
  bestTime = null;
  bestElement.textContent = "—";
  try {
    localStorage.removeItem(`signalverket-best-${size}`);
  } catch {
    // The visible record is still reset for the current session.
  }
});
newGame();
