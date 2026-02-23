/**
 * Jogo da Velha - MDWL.Games
 * Modos: 1 Jogador (vs CPU) e 2 Jogadores
 */

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const LABELS = { X: "Jogador 1", O: "Jogador 2" };

let board = Array(9).fill("");
let player = "X";
let gameStarted = false;
let singlePlayer = false;
let winningLine = null;

const gameTicTacToe = document.querySelector(".game-ticTacToe");
const gameGrid = document.getElementById("gameGrid");
const gameItems = document.querySelectorAll(".game-item");
const startBtn = document.getElementById("startGame");
const ticTurn = document.getElementById("ticTurn");
const playerMode = document.getElementById("playerMode");

function getMode() {
  const active = playerMode?.querySelector(".player-options.ativo");
  return active?.getAttribute("data-mode") === "1" ? 1 : 2;
}

function setTurnLabel() {
  if (!ticTurn) return;
  if (!gameStarted) {
    ticTurn.textContent = "Vez de: —";
    return;
  }
  const name = singlePlayer && player === "O" ? "Computador" : LABELS[player];
  ticTurn.textContent = `Vez de: ${name}`;
}

function checkWinner() {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  if (board.every((cell) => cell !== "")) return { winner: "empate", line: null };
  return null;
}

function renderCell(index) {
  const item = gameItems[index];
  if (!item) return;
  const xEl = item.querySelector(".X");
  const oEl = item.querySelector(".O");
  const value = board[index];
  xEl.style.display = value === "X" ? "block" : "none";
  oEl.style.display = value === "O" ? "block" : "none";
  item.classList.toggle("win-cell", winningLine !== null && winningLine.includes(index));
}

function renderBoard() {
  gameItems.forEach((_, i) => renderCell(i));
}

function resetGame() {
  board = Array(9).fill("");
  player = "X";
  winningLine = null;
  gameStarted = false;
  gameTicTacToe?.classList.add("disabled");
  setTurnLabel();
  renderBoard();
}

function startGame() {
  singlePlayer = getMode() === 1;
  board = Array(9).fill("");
  player = "X";
  winningLine = null;
  gameStarted = true;
  gameTicTacToe?.classList.remove("disabled");
  setTurnLabel();
  renderBoard();
}

function showModal(title, message) {
  const modal = document.getElementById("ticModal");
  const titleEl = document.getElementById("ticModalTitle");
  const msgEl = document.getElementById("ticModalMessage");
  const btn = document.getElementById("ticModalBtn");
  if (!modal || !msgEl) return;
  if (titleEl) titleEl.textContent = title;
  msgEl.textContent = message;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  const overlay = modal.querySelector(".tic-modal-overlay");
  const close = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  };
  const playAgain = () => {
    close();
    startGame();
  };
  overlay.onclick = close;
  btn.onclick = playAgain;
}

function endGame(result) {
  gameStarted = false;
  gameTicTacToe?.classList.add("disabled");
  if (result.winner === "empate") {
    showModal("Empate!", "Deu velha! Ninguém venceu.");
  } else {
    winningLine = result.line;
    renderBoard();
    const name = singlePlayer && result.winner === "O" ? "Computador" : LABELS[result.winner];
    setTimeout(() => showModal("Vitória!", `${name} venceu!`), 300);
  }
  setTurnLabel();
}

function makeMove(index) {
  if (!gameStarted || board[index] !== "") return;
  board[index] = player;
  renderCell(index);
  const result = checkWinner();
  if (result) {
    endGame(result);
    return;
  }
  player = player === "X" ? "O" : "X";
  setTurnLabel();
  if (singlePlayer && player === "O") {
    setTimeout(cpuMove, 400);
  }
}

function cpuMove() {
  const empty = board.map((v, i) => (v === "" ? i : -1)).filter((i) => i >= 0);
  if (empty.length === 0) return;
  const index = empty[Math.floor(Math.random() * empty.length)];
  makeMove(index);
}

function onCellClick(e) {
  if (gameTicTacToe?.classList.contains("disabled")) return;
  const item = e.currentTarget;
  const index = parseInt(item.getAttribute("data-index"), 10);
  if (Number.isNaN(index) || index < 0 || index > 8) return;
  if (singlePlayer && player === "O") return;
  makeMove(index);
}

// Modo de jogo (1 vs 2 jogadores)
playerMode?.querySelectorAll(".player-options").forEach((opt) => {
  opt.addEventListener("click", () => {
    if (gameStarted) return;
    playerMode.querySelectorAll(".player-options").forEach((o) => o.classList.remove("ativo"));
    opt.classList.add("ativo");
    playerMode.classList.toggle("ativo", opt.getAttribute("data-mode") === "2");
  });
});

startBtn?.addEventListener("click", () => {
  if (gameStarted) startGame();
  else startGame();
});

gameItems.forEach((item) => {
  item.addEventListener("click", onCellClick);
});

setTurnLabel();
