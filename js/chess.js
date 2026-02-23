/**
 * Lógica do Xadrez - MDWL.Games
 * Tabuleiro: data-index "8a" a "1h" (linha 8 no topo, 1 embaixo; colunas a-h)
 * Brancas = fa-regular (linhas 1-2), Pretas = fa-solid (linhas 7-8)
 */

const ROWS = [8, 7, 6, 5, 4, 3, 2, 1];
const COLS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const PIECE_ICONS = {
  white: {
    pawn: 'fa-regular fa-chess-pawn',
    rook: 'fa-regular fa-chess-rook',
    knight: 'fa-regular fa-chess-knight',
    bishop: 'fa-regular fa-chess-bishop',
    queen: 'fa-regular fa-chess-queen',
    king: 'fa-regular fa-chess-king'
  },
  black: {
    pawn: 'fa-solid fa-chess-pawn',
    rook: 'fa-solid fa-chess-rook',
    knight: 'fa-solid fa-chess-knight',
    bishop: 'fa-solid fa-chess-bishop',
    queen: 'fa-solid fa-chess-queen',
    king: 'fa-solid fa-chess-king'
  }
};

function posKey(row, col) {
  return `${row}${COLS[col]}`;
}

function parsePos(key) {
  const row = parseInt(key[0], 10);
  const col = COLS.indexOf(key[1]);
  return { row, col };
}

/** Estado do jogo */
let state = {
  board: {},       // posKey -> { type, color }
  turn: 'white',
  selected: null,  // posKey da peça selecionada
  lastMove: null,  // { from, to } para en passant / roque depois
  kings: { white: '1e', black: '8e' }
};

function buildInitialBoard() {
  const b = {};
  const back = (row, color) => {
    b[posKey(row, 0)] = { type: 'rook', color };
    b[posKey(row, 1)] = { type: 'knight', color };
    b[posKey(row, 2)] = { type: 'bishop', color };
    b[posKey(row, 3)] = { type: 'queen', color };
    b[posKey(row, 4)] = { type: 'king', color };
    b[posKey(row, 5)] = { type: 'bishop', color };
    b[posKey(row, 6)] = { type: 'knight', color };
    b[posKey(row, 7)] = { type: 'rook', color };
  };
  for (let c = 0; c < 8; c++) {
    b[posKey(7, c)] = { type: 'pawn', color: 'black' };
    b[posKey(2, c)] = { type: 'pawn', color: 'white' };
  }
  back(8, 'black');
  back(1, 'white');
  return b;
}

function getBoard() {
  return state.board;
}

function getPieceAt(posKey) {
  return state.board[posKey] || null;
}

function getValidMoves(fromKey) {
  const piece = state.board[fromKey];
  if (!piece) return [];
  const { row, col } = parsePos(fromKey);
  const moves = [];
  const add = (r, c, canCapture = true) => {
    if (r < 1 || r > 8 || c < 0 || c > 7) return;
    const key = posKey(r, c);
    const target = state.board[key];
    if (target) {
      if (canCapture && target.color !== piece.color) moves.push(key);
      return 'block';
    }
    moves.push(key);
  };

  switch (piece.type) {
    case 'pawn': {
      const dir = piece.color === 'white' ? 1 : -1;
      const startRow = piece.color === 'white' ? 2 : 7;
      const nextRow = row + dir;
      if (nextRow >= 1 && nextRow <= 8) {
        if (!state.board[posKey(nextRow, col)]) {
          moves.push(posKey(nextRow, col));
          if (row === startRow) {
            const twoRow = row + 2 * dir;
            if (!state.board[posKey(twoRow, col)]) moves.push(posKey(twoRow, col));
          }
        }
        if (col > 0) add(nextRow, col - 1);
        if (col < 7) add(nextRow, col + 1);
      }
      break;
    }
    case 'rook': {
      for (let r = row + 1; r <= 8; r++) { if (add(r, col) === 'block') break; }
      for (let r = row - 1; r >= 1; r--) { if (add(r, col) === 'block') break; }
      for (let c = col + 1; c <= 7; c++) { if (add(row, c) === 'block') break; }
      for (let c = col - 1; c >= 0; c--) { if (add(row, c) === 'block') break; }
      break;
    }
    case 'knight': {
      const jumps = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
      jumps.forEach(([dr, dc]) => add(row + dr, col + dc));
      break;
    }
    case 'bishop': {
      for (let d = 1; row + d <= 8 && col + d <= 7; d++) { if (add(row + d, col + d) === 'block') break; }
      for (let d = 1; row + d <= 8 && col - d >= 0; d++) { if (add(row + d, col - d) === 'block') break; }
      for (let d = 1; row - d >= 1 && col + d <= 7; d++) { if (add(row - d, col + d) === 'block') break; }
      for (let d = 1; row - d >= 1 && col - d >= 0; d++) { if (add(row - d, col - d) === 'block') break; }
      break;
    }
    case 'queen': {
      for (let r = row + 1; r <= 8; r++) { if (add(r, col) === 'block') break; }
      for (let r = row - 1; r >= 1; r--) { if (add(r, col) === 'block') break; }
      for (let c = col + 1; c <= 7; c++) { if (add(row, c) === 'block') break; }
      for (let c = col - 1; c >= 0; c--) { if (add(row, c) === 'block') break; }
      for (let d = 1; row + d <= 8 && col + d <= 7; d++) { if (add(row + d, col + d) === 'block') break; }
      for (let d = 1; row + d <= 8 && col - d >= 0; d++) { if (add(row + d, col - d) === 'block') break; }
      for (let d = 1; row - d >= 1 && col + d <= 7; d++) { if (add(row - d, col + d) === 'block') break; }
      for (let d = 1; row - d >= 1 && col - d >= 0; d++) { if (add(row - d, col - d) === 'block') break; }
      break;
    }
    case 'king': {
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++)
          if (dr !== 0 || dc !== 0) add(row + dr, col + dc);
      break;
    }
  }
  return moves;
}

