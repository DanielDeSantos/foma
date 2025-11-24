// Inicializar Chess.js y Chessboard.js
const chess = new Chess();
let board;
let currentPuzzleIndex = 0;
let moveIndex = 0; // Índice del movimiento actual en la secuencia

// Problemas de ejemplo: cada uno con FEN inicial, secuencia de movimientos blancos y movimientos prefijados del rey negro
const puzzles = [
    {
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', // Posición inicial estándar
        whiteMoves: ['e2e4', 'd1h5', 'f1c4', 'h5f7'], // Mate del Pastor
        blackKingMoves: ['e7e6', 'g7g6', 'f8e7', 'e8f7'] // Movimientos prefijados del rey negro (no óptimos)
    },
    {
        fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', // Después de e4 e5
        whiteMoves: ['f1c4', 'd1h5', 'c4f7', 'h5f7'], // Otro mate en 4
        blackKingMoves: ['g8f6', 'b8c6', 'e8f7', 'f7g8']
    },
    {
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        whiteMoves: ['e2e4', 'd1f3', 'f1c4', 'f3f7'], // Mate simple
        blackKingMoves: ['e7e5', 'd7d6', 'f8c5', 'e8f7']
    },
    {
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        whiteMoves: ['d2d4', 'c1h6', 'h6g7', 'd1d2'], // Mate en 4 con dama
        blackKingMoves: ['e7e6', 'f8e7', 'e8g8', 'g8h7']
    },
    {
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        whiteMoves: ['e2e4', 'f2f4', 'g1f3', 'f3g5'], // Ataque loco
        blackKingMoves: ['e7e5', 'g8f6', 'f8c5', 'e8g8']
    }
];

// Función para cargar un puzzle
function loadPuzzle(index) {
    chess.load(puzzles[index].fen);
    board.position(chess.fen());
    moveIndex = 0;
    updateStatus('¡Comienza el problema! Mueve las blancas.');
}

// Función para actualizar el estado
function updateStatus(message) {
    document.getElementById('status').textContent = message;
}

// Función para manejar el drop de piezas
function onDrop(source, target) {
    const move = chess.move({ from: source, to: target, promotion: 'q' });
    if (move) {
        // Verificar si es el movimiento correcto en la secuencia
        if (move.san === puzzles[currentPuzzleIndex].whiteMoves[moveIndex]) {
            moveIndex++;
            // Mover automáticamente el rey negro
            const blackKingMove = puzzles[currentPuzzleIndex].blackKingMoves[moveIndex - 1];
            if (blackKingMove) {
                chess.move(blackKingMove);
            }
            board.position(chess.fen());
            
            // Verificar si es mate después de 4 jugadas
            if (moveIndex === 4) {
                if (chess.in_checkmate()) {
                    updateStatus('¡Mate en 4! ¡Éxito! Pasa al siguiente.');
                } else {
                    updateStatus('No es mate. Reinicia.');
                    loadPuzzle(currentPuzzleIndex);
                }
            } else {
                updateStatus(`Movimiento ${moveIndex}/4 correcto. Sigue.`);
            }
        } else {
            // Movimiento incorrecto: deshacer y mostrar error
            chess.undo();
            board.position(chess.fen());
            updateStatus('Movimiento incorrecto. Reinicia el problema.');
            loadPuzzle(currentPuzzleIndex);
        }
    } else {
        // Movimiento inválido
        updateStatus('Movimiento inválido.');
    }
}

// Inicializar el tablero
board = Chessboard('board', {
    position: 'start',
    draggable: true,
    onDrop: onDrop
});

// Cargar el primer puzzle
loadPuzzle(currentPuzzleIndex);

// Botones
document.getElementById('reset').addEventListener('click', () => loadPuzzle(currentPuzzleIndex));
document.getElementById('next').addEventListener('click', () => {
    currentPuzzleIndex = (currentPuzzleIndex + 1) % puzzles.length;
    loadPuzzle(currentPuzzleIndex);
});
