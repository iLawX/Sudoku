const game = document.querySelector(".game");
const cells = document.querySelectorAll(".cell");
const numPad = document.querySelector(".numpad");

const gameConfig = {
  easy: 43,
  medium: 45,
  hard: 51,
  expert: 56,
  master: 57,
  extreme: 58,
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
  if (selectedCell.hasAttribute("disabled")) return;
  if (selectedCell.textContent !== num) {
    if (selectedCell.textContent) {
      if (num == sudoku[cellIndex]) {
        const [column, row] = selectedCell.id.split("-");
        const relatedCells = [
          ...document.querySelectorAll(`[id*="${column}"]`), // Column
          ...document.querySelectorAll(`[id*="${row}"]`), // Row
          ...selectedCell.parentElement.querySelectorAll(".cell"), // Box
        ];
        relatedCells.forEach(
          (cell) =>
            cell.textContent === selectedCell.textContent &&
            cell.classList.remove("wrong")
        );
        selectedCell.textContent = num;
        cells.forEach((cell) => cell.classList.remove("chosen"));
        cells.forEach(
          (cell) =>
            cell.textContent === selectedCell.textContent &&
            cell.classList.add("chosen")
        );
        gameConfig.remainingCells--;
      } else {
        cells.forEach((cell) => cell.classList.remove("active"));
        const [column, row] = selectedCell.id.split("-");
        const relatedCells = [
          ...document.querySelectorAll(`[id*="${column}"]`), // Column
          ...document.querySelectorAll(`[id*="${row}"]`), // Row
          ...selectedCell.parentElement.querySelectorAll(".cell"), // Box
        ];
        selectedCell.textContent = num;
        relatedCells.forEach(
          (cell) =>
            cell.textContent === selectedCell && cell.classList.add("wrong")
        );
        cells.forEach(
          (cell) =>
            cell.textContent === selectedCell.textContent &&
            cell.classList.add("chosen")
        );
      }
    } else {
      if (num == sudoku[cellIndex]) {
        selectedCell.textContent = num;
        cells.forEach(
          (cell) =>
            cell.textContent === selectedCell.textContent &&
            cell.classList.add("chosen")
        );
        selectedCell.classList.add("correct");
        gameConfig.remainingCells--;
      } else {
        selectedCell.textContent = num;
        const [column, row] = selectedCell.id.split("-");
        const relatedCells = [
          ...document.querySelectorAll(`[id*="${column}"]`), // Column
          ...document.querySelectorAll(`[id*="${row}"]`), // Row
          ...selectedCell.parentElement.querySelectorAll(".cell"), // Box
        ];
        relatedCells.forEach(
          (cell) =>
            cell.textContent === selectedCell.textContent &&
            cell.classList.add("wrong")
        );
        cells.forEach(
          (cell) =>
            cell.textContent === selectedCell.textContent &&
            cell.classList.add("chosen")
        );
      }
    }
  }
  // if (selectedCell.textContent) {
  //   if (selectedCell.textContent == sudoku[cellIndex]) {
  //     if (selectedCell.textContent !== num) {
  //       selectedCell.textContent = num;
  //       gameConfig.remainingCells++;
  //       cells.forEach((cell) => cell.classList.remove("chosen"));
  //       const [column, row] = selectedCell.id.split("-");
  //       const relatedCells = [
  //         ...document.querySelectorAll(`[id*="${column}"]`), // Column
  //         ...document.querySelectorAll(`[id*="${row}"]`), // Row
  //         ...selectedCell.parentElement.querySelectorAll(".cell"), // Box
  //       ];
  //       relatedCells.forEach((cell) => {
  //         if (cell.textContent === selectedCell.textContent)
  //           cell.classList.add("wrong");
  //       });
  //       cells.forEach(
  //         (cell) =>
  //           cell.textContent === selectedCell.textContent &&
  //           cell.classList.add("chosen")
  //       );
  //     }
  //   } else {
  //     selectedCell.textContent = num;
  //     if (selectedCell.textContent == sudoku[cellIndex]) {
  //       gameConfig.remainingCells--;
  //       cells.forEach((cell) => cell.classList.remove("chosen"));
  //       cells.forEach(
  //         (cell) =>
  //           cell.textContent === selectedCell.textContent &&
  //           cell.classList.remove("wrong")
  //       );
  //       cells.forEach(
  //         (cell) =>
  //           cell.textContent === selectedCell.textContent &&
  //           cell.classList.add("chosen")
  //       );
  //     } else {
  //       cells.forEach((cell) => cell.classList.remove("chosen"));
  //       const [column, row] = selectedCell.id.split("-");
  //       const relatedCells = [
  //         ...document.querySelectorAll(`[id*="${column}"]`), // Column
  //         ...document.querySelectorAll(`[id*="${row}"]`), // Row
  //         ...selectedCell.parentElement.querySelectorAll(".cell"), // Box
  //       ];
  //       relatedCells.forEach((cell) => {
  //         if (cell.textContent === selectedCell.textContent)
  //           cell.classList.add("wrong");
  //       });
  //       cells.forEach(
  //         (cell) =>
  //           cell.textContent === selectedCell.textContent &&
  //           cell.classList.add("chosen")
  //       );
  //     }
  //   }
  // } else {
  //   selectedCell.textContent = num;
  //   if (selectedCell.textContent == sudoku[cellIndex]) {
  //     gameConfig.remainingCells--;
  //     cells.forEach((cell) => {
  //       if (cell.textContent === selectedCell.textContent)
  //         cell.classList.add("chosen");
  //     });
  //   } else {
  //     cells.forEach((cell) => cell.classList.remove("chosen"));
  //     const [column, row] = selectedCell.id.split("-");
  //     const relatedCells = [
  //       ...document.querySelectorAll(`[id*="${column}"]`), // Column
  //       ...document.querySelectorAll(`[id*="${row}"]`), // Row
  //       ...selectedCell.parentElement.querySelectorAll(".cell"), // Box
  //     ];
  //     relatedCells.forEach((cell) => {
  //       if (cell.textContent === selectedCell.textContent)
  //         cell.classList.add("wrong");
  //     });
  //     cells.forEach(
  //       (cell) =>
  //         cell.textContent === selectedCell.textContent &&
  //         cell.classList.add("chosen")
  //     );
  //   }
  // }
};
setTimeout(() => {
  console.log(gameConfig.remainingCells);
}, 10000);
setGame("easy");
