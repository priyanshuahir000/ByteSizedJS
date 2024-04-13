// This file contains working of the gamea

const gameBoard = document.querySelector("#gameboard");
const infoDisplay = document.querySelector("#info-display");
const player1Display = document.querySelector("#playerDisplay1");
const player2Display = document.querySelector("#playerDisplay2");
const win = document.querySelector("#win");
const error = document.querySelector("#error");
const table = document.querySelector(".position-table").firstElementChild;
const width = 8;
let piecesTakenBy1 = [];
let piecesTakenBy2 = [];
let step = 0;
const move = new Audio("sounds/move.mp3");
const capture = new Audio("sounds/capture.mp3");
const wrongMove = new Audio("sounds/wrong-move.mp3");
let playerGo = "black";
player1Display.textContent = "Your turn";
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
    square.setAttribute("position-id", i);
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
  unMarkPosition();
  const correctGo = draggedElement.firstChild.classList.contains(playerGo);
  const opponentGo = playerGo === "white" ? "black" : "white";
  const taken = e.target.classList.contains("piece");
  const valid = checkIfValidMove(e.target);
  const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo);
  if (correctGo) {
    // must check this first
    if (takenByOpponent && valid) {
      capture.play();
      markPosition(
        touchStartPositionId,
        e.target.parentNode.getAttribute("square-id")
      );
      const position = e.target.parentNode.getAttribute("square-id"); // To add to the table
      e.target.parentNode.append(touchMovedElement);
      const takenPiece = e.target.firstChild;
      if (playerGo === "black") {
        piecesTakenBy1.push(takenPiece);
      } else {
        piecesTakenBy2.push(takenPiece);
      }
      pieceTakenDisplay();
      e.target.remove();
      checkForWin();
      addPosition(position);
      changePlayer();
      return;
    } else if (valid) {
      move.play();
      e.target.append(touchMovedElement);
      markPosition(touchStartPositionId, e.target.getAttribute("square-id"));
      changePlayer();
      checkForWin();
      addPosition(e.target.getAttribute("square-id"));
      return;
    } else {
      wrongMove.play();
      const errorPlayerId = document.querySelector(".turn").id;
      if (errorPlayerId === "player1") {
        player1Display.textContent = "You cant go there";
        document.querySelector("#player1").classList.add("wrong");
        setTimeout(() => {
          document.querySelector("#player1").classList.remove("wrong");
        }, 300);
        setTimeout(() => (player1Display.textContent = ""), 2000);
      } else {
        player2Display.textContent = "You cant go there";
        document.querySelector("#player2").classList.add("wrong");
        setTimeout(() => {
          document.querySelector("#player2").classList.remove("wrong");
        }, 300);
        setTimeout(() => (player2Display.textContent = ""), 2000);
      }
      return;
    }
  } else {
    wrongMove.play();
    const errorPlayerId = document.querySelector(".turn").id;
    if (errorPlayerId === "player1") {
      player2Display.textContent = "Its not your turn";
      document.querySelector("#player2").classList.add("wrong");
      setTimeout(() => {
        document.querySelector("#player2").classList.remove("wrong");
      }, 300);
      setTimeout(() => (player2Display.textContent = ""), 2000);
    } else {
      player1Display.textContent = "Its not your turn";
      document.querySelector("#player1").classList.add("wrong");
      setTimeout(() => {
        document.querySelector("#player1").classList.remove("wrong");
      }, 300);
      setTimeout(() => (player1Display.textContent = ""), 2000);
    }
  }
}
function changePlayer() {
  if (playerGo === "black") {
    reverseIds();
    playerGo = "white";
    player1Display.textContent = "";
    player2Display.textContent = "Your turn";
  } else {
    revertIds();
    playerGo = "black";
    player2Display.textContent = "";
    player1Display.textContent = "Your turn";
  }
  document.querySelector("#player1").classList.toggle("turn");
  document.querySelector("#player2").classList.toggle("turn");
}

function markPosition(startId, finalId) {
  const start = document.querySelector(`[square-id="${startId}"]`);
  const final = document.querySelector(`[square-id="${finalId}"]`);
  start.classList.add("marked");
  final.classList.add("marked");
}

function unMarkPosition() {
  const marked = document.querySelectorAll(".marked");
  marked.forEach((mark) => mark.classList.remove("marked"));
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
    win.textContent = "Black wins!";
    playVictorySound();
  }
  if (!kings.some((king) => king.firstChild.classList.contains("black"))) {
    win.textContent = "White wins!";
    playVictorySound();
  }
}

function playVictorySound() {
  const random = Math.floor(Math.random() * 5 + 1);
  const victory = new Audio(`sounds/victory${random}.mp3`);
  victory.play();
}

function addPosition(finalId) {
  if (table.firstElementChild) {
    const td = document.querySelectorAll("td");
    td.forEach((td) => td.classList.remove("current-move"));
  }
  const finalPositionId = document
    .querySelector(`[square-id="${finalId}"]`)
    .getAttribute("position-id");
  const finalPosition = getPosition(finalPositionId);
  let pRow = "";
  if (
    document
      .querySelector(`[position-id="${finalPositionId}"]`)
      .firstChild.firstChild.classList.contains("black")
  ) {
    step++;
    pRow = `<tr><td>${step}</td><td class="current-move">${finalPosition}</td><td>-</td></tr>`;
    table.innerHTML += pRow;
  } else {
    pRow = `<td>${finalPosition}</td>`;
    table.lastElementChild.lastElementChild.innerHTML = pRow;
    table.lastElementChild.lastElementChild.classList.add("current-move");
  }
  infoDisplay.scrollTop = infoDisplay.scrollHeight; // Scroll to the end of the table
}

function getPosition(positionId) {
  const row = Math.floor(positionId / width) + 1;
  const column = (positionId % width) + 1;
  switch (column) {
    case 1:
      return "h" + row;
    case 2:
      return "g" + row;
    case 3:
      return "f" + row;
    case 4:
      return "e" + row;
    case 5:
      return "d" + row;
    case 6:
      return "c" + row;
    case 7:
      return "b" + row;
    case 8:
      return "a" + row;
  }
}

function pieceTakenDisplay() {
  const taken1 = document.querySelector("#piecesTakenBy1");
  const taken2 = document.querySelector("#piecesTakenBy2");
  taken1.innerHTML = "";
  taken2.innerHTML = "";
  piecesTakenBy1.forEach((piece) => taken1.append(piece));
  piecesTakenBy2.forEach((piece) => taken2.append(piece));
}
