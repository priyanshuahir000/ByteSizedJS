document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const flagsLeft = document.querySelector("#flags-left");
  const result = document.querySelector("#result");
  const instruction = document.querySelector(".instruction");

  const tick = new Audio("audio/tick.mp3");
  const win = new Audio("audio/win.mp3");
  const lose = new Audio("audio/lose.mp3");

  const width = 10;
  let bombAmount = width * width * 0.2;
  let squares = [];
  let isGameOver = false;
  let flags = 0;

  // Create Board
  function createBoard() {
    // Preloading sounds
    tick.preload = "auto";
    win.preload = "auto";
    lose.preload = "auto";

    flagsLeft.innerHTML = `Flags Left: ${bombAmount}`;

    // Get shuffled game array with random bombs
    const bombsArray = Array(bombAmount).fill("bomb");
    const emptyArray = Array(width * width - bombAmount).fill("valid");
    const gameArray = emptyArray.concat(bombsArray);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.classList.add(shuffledArray[i]);
      square.setAttribute("id", i);
      grid.append(square);
      squares.push(square);

      square.addEventListener("mousedown", (event) => {
        if (event.button === 0 && event.ctrlKey) {
          addFlag(square); // ctrl + left click
        } else {
          click(square); // normal click
        }
      });
    }
  }

  createBoard();

  for (let i = 0; i < squares.length; i++) {
    let total = 0;
    const isLeftEdge = i % width === 0;
    const isRightEdge = i % width === width - 1;
    if (squares[i].classList.contains("valid")) {
      if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb"))
        total++;
      if (
        i > 9 &&
        !isRightEdge &&
        squares[i + 1 - width].classList.contains("bomb")
      )
        total++;
      if (i > 10 && squares[i - width].classList.contains("bomb")) total++;
      if (
        i > 11 &&
        !isLeftEdge &&
        squares[i - 1 - width].classList.contains("bomb")
      )
        total++;
      if (i < 99 && !isRightEdge && squares[i + 1].classList.contains("bomb"))
        total++;
      if (
        i < 90 &&
        !isLeftEdge &&
        squares[i - 1 + width].classList.contains("bomb")
      )
        total++;
      if (
        i < 88 &&
        !isRightEdge &&
        squares[i + 1 + width].classList.contains("bomb")
      )
        total++;
      if (i < 89 && squares[i + width].classList.contains("bomb")) total++;
      squares[i].setAttribute("data", total);
    }
  }

  // Add flag to a square
  function addFlag(square) {
    if (isGameOver) return;
    if (!square.classList.contains("checked") && flags < bombAmount) {
      if (!square.classList.contains("flag")) {
        square.classList.add("flag");
        square.innerHTML = "&#x1F6A9;";
        flags++;
        flagsLeft.innerHTML = `Flags Left: ${bombAmount - flags}`;
        checkForWin();
      } else {
        square.classList.remove("flag");
        square.innerHTML = "";
        flags--;
        flagsLeft.innerHTML = `Flags Left: ${bombAmount - flags}`;
      }
    }
  }

  // Handle click on a square
  function click(square) {
    if (
      isGameOver ||
      square.classList.contains("checked") ||
      square.classList.contains("flag")
    )
      return;
    if (square.classList.contains("bomb")) {
      gameOver(square);
    } else {
      square.classList.add("checked");

      let total = square.getAttribute("data");
      if (total != 0) {
        if (total == 1) square.classList.add("one");
        if (total == 2) square.classList.add("two");
        if (total == 3) square.classList.add("three");
        if (total == 4) square.classList.add("four");
        square.innerHTML = total;
        return;
      }
      checkSquare(square);
    }
  }

  // Check neighboring squares
  function checkSquare(square) {
    const currentId = square.id;
    const isLeftEdge = currentId % width === 0;
    const isRightEdge = currentId % width === width - 1;

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = parseInt(currentId) - 1;
        const newSquare = document.getElementById(newId);

        click(newSquare);
      }
      if (currentId < 98 && !isRightEdge) {
        const newId = parseInt(currentId) + 1;
        const newSquare = document.getElementById(newId);

        click(newSquare);
      }
      if (currentId > 10 && !isLeftEdge) {
        const newId = parseInt(currentId) - width - 1;
        const newSquare = document.getElementById(newId);

        click(newSquare);
      }
      if (currentId > 9 && !isRightEdge) {
        const newId = parseInt(currentId) - width + 1;
        const newSquare = document.getElementById(newId);

        click(newSquare);
      }
      if (currentId > 9) {
        const newId = parseInt(currentId) - width;
        const newSquare = document.getElementById(newId);

        click(newSquare);
      }
      if (currentId < 90 && !isLeftEdge) {
        const newId = parseInt(currentId) + width - 1;
        const newSquare = document.getElementById(newId);

        click(newSquare);
      }
      if (currentId < 88 && !isRightEdge) {
        const newId = parseInt(currentId) + width + 1;
        const newSquare = document.getElementById(newId);

        click(newSquare);
      }
      if (currentId < 90) {
        const newId = parseInt(currentId) + width;
        const newSquare = document.getElementById(newId);

        click(newSquare);
      }
    }, 30);
  }

  // Check if the player has won the game
  function checkForWin() {
    let matches = 0;
    for (let i = 0; i < squares.length; i++) {
      if (
        squares[i].classList.contains("flag") &&
        squares[i].classList.contains("bomb")
      ) {
        matches++;
      }
      if (matches === bombAmount) {
        win.play();
        flagsLeft.innerHTML = "YOU WIN!";
        flagsLeft.style.color = "green";
        isGameOver = true;
      }
    }
  }

  // Game over function
  function gameOver(square) {
    lose.play();
    flagsLeft.innerHTML = "Game Over!";
    flagsLeft.style.color = "red";
    instruction.innerHTML = "Press F5 to play again";
    isGameOver = true;

    // show all the bombs
    squares.forEach((square) => {
      if (square.classList.contains("bomb")) {
        square.innerHTML = "&#x1F4A3";
        square.classList.remove("bomb");
        square.classList.add("checked");
      }
    });
  }
});
