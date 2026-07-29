import {
  connectedCells,
  generateSolvedBoard,
  isSolved,
  rotate,
  rotationsToSolution,
  scrambleBoard
} from "./gameLogic.js";

const translations = {
  nb: {
    gameStatus: "Spillstatus", time: "Tid", moves: "Trekk", powered: "Aktive", record: "Rekord",
    signalGrid: "Signalnett", newGrid: "Nytt nett", menu: "Meny", boardSize: "Brettstørrelse",
    easy: "5 × 5 – lett", normal: "6 × 6 – normal", hard: "7 × 7 – vanskelig",
    language: "Språk", animations: "Animasjoner", scoreboard: "Poengtavle",
    resetScores: "Nullstill poengtavle", aboutTitle: "Om Signalverket",
    aboutText: "Et neonfarget logikkspill laget av Johan Slåttavik. Koble energikilden til hele nettet ved å rotere forbindelsene.",
    instruction: "Koble energikilden til hele nettet.", complete: (time, moves) => `Nettet er stabilt! Fullført på ${time} med ${moves} trekk.`,
    tile: (number, active) => `Rute ${number}${active ? ", aktiv" : ""}`,
    hallOfSignals: "Hall of Signals", roundTime: "Rundetid", yourName: "Ditt navn",
    save: "Lagre", close: "Lukk", anonymous: "Ukjent operatør", emptyScores: "Ingen registrerte tider ennå.",
    openMenu: "Åpne meny", closeMenu: "Lukk meny", enterFullscreen: "Gå til fullskjerm",
    exitFullscreen: "Avslutt fullskjerm", fullscreenHint: "Trykk Esc for å avslutte fullskjerm.",
    settings: "Innstillinger", closeSettings: "Lukk innstillinger", theme: "Energitema",
    themeAuto: "Automatisk etter nivå", themeSolar: "Gul høyspenning", themePlasma: "Rosa signalenergi",
    themeQuantum: "Blå lynstrøm", autoSave: "Lagre pågående brett automatisk",
    saveNote: "Ett pågående brett lagres lokalt på denne enheten.", saveGame: "Lagre dette brettet nå",
    continueGame: "Fortsett lagret brett", saved: "Brettet er lagret.",
    aboutAndHow: "Om og slik spiller du", closeAbout: "Lukk om-delen",
    gameIntro: "Signalverket er et rolig logikkspill. Det finnes alltid en løsning, og du kan bruke så lang tid du vil.",
    guideOne: "Energien starter i øverste venstre hjørne. Målet er å få energien fram til alle rutene.",
    guideTwo: "Trykk på en rute for å rotere den. Linjene må møte hverandre for at energien skal flyte videre.",
    guideThree: "En lysende rute har energi. Signalpærene viser endene på strømnettet. Få alle rutene og pærene til å lyse.",
    guideFour: "Når runden er ferdig, lagres tiden automatisk på profilen din. Du får også XP og bygger operatørnivå.",
    guideSave: "Åpne Meny → Innstillinger for å lagre brettet nå eller slå på automatisk lagring. Spillet lagrer ett pågående brett på denne enheten.",
    guideLoad: "For å laste det inn igjen åpner du Meny og velger Fortsett lagret brett. Valget vises når et lagret brett finnes.",
    controls: "Kontroller", clickTap: "Klikk eller trykk", clickTapHelp: "Roter ruten mot høyre.",
    rightClick: "Høyreklikk", rightClickHelp: "Roter ruten mot venstre.", arrowKeys: "Piltaster",
    arrowKeysHelp: "Flytt markeringen rundt på brettet.", enterSpace: "Enter eller mellomrom",
    enterSpaceHelp: "Roter den markerte ruten.", escHelp: "Gå ut av fullskjerm eller lukk en åpen meny.",
    menuControl: "Menyen", menuHelp: "Bytt nivå, språk, tema og andre innstillinger.",
    aboutCredit: "Signalverket er laget av Johan Slåttavik. Spillet lagrer innstillinger, poengtavle og ett pågående brett lokalt på enheten.",
    startTagline: "Koble nettet, slå tiden og bygg operatørnivået ditt.", chooseName: "Skriv inn navn eller nick",
    nameOrNick: "Navn eller nick", start: "Start", chooseDifficulty: "Velg vanskelighetsgrad",
    closeDifficulty: "Lukk vanskelighetsvalg", difficultyEasy: "Lett", difficultyNormal: "Normal",
    difficultyHard: "Vanskelig", easyDetail: "5 × 5 · rolig start", normalDetail: "6 × 6 · balansert",
    hardDetail: "7 × 7 · full utfordring", levelScores: "Beste tider på dette nivået",
    operatorScores: "Samlet operatørtavle", completedBoards: (count) => `${count} brett`,
    playerLevel: (level, xp, next) => `Operatørnivå ${level} · ${xp}/${next} XP`,
    welcomePlayer: (name) => `Operatør: ${name}`, changePlayer: "Bytt spiller",
    rewardTitle5: "Ytterlinjen svarer",
    rewardText5: "Strømmen når dalen igjen. Ett etter ett tennes husene langs fjorden, og fra den nordlige stasjonen kommer et signal som har vært borte siden stormnatten.",
    rewardAlt5: "Den gule ytterstasjonen sender strøm gjennom en nordlig dal.",
    rewardTitle6: "Stillheten brytes",
    rewardText6: "De rosa signallinjene våkner over fjorden. Meldinger som har ventet i mørket, finner endelig veien hjem.",
    rewardAlt6: "Rosa signallinjer knytter sammen stasjoner og byer rundt en fjord.",
    rewardTitle7: "Hovedverket våkner",
    rewardText7: "Den blå strømmen når verkets øverste tårn. Stormen slipper taket et øyeblikk — lenge nok til at hele nordnettet svarer.",
    rewardAlt7: "Det blå hovedverket lyser opp under en elektrisk storm."
  },
  en: {
    gameStatus: "Game status", time: "Time", moves: "Moves", powered: "Powered", record: "Record",
    signalGrid: "Signal grid", newGrid: "New grid", menu: "Menu", boardSize: "Board size",
    easy: "5 × 5 – easy", normal: "6 × 6 – normal", hard: "7 × 7 – hard",
    language: "Language", animations: "Animations", scoreboard: "Scoreboard",
    resetScores: "Reset scoreboard", aboutTitle: "About Signalverket",
    aboutText: "A neon logic game created by Johan Slåttavik. Rotate the connections to power the entire grid.",
    instruction: "Connect the energy source to the entire grid.", complete: (time, moves) => `Grid stabilized! Completed in ${time} with ${moves} moves.`,
    tile: (number, active) => `Tile ${number}${active ? ", powered" : ""}`,
    hallOfSignals: "Hall of Signals", roundTime: "Round time", yourName: "Your name",
    save: "Save", close: "Close", anonymous: "Unknown operator", emptyScores: "No recorded times yet.",
    openMenu: "Open menu", closeMenu: "Close menu", enterFullscreen: "Enter fullscreen",
    exitFullscreen: "Exit fullscreen", fullscreenHint: "Press Esc to exit fullscreen.",
    settings: "Settings", closeSettings: "Close settings", theme: "Energy theme",
    themeAuto: "Automatic by level", themeSolar: "Yellow high voltage", themePlasma: "Pink signal energy",
    themeQuantum: "Blue lightning current", autoSave: "Automatically save current grid",
    saveNote: "One current grid is stored locally on this device.", saveGame: "Save this grid now",
    continueGame: "Continue saved grid", saved: "Grid saved.",
    aboutAndHow: "About and how to play", closeAbout: "Close about section",
    gameIntro: "Signalverket is a calm logic game. There is always a solution, and you can take all the time you need.",
    guideOne: "Energy begins in the top-left corner. Your goal is to bring energy to every tile.",
    guideTwo: "Press a tile to rotate it. The lines must meet for energy to flow onwards.",
    guideThree: "A glowing tile has energy. Signal bulbs mark the ends of the power grid. Make every tile and bulb light up.",
    guideFour: "When the round is complete, the time is saved automatically to your profile. You also earn XP and build your operator level.",
    guideSave: "Open Menu → Settings to save the grid now or enable automatic saving. The game stores one current grid on this device.",
    guideLoad: "To load it again, open Menu and select Continue saved grid. This option appears when a saved grid exists.",
    controls: "Controls", clickTap: "Click or tap", clickTapHelp: "Rotate the tile clockwise.",
    rightClick: "Right-click", rightClickHelp: "Rotate the tile counter-clockwise.", arrowKeys: "Arrow keys",
    arrowKeysHelp: "Move the selection around the grid.", enterSpace: "Enter or Space",
    enterSpaceHelp: "Rotate the selected tile.", escHelp: "Exit fullscreen or close an open menu.",
    menuControl: "Menu", menuHelp: "Change level, language, theme, and other settings.",
    aboutCredit: "Signalverket was created by Johan Slåttavik. The game stores settings, scores, and one current grid locally on this device.",
    startTagline: "Connect the grid, beat the clock, and build your operator level.", chooseName: "Enter your name or nickname",
    nameOrNick: "Name or nickname", start: "Start", chooseDifficulty: "Choose difficulty",
    closeDifficulty: "Close difficulty selection", difficultyEasy: "Easy", difficultyNormal: "Normal",
    difficultyHard: "Hard", easyDetail: "5 × 5 · gentle start", normalDetail: "6 × 6 · balanced",
    hardDetail: "7 × 7 · full challenge", levelScores: "Best times on this level",
    operatorScores: "Overall operator board", completedBoards: (count) => `${count} boards`,
    playerLevel: (level, xp, next) => `Operator level ${level} · ${xp}/${next} XP`,
    welcomePlayer: (name) => `Operator: ${name}`, changePlayer: "Change player",
    rewardTitle5: "The outer line answers",
    rewardText5: "Power reaches the valley again. One by one, the houses along the fjord light up, and the northern station sends a signal unheard since the night of the storm.",
    rewardAlt5: "The yellow outer station sends power through a northern valley.",
    rewardTitle6: "The silence breaks",
    rewardText6: "Pink signal lines awaken above the fjord. Messages that waited in the darkness finally find their way home.",
    rewardAlt6: "Pink signal lines connect stations and towns around a fjord.",
    rewardTitle7: "The main station awakens",
    rewardText7: "Blue current reaches the station’s highest tower. The storm releases its grip for a moment — long enough for the entire northern grid to answer.",
    rewardAlt7: "The blue main station lights up beneath an electrical storm."
  }
};

