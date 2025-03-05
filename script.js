const sudoku = document.querySelector(".sudoku-wrapper");
const game = document.querySelector(".game");
const cells = document.querySelectorAll(".cell");
const numPad = document.querySelector(".numpad");
const mistakesCounter = document.querySelector(".mistakes-counter-info");
const eraseButton = document.querySelector(".eraser i");
const notesButton = document.querySelector(".notes i");
const notesButtonLabel = document.querySelector(".game-controls-notes-label");
const timerContainer = document.querySelector(".timer");

let timer = 0;
let timerCounter;

const gameConfig = {
  easy: 43,
  medium: 45,
  hard: 51,
  expert: 56,
  master: 57,
  extreme: 58,
  totalMistakes: 3,
  mistakes: 0,
  remainingCells: 81,
};

const getSodoku = async (api) => {
  const response = await fetch(api);
  return response.json();
};

const setGame = async (mode) => {
  const sudokus = await getSodoku("sudoku.json");
  const sudoku = sudokus[Math.floor(Math.random() * sudokus.length)];
  setRandomValues(sudoku, mode);
  timerInterval();
  numPad.addEventListener("click", (e) => {
    checkNumber(e, sudoku);
  });
};

const setRandomValues = (sudoku, mode) => {
  while (gameConfig.remainingCells > gameConfig[mode]) {
    const randomNumber = Math.floor(Math.random() * sudoku.length);
    const number = sudoku[randomNumber];
    if (!cells[randomNumber].textContent) {
      cells[randomNumber].textContent = number;
      cells[randomNumber].setAttribute("disabled", "");
      gameConfig.remainingCells--;
    }
  }
};

const handleActive = (e) => {
  if (!e.target.matches(".cell")) return;
  const target = e.target;
  const currentNumber = target.textContent;
  cells.forEach((cell) =>
    cell.classList.remove("active", "selected", "chosen")
  );
  const [column, row] = target.id.split("-");
  const relatedCells = [
    ...document.querySelectorAll(`[id*="${column}"]`), // Column
    ...document.querySelectorAll(`[id*="${row}"]`), // Row
    ...target.parentElement.querySelectorAll(".cell"), // Box
  ];
  relatedCells.forEach((cell) => cell.classList.add("active"));
  target.classList.add("selected");
  if (currentNumber) {
    cells.forEach(
      (cell) =>
        cell.textContent === currentNumber && cell.classList.add("chosen")
    );
  }
};

game.addEventListener("click", handleActive);

