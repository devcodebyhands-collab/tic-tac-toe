(() => {
  "use strict";

  const WIN_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const boardEl = document.getElementById("board");
  const cells = Array.from(boardEl.querySelectorAll(".cell"));
  const statusEl = document.getElementById("status");
  const statusMark = document.getElementById("status-mark");
  const statusText = document.getElementById("status-text");
  const newRoundBtn = document.getElementById("new-round");
  const resetScoreBtn = document.getElementById("reset-score");

  const scoreEls = {
    X: document.getElementById("score-x"),
    O: document.getElementById("score-o"),
    draws: document.getElementById("score-draws"),
  };

  let board = Array(9).fill(null);
  let current = "X";
  let active = true;
  let scores = { X: 0, O: 0, draws: 0 };

  /* ---------- Rendering ---------- */

  function cellLabel(index) {
    const row = Math.floor(index / 3) + 1;
    const col = (index % 3) + 1;
    const mark = board[index];
    return `Row ${row}, column ${col}, ${mark ? `taken by ${mark}` : "empty"}`;
  }

  function updateCellLabel(index) {
    cells[index].setAttribute("aria-label", cellLabel(index));
  }

  function updateScores() {
    scoreEls.X.textContent = scores.X;
    scoreEls.O.textContent = scores.O;
    scoreEls.draws.textContent = scores.draws;
  }

  function setActiveScore(mark) {
    document.querySelectorAll(".score").forEach((card) => {
      const isActive =
        (mark === "X" && card.classList.contains("score--x")) ||
        (mark === "O" && card.classList.contains("score--o"));
      card.classList.toggle("is-active", isActive);
    });
  }

  function bumpScore(mark) {
    const card =
      mark === "draws"
        ? document.querySelector(".score--draw")
        : document.querySelector(mark === "X" ? ".score--x" : ".score--o");
    if (!card) return;
    card.classList.remove("is-bumped");
    // Force a reflow so the animation can restart on consecutive wins.
    void card.offsetWidth;
    card.classList.add("is-bumped");
  }

  function setStatus(mark, text, tone, outcome = null) {
    statusMark.textContent = mark;
    statusMark.className = `status__mark status__mark--${tone}`;
    statusText.textContent = text;
    statusEl.classList.toggle("is-win", outcome === "win");
    statusEl.classList.toggle("is-draw", outcome === "draw");
  }

  function updateTurn() {
    setStatus(current, `Player ${current}'s turn`, current.toLowerCase());
    setActiveScore(current);
  }

  /* ---------- Game flow ---------- */

  function getResult() {
    for (const line of WIN_LINES) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { type: "win", mark: board[a], line };
      }
    }
    if (board.every(Boolean)) return { type: "draw" };
    return null;
  }

  function finishCellState() {
    cells.forEach((cell) => cell.setAttribute("aria-disabled", "true"));
  }

  function play(index) {
    if (!active || board[index] !== null) return;

    board[index] = current;
    const cell = cells[index];
    const mark = current.toLowerCase();
    cell.textContent = current;
    cell.classList.add(`cell--${mark}`);
    cell.classList.remove(`cell--${mark === "x" ? "o" : "x"}`);
    updateCellLabel(index);

    const result = getResult();

    if (!result) {
      current = current === "X" ? "O" : "X";
      updateTurn();
      return;
    }

    active = false;
    setActiveScore(null);
    finishCellState();

    if (result.type === "win") {
      result.line.forEach((i) => cells[i].classList.add("is-win"));
      scores[result.mark] += 1;
      updateScores();
      bumpScore(result.mark);
      setStatus(
        result.mark,
        `Player ${result.mark} wins this round!`,
        result.mark.toLowerCase(),
        "win"
      );
    } else {
      scores.draws += 1;
      updateScores();
      bumpScore("draws");
      setStatus("=", "It's a draw — nobody wins this round.", "draw", "draw");
    }
  }

  function resetRound() {
    board = Array(9).fill(null);
    current = "X";
    active = true;

    cells.forEach((cell, index) => {
      cell.textContent = "";
      cell.classList.remove("cell--x", "cell--o", "is-win");
      cell.removeAttribute("aria-disabled");
      updateCellLabel(index);
    });

    statusEl.classList.remove("is-win", "is-draw");
    updateTurn();
  }

  /* ---------- Events ---------- */

  boardEl.addEventListener("click", (event) => {
    const cell = event.target.closest(".cell");
    if (!cell) return;
    play(Number(cell.dataset.index));
  });

  // Arrow-key navigation around the board with a roving tab stop.
  function setRovingTabStop(index) {
    cells.forEach((cell, i) => {
      cell.tabIndex = i === index ? 0 : -1;
    });
  }

  boardEl.addEventListener("focusin", (event) => {
    const index = cells.indexOf(event.target);
    if (index !== -1) setRovingTabStop(index);
  });

  boardEl.addEventListener("keydown", (event) => {
    const index = cells.indexOf(document.activeElement);
    if (index === -1) return;

    const row = Math.floor(index / 3);
    const col = index % 3;
    let next = null;

    switch (event.key) {
      case "ArrowRight":
        next = row * 3 + Math.min(col + 1, 2);
        break;
      case "ArrowLeft":
        next = row * 3 + Math.max(col - 1, 0);
        break;
      case "ArrowDown":
        next = Math.min(row + 1, 2) * 3 + col;
        break;
      case "ArrowUp":
        next = Math.max(row - 1, 0) * 3 + col;
        break;
      case "Home":
        next = row * 3;
        break;
      case "End":
        next = row * 3 + 2;
        break;
      default:
        return;
    }

    event.preventDefault();
    setRovingTabStop(next);
    cells[next].focus();
  });

  newRoundBtn.addEventListener("click", () => {
    resetRound();
  });

  resetScoreBtn.addEventListener("click", () => {
    scores = { X: 0, O: 0, draws: 0 };
    updateScores();
    document.querySelectorAll(".score").forEach((card) => {
      card.classList.remove("is-bumped");
    });
    resetRound();
    setStatus("X", "Score reset. Player X's turn", "x");
  });

  /* ---------- Init ---------- */

  cells.forEach((_, index) => updateCellLabel(index));
  setRovingTabStop(0);
  updateScores();
  updateTurn();
})();
