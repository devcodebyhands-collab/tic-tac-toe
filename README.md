# Tic-Tac-Toe

A polished, dependency-free two-player tic-tac-toe game for the browser. Built with vanilla HTML, CSS, and JavaScript and ready to serve from GitHub Pages at `/tic-tac-toe/`.

## Features

- Two-player local game — X always goes first.
- Clear turn indicator, win and draw detection, and a highlighted winning line.
- Running score for X wins, O wins, and draws, plus a **Reset score** button.
- **New round** button starts a fresh board without clearing the score.
- Keyboard playable: `Tab` into the board, use the arrow keys (or `Home` / `End`) between squares, and press `Enter` or `Space` to place a mark.
- Visible focus rings, an `aria-live` status region, meaningful button labels, and high-contrast colors.
- Responsive layout that works on phones and desktops.
- Honors `prefers-reduced-motion`.

## How to play

1. Player **X** starts. Click any empty square (or use the keyboard) to place your mark.
2. Players alternate turns. The status pill above the board shows whose turn it is.
3. Get three of your marks in a row — horizontally, vertically, or diagonally — to win the round. The winning squares light up.
4. If all nine squares fill with no winner, the round is a draw.
5. Scores update automatically. Choose **New round** to play again, or **Reset score** to zero everything.

## Run locally

No build step or dependencies are required. Because the page loads a relative stylesheet and script, serve the folder over HTTP rather than opening the file directly:

```bash
# from the repository root
python3 -m http.server 8000
```

Then open <http://localhost:8000/>.

Any static file server works, for example:

```bash
npx serve .
```

## Deploying to GitHub Pages

1. Push the files to the `main` branch.
2. In the repository, go to **Settings → Pages**.
3. Set **Source** to **Deploy from a branch**, choose the `main` branch and the `/ (root)` folder, then save.
4. The game will be published at `https://<owner>.github.io/tic-tac-toe/`.

All asset paths are relative (`styles.css`, `app.js`), so the game works correctly under the `/tic-tac-toe/` subpath.

## Project structure

| File         | Purpose                                        |
| ------------ | ---------------------------------------------- |
| `index.html` | Page structure, scoreboard, board, and controls |
| `styles.css` | Responsive layout, theme, motion, focus styles |
| `app.js`     | Game state, win/draw logic, keyboard support   |

## Accessibility notes

- The board is a labelled group of nine native buttons; each has a row/column label that updates as marks are placed.
- The status pill is a polite live region, so turn changes and results are announced.
- Arrow-key navigation uses a roving tab stop, keeping the board to a single `Tab` stop.
- Focus-visible outlines use a dedicated high-contrast color.
- Animations are disabled when the user requests reduced motion.