const $ = (selector) => document.querySelector(selector);
const boardElement = $("#board");
const timeElement = $("#time");
const movesElement = $("#moves");
const poweredElement = $("#powered");
const bestElement = $("#best");
const statusElement = $("#status");
const newGameButton = $("#new-game");
const menuDialog = $("#menu-dialog");
const scoreDialog = $("#score-dialog");
const settingsDialog = $("#settings-dialog");
const aboutDialog = $("#about-dialog");
const startDialog = $("#start-dialog");
const difficultyDialog = $("#difficulty-dialog");
const boardSizeSelect = $("#board-size");
const languageSelect = $("#language");
const animationsToggle = $("#animations");
const roundSummary = $("#round-summary");
const leaderboardElement = $("#leaderboard");
const operatorLeaderboardElement = $("#operator-leaderboard");
const fullscreenButton = $("#toggle-fullscreen");
const fullscreenHint = $("#fullscreen-hint");
const themeSelect = $("#theme");
const autoSaveToggle = $("#auto-save");

let size = 6;
let language = "nb";
let board = [];
let solvedBoard = [];
let buttons = [];
let moves = 0;
let startedAt = 0;
let timer = null;
let selected = 0;
let complete = false;
let elapsed = 0;
let hintTimer = null;
let themeChoice = readSetting("signalverket-theme") || "auto";
let autoSaveEnabled = readSetting("signalverket-auto-save") !== "false";
let currentPlayer = "";
let lastXpAward = 0;

