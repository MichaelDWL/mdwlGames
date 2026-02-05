const gameItem = document.querySelectorAll(".game-item");
const selectPlayer = document.querySelector(".player");
const gameTicTacToe = document.querySelector(".game-ticTacToe");
const startGames = document.getElementById("startGame");

function startGame(){
  gameTicTacToe.classList.remove("disabled");
  console.log(gameTicTacToe);
}

startGames.addEventListener("click", startGame);


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

function resetGame() {
  // Reseta o array do tabuleiro
  board = Array(9).fill("");
  
  // Volta o jogador inicial
  player = "X";
  
  // Esconde todos os X e O no visual
  gameItem.forEach((item) => {
    item.querySelector(".X").style.display = "none";
    item.querySelector(".O").style.display = "none";
    selectPlayer.classList.remove("ativo");
  });
}

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

    if(gameTicTacToe.classList.contains("disabled")) return;

    console.log(selectPlayer);

    if (board[index] !== "") return; // já clicado

    board[index] = player;

    const div = event.currentTarget;

    if (player === "X") {
      div.querySelector(".X").style.display = "block";
      selectPlayer.classList.add("ativo");
    } else {
      div.querySelector(".O").style.display = "block";
      selectPlayer.classList.remove("ativo");
    }

    const winner = checkWinner();

    if (winner) {
      const msg = winner === "empate" ? "Empate!" : `${players[winner]} venceu!`;
      alert(msg);
      resetGame();
      return;     
    }

    player = player === "X" ? "O" : "X";
  });
});

