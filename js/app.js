// Carga inicial del tablero
document.addEventListener("DOMContentLoaded", () => {
    const boardElement = document.getElementById("board");

    // Crear instancia de Chessground
    const ground = Chessground(boardElement, {
        fen: "start",   // tablero inicial
        viewOnly: false,
        draggable: {
            enabled: true
        }
    });

    console.log("Chessground cargado");
});