function readSetting(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function writeSetting(key, value) {
  try { localStorage.setItem(key, value); } catch { /* Current session still works. */ }
}

function removeSetting(key) {
  try { localStorage.removeItem(key); } catch { /* Current session still works. */ }
}

const savedSize = Number(readSetting("signalverket-size"));
if ([5, 6, 7].includes(savedSize)) size = savedSize;
language = readSetting("signalverket-language") === "en" ? "en" : "nb";
const animationsEnabled = readSetting("signalverket-animations") !== "false";

function scoresKey() {
  return `signalverket-scores-${size}`;
}

function loadScores() {
  try {
    const scores = JSON.parse(localStorage.getItem(scoresKey()) || "[]");
    return Array.isArray(scores) ? scores.filter((score) => Number.isFinite(score.time)).slice(0, 10) : [];
  } catch {
    return [];
  }
}

function saveScores(scores) {
  writeSetting(scoresKey(), JSON.stringify(scores.slice(0, 10)));
}

function loadProfiles() {
  try {
    const profiles = JSON.parse(localStorage.getItem("signalverket-profiles") || "[]");
    return Array.isArray(profiles) ? profiles : [];
  } catch {
    return [];
  }
}

function saveProfiles(profiles) {
  writeSetting("signalverket-profiles", JSON.stringify(profiles));
}

function profileLevel(xp) {
  return Math.floor(xp / 300) + 1;
}

function xpForRound() {
  const base = { 5: 50, 6: 100, 7: 175 }[size];
  const targetSeconds = { 5: 150, 6: 300, 7: 480 }[size];
  const speedBonus = Math.max(0, Math.round((targetSeconds - elapsed / 1000) / 10));
  return base + Math.min(speedBonus, 50);
}

function recordCompletedRound() {
  lastXpAward = xpForRound();
  const scores = loadScores();
  scores.push({
    name: currentPlayer,
    time: elapsed,
    moves,
    xp: lastXpAward,
    date: new Date().toISOString()
  });
  scores.sort((a, b) => a.time - b.time || a.moves - b.moves);
  saveScores(scores);

  const profiles = loadProfiles();
  const key = currentPlayer.trim().toLocaleLowerCase();
  let profile = profiles.find((item) => item.key === key);
  if (!profile) {
    profile = { key, name: currentPlayer, xp: 0, completed: 0 };
    profiles.push(profile);
  }
  profile.name = currentPlayer;
  profile.xp += lastXpAward;
  profile.completed += 1;
  profile.lastPlayed = new Date().toISOString();
  saveProfiles(profiles);
}

function bestTime() {
  return loadScores()[0]?.time ?? null;
}

function t(key, ...values) {
  const value = translations[language][key];
  return typeof value === "function" ? value(...values) : value;
}

function applyLanguage() {
  document.documentElement.lang = language;
  document.title = language === "nb" ? "Signalverket" : "Signalverket — Energy Grid";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAria));
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
  $("#open-menu").setAttribute("aria-label", t("openMenu"));
  $("#close-menu").setAttribute("aria-label", t("closeMenu"));
  $("#close-settings").setAttribute("aria-label", t("closeSettings"));
  $("#close-about").setAttribute("aria-label", t("closeAbout"));
  $("#close-difficulty").setAttribute("aria-label", t("closeDifficulty"));
  $("#current-player-label").textContent = currentPlayer ? t("welcomePlayer", currentPlayer) : "";
  updateFullscreenButton();
  statusElement.textContent = complete ? t("complete", formatTime(elapsed), moves) : t("instruction");
  render();
  renderScores();
  if (!$("#reward-card").hidden) renderReward();
}

