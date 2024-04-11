// This file contains working of the gamea

const gameBoard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector("#player");
const infoDisplay = document.querySelector("#info-display");
const width = 8;
const move = new Audio("sounds/move.mp3");
const capture = new Audio("sounds/capture.mp3");
const wrongMove = new Audio("sounds/wrong-move.mp3");
let playerGo = "black";
playerDisplay.textContent = "black";
const startPieces = [
  rook,
  knight,
  bishop,
  queen,
  king,
  bishop,
  knight,
  rook,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  rook,
  knight,
  bishop,
  queen,
  king,
  bishop,
  knight,
  rook,
];

function createBoard() {
  startPieces.forEach((startPiece, i) => {
    const square = document.createElement("div");
    square.classList.add("square");
    square.innerHTML = startPiece;
    square.firstChild?.setAttribute("draggable", "true");
    square.setAttribute("square-id", i);
    // square.classList.add("beige");
    const row = Math.floor((63 - i) / 8) + 1;
    if (row % 2 === 0) {
      square.classList.add(i % 2 === 0 ? "beige" : "brown");
    } else {
      square.classList.add(i % 2 === 0 ? "brown" : "beige");
    }
    gameBoard.append(square);
    if (i <= 15) {
      square.firstChild.firstChild.classList.add("black");
    }
    if (i >= 48) {
      square.firstChild.firstChild.classList.add("white");
    }
  });
}
createBoard();

const allSquares = document.querySelectorAll(".square");

allSquares.forEach((square) => {
  square.addEventListener("dragstart", dragStart);
  square.addEventListener("dragover", dragOver);
  square.addEventListener("drop", dragDrop);
});

let startPositionId;
let draggedElement;

function dragStart(e) {
  startPositionId = e.target.parentNode.getAttribute("square-id");
  draggedElement = e.target;
}

function dragOver(e) {
  e.preventDefault();
}

function dragDrop(e) {
  e.stopPropagation();
  const correctGo = draggedElement.firstChild.classList.contains(playerGo);
  const opponentGo = playerGo === "white" ? "black" : "white";
  const taken = e.target.classList.contains("piece");
  const valid = checkIfValidMove(e.target);
  const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo);
  console.log(e.target);
  if (correctGo) {
    // must check this first
    if (takenByOpponent && valid) {
      capture.play();
      e.target.parentNode.append(draggedElement);
      e.target.remove();
      checkForWin();
      changePlayer();
      return;
    }
    if (taken && !takenByOpponent) {
      wrongMove.play();
      infoDisplay.textContent = "You cant go there";
      setTimeout(() => (infoDisplay.textContent = ""), 2000);
      return;
    }
    if (valid) {
      move.play();
      e.target.append(draggedElement);
      changePlayer();
      checkForWin();
      return;
    }
  } else {
    wrongMove.play();
    infoDisplay.textContent = "Its not your turn";
    setTimeout(() => (infoDisplay.textContent = ""), 2000);
  }
}
function changePlayer() {
  if (playerGo === "black") {
    reverseIds();
    playerGo = "white";
    playerDisplay.textContent = "white";
  } else {
    revertIds();
    playerGo = "black";
    playerDisplay.textContent = "black";
  }
}

function reverseIds() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach((square, i) => {
    square.setAttribute("square-id", width * width - 1 - i);
  });
}

function revertIds() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach((square, i) => {
    square.setAttribute("square-id", i);
  });
}

function checkForWin() {
  const kings = Array.from(document.querySelectorAll("#king"));
  if (!kings.some((king) => king.firstChild.classList.contains("white"))) {
    infoDisplay.textContent = "Black wins!";
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square) =>
      square.firstChild?.setAttribute("draggable", false)
    );
  }
  if (!kings.some((king) => king.firstChild.classList.contains("black"))) {
    infoDisplay.textContent = "White wins!";
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square) =>
      square.firstChild?.setAttribute("draggable", false)
    );
  }
}
