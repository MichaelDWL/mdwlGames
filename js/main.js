const gameItem = document.querySelectorAll(".game-item");
const selectPlayer = document.querySelector(".player");

let board = Array(9).fill("");

const players = {
  X: "Jogador 1",
  O: "Jogador 2",
};

let player = "X";

const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinner() {
  for (const [a, b, c] of winConditions) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // "X" ou "O"
    }
  }

  if (board.every((cell) => cell !== "")) {
    return "empate";
  }

  return null;
}

gameItem.forEach((item, index) => {
  item.addEventListener("click", (event) => {
    selectPlayer.classList.toggle("ativo");
    console.log(selectPlayer);

    if (board[index] !== "") return; // já clicado

    board[index] = player;

    const div = event.currentTarget;

    if (player === "X") {
      div.querySelector(".X").style.display = "block";
    } else {
      div.querySelector(".O").style.display = "block";
    }

    const winner = checkWinner();

    if (winner) {
      alert(`${players[winner]} venceu!`);
      return;
    }

    player = player === "X" ? "O" : "X";
  });
});