function activeTheme() {
  if (["solar", "plasma", "quantum"].includes(themeChoice)) return themeChoice;
  return size === 5 ? "solar" : size === 7 ? "quantum" : "plasma";
}

function applyTheme() {
  document.body.dataset.theme = activeTheme();
}

function loadSavedGame() {
  try {
    const saved = JSON.parse(localStorage.getItem("signalverket-saved-game") || "null");
    if (!saved || ![5, 6, 7].includes(saved.size)) return null;
    if (!Array.isArray(saved.board) || !Array.isArray(saved.solvedBoard)) return null;
    if (saved.board.length !== saved.size ** 2 || saved.solvedBoard.length !== saved.board.length) return null;
    rotationsToSolution(saved.board, saved.solvedBoard);
    return saved;
  } catch {
    return null;
  }
}

function updateContinueButton() {
  $("#continue-game").hidden = loadSavedGame() === null;
}

function saveCurrentGame(showConfirmation = false) {
  if (complete || !board.length) return;
  const currentElapsed = startedAt ? performance.now() - startedAt : elapsed;
  writeSetting("signalverket-saved-game", JSON.stringify({
    size, board, solvedBoard, moves, elapsed: currentElapsed, player: currentPlayer
  }));
  updateContinueButton();
  if (showConfirmation) {
    statusElement.textContent = t("saved");
    setTimeout(() => {
      if (!complete) statusElement.textContent = t("instruction");
    }, 1800);
  }
}