/** Filtra movimentos que deixariam o próprio rei em xeque */
function filterCheckMoves(fromKey, moves) {
  const piece = getPieceAt(fromKey);
  if (!piece) return [];
  const result = [];
  for (const toKey of moves) {
    const snapshot = { ...state.board };
    const captured = state.board[toKey];
    delete state.board[fromKey];
    state.board[toKey] = piece;
    if (piece.type === 'king') state.kings[piece.color] = toKey;
    const inCheck = isKingInCheck(piece.color);
    state.board = snapshot;
    if (piece.type === 'king') state.kings[piece.color] = fromKey;
    if (!inCheck) result.push(toKey);
  }
  return result;
}

function isKingInCheck(color) {
  const kingPos = state.kings[color];
  if (!kingPos) return false;
  const opponent = color === 'white' ? 'black' : 'white';
  for (const key of Object.keys(state.board)) {
    const p = state.board[key];
    if (p.color !== opponent) continue;
    const moves = getValidMoves(key);
    if (moves.includes(kingPos)) return true;
  }
  return false;
}

function hasAnyValidMove(color) {
  for (const key of Object.keys(state.board)) {
    if (state.board[key].color !== color) continue;
    const moves = filterCheckMoves(key, getValidMoves(key));
    if (moves.length > 0) return true;
  }
  return false;
}

function movePiece(fromKey, toKey) {
  const piece = state.board[fromKey];
  if (!piece) return false;
  const valid = getValidMoves(fromKey);
  if (!valid.includes(toKey)) return false;
  const safe = filterCheckMoves(fromKey, valid);
  if (!safe.includes(toKey)) return false;

  state.lastMove = { from: fromKey, to: toKey };
  delete state.board[fromKey];
  state.board[toKey] = piece;

  if (piece.type === 'king') state.kings[piece.color] = toKey;

  // Promoção do peão
  if (piece.type === 'pawn') {
    const row = parsePos(toKey).row;
    if ((piece.color === 'white' && row === 8) || (piece.color === 'black' && row === 1)) {
      state.board[toKey] = { type: 'queen', color: piece.color };
    }
  }

  state.turn = state.turn === 'white' ? 'black' : 'white';
  state.selected = null;
  return true;
}

/** DOM: atualiza uma casa do tabuleiro */
function renderCell(cell, key) {
  const piece = state.board[key];
  cell.classList.remove('selected', 'valid-move');
  cell.innerHTML = '';
  if (piece) {
    const icon = document.createElement('i');
    icon.className = PIECE_ICONS[piece.color][piece.type];
    cell.appendChild(icon);
  }
}

/** Atualiza todo o tabuleiro e destaque de seleção/jogadas válidas */
function renderBoard() {
  const cells = document.querySelectorAll('.chess-board .chess-home');
  cells.forEach((cell) => {
    const key = cell.getAttribute('data-index');
    renderCell(cell, key);
    if (state.selected === key) cell.classList.add('selected');
  });

  if (state.selected) {
    const valid = filterCheckMoves(state.selected, getValidMoves(state.selected));
    valid.forEach((key) => {
      const cell = document.querySelector(`.chess-board .chess-home[data-index="${key}"]`);
      if (cell) cell.classList.add('valid-move');
    });
  }
}

let chessListenersAttached = false;

function attachChessListeners() {
  if (chessListenersAttached) return;
  chessListenersAttached = true;
  const cells = document.querySelectorAll('.chess-board .chess-home');
  cells.forEach((cell) => {
    cell.addEventListener('click', () => {
      const key = cell.getAttribute('data-index');
      const piece = getPieceAt(key);

      if (state.selected) {
        const valid = filterCheckMoves(state.selected, getValidMoves(state.selected));
        if (valid.includes(key)) {
          const moved = movePiece(state.selected, key);
          if (moved) {
            renderBoard();
            const other = state.turn === 'white' ? 'black' : 'white';
            if (isKingInCheck(state.turn)) {
              if (!hasAnyValidMove(state.turn)) {
                const winnerName = other === 'white' ? 'Brancas' : 'Pretas';
                setTimeout(() => showVictoryModal(`Xeque-mate! ${winnerName} vencem.`), 50);
                return;
              }
              console.log('Xeque!');
            }
            updateTurnLabel();
            return;
          }
        }
        state.selected = null;
      }

      if (piece && piece.color === state.turn) {
        state.selected = key;
      }
      renderBoard();
    });
  });
}

function initChess() {
  state.board = buildInitialBoard();
  state.turn = 'white';
  state.selected = null;
  state.lastMove = null;
  state.kings = { white: '1e', black: '8e' };

  attachChessListeners();
  renderBoard();
  updateTurnLabel();
}

function updateTurnLabel() {
  const el = document.getElementById('chess-turn');
  if (el) el.textContent = state.turn === 'white' ? 'Brancas' : 'Pretas';
}

function showVictoryModal(message) {
  const modal = document.getElementById('chess-modal');
  const msgEl = document.getElementById('chess-modal-message');
  const btn = document.getElementById('chess-modal-btn');
  if (!modal || !msgEl) return;
  msgEl.textContent = message;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  const overlay = modal.querySelector('.chess-modal-overlay');
  const close = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  };
  const playAgain = () => {
    close();
    initChess();
  };
  if (overlay) overlay.onclick = close;
  if (btn) btn.onclick = playAgain;
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.chess-board')) initChess();
});