const checkNumber = (e, sudoku) => {
  if (!e.target.matches(".num")) return;
  const target = e.target;
  const num = target.textContent;
  const selectedCell = document.querySelector(".selected");
  const cellIndex = Array.from(cells).indexOf(selectedCell);
  const [column, row] = selectedCell.id.split("-");
  const relatedCells = [
    ...document.querySelectorAll(`[id*="${column}"]`),
    ...document.querySelectorAll(`[id*="${row}"]`),
    ...selectedCell.parentElement.querySelectorAll(".cell"),
  ];
  if (selectedCell.hasAttribute("disabled")) return;
  // if selected cell equal to the clicked num
  if (selectedCell.textContent === num) {
    // if it's correct we add to the remaining cells;
    if (selectedCell.classList.contains("correct")) {
      gameConfig.remainingCells++;
      selectedCell.classList.remove("wrong");
      console.log(gameConfig.remainingCells);
    } else {
      relatedCells.forEach(
        (cell) =>
          cell.textContent === num &&
          cell.classList.contains("wrong") &&
          cell.classList.remove("wrong")
      );
    }
    // remove chosen from cells
    cells.forEach((cell) => cell.classList.remove("chosen"));
    // then empty the selected cell
    selectedCell.textContent = "";
    // if selected cell not equal to the clicked num
  } else {
    // If the cell has number
    if (selectedCell.textContent) {
      // If the cell number is correct
      if (selectedCell.textContent == sudoku[cellIndex]) {
        addMistake();
        gameConfig.remainingCells++;
        selectedCell.classList.remove("correct");
        selectedCell.classList.add("wrong");
        cells.forEach((cell) => cell.classList.remove("chosen"));
        cells.forEach(
          (cell) => cell.textContent === num && cell.classList.add("chosen")
        );
        relatedCells.forEach(
          (cell) => cell.textContent === num && cell.classList.add("wrong")
        );
        selectedCell.textContent = num;
        // If the cell number is not correct
      } else {
        if (num == sudoku[cellIndex]) {
          gameConfig.remainingCells--;
          console.log(gameConfig.remainingCells);
          selectedCell.classList.add("correct");
          cells.forEach((cell) => cell.classList.remove("chosen"));
          cells.forEach(
            (cell) => cell.textContent === num && cell.classList.add("chosen")
          );
          relatedCells.forEach(
            (cell) =>
              cell.textContent === selectedCell.textContent &&
              cell.classList.remove("wrong")
          );
          relatedCells.forEach(
            (cell) => cell.textContent === num && cell.classList.add("wrong")
          );
          selectedCell.textContent = num;
        } else {
          addMistake();
          selectedCell.classList.add("wrong");
          relatedCells.forEach(
            (cell) =>
              cell.textContent === selectedCell.textContent &&
              cell.classList.remove("wrong")
          );
          cells.forEach((cell) => cell.classList.remove("chosen"));
          cells.forEach(
            (cell) => cell.textContent === num && cell.classList.add("chosen")
          );
          relatedCells.forEach(
            (cell) => cell.textContent === num && cell.classList.add("wrong")
          );
          selectedCell.textContent = num;
        }
      }
    } else {
      if (num == sudoku[cellIndex]) {
        gameConfig.remainingCells--;
        console.log(gameConfig.remainingCells);
        selectedCell.classList.add("correct");
        relatedCells.some(
          (cell) =>
            cell.textContent === num &&
            cell.classList.contains("wrong") &&
            selectedCell.classList.add("wrong")
        );
        cells.forEach(
          (cell) => cell.textContent === num && cell.classList.add("chosen")
        );
        selectedCell.textContent = num;
      } else {
        addMistake();
        selectedCell.classList.add("wrong");
        relatedCells.forEach(
          (cell) => cell.textContent === num && cell.classList.add("wrong")
        );
        cells.forEach(
          (cell) => cell.textContent === num && cell.classList.add("chosen")
        );
        selectedCell.textContent = num;
      }
    }
  }
};
const addMistake = () => {
  gameConfig.mistakes++;
  mistakesCounter.textContent = `${gameConfig.mistakes} / ${gameConfig.totalMistakes}`;
  if (gameConfig.mistakes === gameConfig.totalMistakes) {
    console.log("Finish");
  }
};

const timerInterval = () => {
  timerCounter = setInterval(() => {
    const minutes = Math.trunc(timer / 60);
    const seconds = Math.trunc(timer % 60);
    timerContainer.textContent = `${minutes < 10 ? `0${minutes}` : minutes}:${
      seconds < 10 ? `0${seconds}` : seconds
    }`;
    timer++;
  }, 1000);
};

const erase = () => {
  const selectedCell = document.querySelector(".selected");
  if (!selectedCell) return;
  if (selectedCell.classList.contains("correct")) {
    gameConfig.remainingCells++;
    console.log(gameConfig.remainingCells);
    cells.forEach((cell) => cell.classList.remove("chosen"));
    selectedCell.textContent = "";
  } else {
    const [column, row] = selectedCell.id.split("-");
    const relatedCells = [
      ...document.querySelectorAll(`[id *= "${column}"]`),
      ...document.querySelectorAll(`[id *= "${row}"]`),
      ...selectedCell.parentElement.querySelectorAll(".cell"),
    ];
    relatedCells.forEach((cell) => cell.classList.remove("wrong"));
    cells.forEach((cell) => cell.classList.remove("chosen"));
    selectedCell.textContent = "";
  }
};

notesButton.addEventListener("click", () => {
  if (!sudoku.classList.contains("pencil-mode")) {
    sudoku.classList.add("pencil-mode");
    notesButtonLabel.textContent = `ON`;
  } else {
    sudoku.classList.remove("pencil-mode");
    notesButtonLabel.textContent = `OFF`;
  }
});

eraseButton.addEventListener("click", erase);

setGame("easy");