function continueSavedGame() {
  const saved = loadSavedGame();
  if (!saved) return;
  clearInterval(timer);
  size = saved.size;
  if (saved.player) currentPlayer = saved.player;
  board = saved.board;
  solvedBoard = saved.solvedBoard;
  moves = saved.moves || 0;
  elapsed = saved.elapsed || 0;
  selected = 0;
  complete = false;
  startedAt = performance.now() - elapsed;
  boardSizeSelect.value = String(size);
  movesElement.textContent = String(moves);
  timeElement.textContent = formatTime(elapsed);
  statusElement.textContent = t("instruction");
  statusElement.classList.remove("success");
  boardElement.classList.remove("complete");
  boardElement.style.setProperty("--board-size", String(size));
  applyTheme();
  createBoard();
  renderScores();
  render();
  timer = setInterval(() => {
    timeElement.textContent = formatTime(performance.now() - startedAt);
    if (autoSaveEnabled) saveCurrentGame();
  }, 1000);
}

function updateFullscreenButton() {
  const active = Boolean(document.fullscreenElement);
  fullscreenButton.textContent = active ? "×" : "⛶";
  fullscreenButton.setAttribute("aria-label", t(active ? "exitFullscreen" : "enterFullscreen"));
  fullscreenButton.title = t(active ? "exitFullscreen" : "enterFullscreen");
}

function showFullscreenHint() {
  clearTimeout(hintTimer);
  fullscreenHint.textContent = t("fullscreenHint");
  fullscreenHint.classList.add("visible");
  hintTimer = setTimeout(() => fullscreenHint.classList.remove("visible"), 4500);
}

function pipeSvg(mask, isSource = false) {
  const lines = [
    mask & 1 ? '<path d="M50 50V0"/>' : "",
    mask & 2 ? '<path d="M50 50H100"/>' : "",
    mask & 4 ? '<path d="M50 50V100"/>' : "",
    mask & 8 ? '<path d="M50 50H0"/>' : ""
  ].join("");
  const connectionCount = [1, 2, 4, 8].filter((bit) => mask & bit).length;
  let node = '<circle cx="50" cy="50" r="10"/>';
  if (connectionCount === 1 && !isSource) {
    node = `
      <g class="signal-bulb">
        <path class="bulb-ray" d="M50 23V16M69 31L74 26M77 50H84M31 31L26 26M23 50H16"/>
        <circle class="bulb-glass" cx="50" cy="50" r="17"/>
        <path class="bulb-filament" d="M42 48L47 54L52 46L58 52"/>
        <path class="bulb-filament" d="M43 64H57M46 70H54"/>
      </g>`;
  } else if (isSource) {
    node = `
      <circle class="generator-ring" cx="50" cy="50" r="21"/>
      <path class="generator-bolt" d="M54 26L39 52H49L45 74L63 45H53Z"/>`;
  }
  return `<svg viewBox="0 0 100 100" aria-hidden="true">${lines}${node}</svg>`;
}

function formatTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hundredths = Math.floor((milliseconds % 1000) / 10);
  return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}.${String(hundredths).padStart(2, "0")}`;
}

function render() {
  const powered = connectedCells(board, size);
  poweredElement.textContent = `${powered.size}/${board.length}`;
  buttons.forEach((button, index) => {
    button.innerHTML = pipeSvg(board[index], index === 0);
    button.classList.toggle("powered", powered.has(index));
    button.classList.toggle("selected", selected === index);
    button.setAttribute("aria-label", t("tile", index + 1, powered.has(index)));
  });
}

function renderScores() {
  leaderboardElement.replaceChildren();
  const scores = loadScores();
  if (!scores.length) {
    const item = document.createElement("li");
    item.innerHTML = `<span class="score-name">${t("emptyScores")}</span><span></span>`;
    leaderboardElement.append(item);
  } else {
    scores.forEach((score) => {
      const item = document.createElement("li");
      const name = document.createElement("span");
      const time = document.createElement("span");
      name.className = "score-name";
      time.className = "score-time";
      name.textContent = score.name;
      time.textContent = formatTime(score.time);
      item.append(name, time);
      leaderboardElement.append(item);
    });
  }
  const best = bestTime();
  bestElement.textContent = best === null ? "—" : formatTime(best);

  operatorLeaderboardElement.replaceChildren();
  const profiles = loadProfiles().sort((a, b) => b.xp - a.xp || b.completed - a.completed);
  if (!profiles.length) {
    const item = document.createElement("li");
    item.innerHTML = `<span class="score-name">${t("emptyScores")}</span><span></span>`;
    operatorLeaderboardElement.append(item);
  } else {
    profiles.slice(0, 10).forEach((profile) => {
      const item = document.createElement("li");
      const name = document.createElement("span");
      const result = document.createElement("span");
      name.className = "score-name";
      result.className = "score-time";
      name.textContent = `${profile.name} · Lv.${profileLevel(profile.xp)}`;
      result.textContent = t("completedBoards", profile.completed);
      item.append(name, result);
      operatorLeaderboardElement.append(item);
    });
  }
}

function renderReward() {
  const rewardImages = {
    5: "assets/rewards/yellow-outpost-restored.png",
    6: "assets/rewards/pink-network-restored.png",
    7: "assets/rewards/blue-mainframe-restored.png"
  };
  $("#reward-image").src = rewardImages[size];
  $("#reward-image").alt = t(`rewardAlt${size}`);
  $("#reward-title").textContent = t(`rewardTitle${size}`);
  $("#reward-text").textContent = t(`rewardText${size}`);
}

function openScores(withRound = false) {
  roundSummary.hidden = !withRound;
  $("#player-level-summary").hidden = !withRound;
  $("#reward-card").hidden = !withRound;
  if (withRound) {
    renderReward();
    $("#round-time").textContent = formatTime(elapsed);
    $("#round-moves").textContent = String(moves);
    $("#round-xp").textContent = `+${lastXpAward}`;
    const profile = loadProfiles().find((item) => item.key === currentPlayer.trim().toLocaleLowerCase());
    const xp = profile?.xp || 0;
    const withinLevel = xp % 300;
    $("#player-level-text").textContent = t("playerLevel", profileLevel(xp), withinLevel, 300);
    $("#profile-progress-bar").style.setProperty("--progress", `${(withinLevel / 300) * 100}%`);
  }
  renderScores();
  if (!scoreDialog.open) scoreDialog.showModal();
}

function finish() {
  complete = true;
  clearInterval(timer);
  elapsed = performance.now() - startedAt;
  timeElement.textContent = formatTime(elapsed);
  boardElement.classList.add("complete");
  statusElement.textContent = t("complete", formatTime(elapsed), moves);
  statusElement.classList.add("success");
  removeSetting("signalverket-saved-game");
  updateContinueButton();
  recordCompletedRound();
  openScores(true);
}

function turn(index, amount = 1) {
  if (complete) return;
  board[index] = rotate(board[index], amount);
  moves += 1;
  movesElement.textContent = String(moves);
  render();
  if (isSolved(board, size)) finish();
  else if (autoSaveEnabled) saveCurrentGame();
}

function createBoard() {
  boardElement.replaceChildren();
  buttons = board.map((_, index) => {
    const button = document.createElement("button");
    button.className = "tile";
    button.type = "button";
    button.addEventListener("click", () => { selected = index; turn(index); });
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
  board = scrambleBoard(solvedBoard, Math.random, size);
  // Runtime invariant: a generated round is rejected if any tile lost its route back to the solution.
  rotationsToSolution(board, solvedBoard);
  moves = 0;
  elapsed = 0;
  selected = 0;
  complete = false;
  startedAt = performance.now();
  movesElement.textContent = "0";
  timeElement.textContent = "00:00.00";
  statusElement.textContent = t("instruction");
  statusElement.classList.remove("success");
  boardElement.classList.remove("complete");
  boardElement.style.setProperty("--board-size", String(size));
  applyTheme();
  createBoard();
  renderScores();
  render();
  timer = setInterval(() => {
    timeElement.textContent = formatTime(performance.now() - startedAt);
  }, 50);
}

document.addEventListener("keydown", (event) => {
  if (document.querySelector("dialog[open]")) return;
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

function openDifficultySelection() {
  $("#close-difficulty").hidden = board.length === 0;
  if (!difficultyDialog.open) difficultyDialog.showModal();
}

newGameButton.addEventListener("click", openDifficultySelection);
fullscreenButton.addEventListener("click", async () => {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
      showFullscreenHint();
    }
  } catch {
    // Fullscreen may be restricted by the host; the game remains playable.
  }
});
document.addEventListener("fullscreenchange", updateFullscreenButton);
$("#open-menu").addEventListener("click", () => menuDialog.showModal());
$("#close-menu").addEventListener("click", () => menuDialog.close());
menuDialog.addEventListener("click", (event) => {
  if (event.target === menuDialog) menuDialog.close();
});
boardSizeSelect.addEventListener("change", () => {
  size = Number(boardSizeSelect.value);
  writeSetting("signalverket-size", String(size));
  menuDialog.close();
  newGame();
});
languageSelect.addEventListener("change", () => {
  language = languageSelect.value;
  writeSetting("signalverket-language", language);
  applyLanguage();
});
animationsToggle.addEventListener("change", () => {
  document.documentElement.classList.toggle("no-animations", !animationsToggle.checked);
  writeSetting("signalverket-animations", String(animationsToggle.checked));
});
$("#show-scores").addEventListener("click", () => {
  menuDialog.close();
  openScores(false);
});
$("#open-settings").addEventListener("click", () => {
  menuDialog.close();
  settingsDialog.showModal();
});
$("#open-about").addEventListener("click", () => {
  menuDialog.close();
  aboutDialog.showModal();
});
$("#close-about").addEventListener("click", () => aboutDialog.close());
aboutDialog.addEventListener("click", (event) => {
  if (event.target === aboutDialog) aboutDialog.close();
});
$("#close-settings").addEventListener("click", () => settingsDialog.close());
settingsDialog.addEventListener("click", (event) => {
  if (event.target === settingsDialog) settingsDialog.close();
});
themeSelect.addEventListener("change", () => {
  themeChoice = themeSelect.value;
  writeSetting("signalverket-theme", themeChoice);
  applyTheme();
});
autoSaveToggle.addEventListener("change", () => {
  autoSaveEnabled = autoSaveToggle.checked;
  writeSetting("signalverket-auto-save", String(autoSaveEnabled));
  if (autoSaveEnabled) saveCurrentGame();
});
$("#save-game").addEventListener("click", () => {
  saveCurrentGame(true);
  settingsDialog.close();
});
$("#continue-game").addEventListener("click", () => {
  menuDialog.close();
  continueSavedGame();
});
$("#change-player").addEventListener("click", () => {
  menuDialog.close();
  $("#start-name").value = currentPlayer;
  startDialog.showModal();
});
$("#reset-best").addEventListener("click", () => {
  [5, 6, 7].forEach((boardSize) => removeSetting(`signalverket-scores-${boardSize}`));
  removeSetting("signalverket-profiles");
  renderScores();
});
$("#close-scores").addEventListener("click", () => scoreDialog.close());
$("#score-new-game").addEventListener("click", () => {
  scoreDialog.close();
  openDifficultySelection();
});
scoreDialog.addEventListener("click", (event) => {
  if (event.target === scoreDialog) scoreDialog.close();
});

$("#start-form").addEventListener("submit", (event) => {
  event.preventDefault();
  currentPlayer = $("#start-name").value.trim();
  if (!currentPlayer) return;
  writeSetting("signalverket-last-player", currentPlayer);
  $("#current-player-label").textContent = t("welcomePlayer", currentPlayer);
  startDialog.close();
  openDifficultySelection();
});
startDialog.addEventListener("cancel", (event) => event.preventDefault());
document.querySelectorAll(".difficulty-card").forEach((button) => {
  button.addEventListener("click", () => {
    size = Number(button.dataset.size);
    boardSizeSelect.value = String(size);
    writeSetting("signalverket-size", String(size));
    difficultyDialog.close();
    newGame();
  });
});
$("#close-difficulty").addEventListener("click", () => {
  if (board.length) difficultyDialog.close();
});
difficultyDialog.addEventListener("cancel", (event) => {
  if (!board.length) event.preventDefault();
});

boardSizeSelect.value = String(size);
languageSelect.value = language;
animationsToggle.checked = animationsEnabled;
themeSelect.value = themeChoice;
autoSaveToggle.checked = autoSaveEnabled;
document.documentElement.classList.toggle("no-animations", !animationsEnabled);
applyLanguage();
updateContinueButton();
$("#start-name").value = readSetting("signalverket-last-player") || "";
startDialog.showModal();
