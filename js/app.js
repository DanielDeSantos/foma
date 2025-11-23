let board;
let game;
let currentProblemIndex = 0;
let moveCount = 0;
let kingMoveIndex = 0;  // Tracks the king's move in the sequence

// Initialize the board and load the first problem
function initBoard() {
    game = new Chess(problems[currentProblemIndex].fen);
    board = Chessboard('board', {
        position: problems[currentProblemIndex].fen,
        draggable: true,
        onDrop: onDrop
    });
    moveCount = 0;
    kingMoveIndex = 0;
    updateUI();
}

// Handle user drag-and-drop moves
function onDrop(source, target) {
    const move = game.move({ from: source, to: target, promotion: 'q' });  // Assume queen promotion
    if (move === null) return 'snapback';  // Invalid move

    board.position(game.fen());
    moveCount++;
    updateUI();

    // Check for checkmate
    if (game.in_checkmate()) {
        if (moveCount === 4) {
            alert('Checkmate! You win in exactly 4 moves.');
        } else {
            alert('Checkmate, but not in 4 moves. Try again.');
            resetPuzzle();
        }
        return;
    }

    // If not checkmate and moves exceed 4, reset
    if (moveCount >= 4) {
        alert('No checkmate in 4 moves. Try again.');
        resetPuzzle();
        return;
    }

    // Auto-move the black king after a short delay
    setTimeout(() => {
        const kingMove = getNextKingMove();
        if (kingMove) {
            game.move(kingMove);
            board.position(game.fen());
            kingMoveIndex++;
        }
    }, 1000);  // 1-second delay for better UX
}

// Get the next predefined king move
function getNextKingMove() {
    const problem = problems[currentProblemIndex];
    if (kingMoveIndex < problem.kingMoves.length) {
        const moveStr = problem.kingMoves[kingMoveIndex];
        const move = game.move(moveStr);  // Chess.js will validate it
        if (move) {
            return move;
        }
    }
    return null;  // No more moves or invalid
}

// Update UI elements
function updateUI() {
    document.getElementById('move-count').textContent = moveCount;
}

// Reset the current puzzle
function resetPuzzle() {
    initBoard();
}

// Load the next problem (cycles through the array)
function nextProblem() {
    currentProblemIndex = (currentProblemIndex + 1) % problems.length;
    initBoard();
}

// Event listeners
document.getElementById('reset-btn').addEventListener('click', resetPuzzle);
document.getElementById('next-btn').addEventListener('click', nextProblem);

// Initialize on page load
window.onload = initBoard;
