let puzzles = [
{
id: 1,
fen: "5rk1/1p4pp/p1p2q2/1PP1n3/3p1Q2/3P2P1/1P3P1P/4R1K1 w - - 0 1",
jugadas_negras: ["Nf3", "Qh6", "Qg2"],
numero_jugadas: 4,
titulo: "Mate elegante en 4"
},
{
id: 2,
fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/3P4/PPP2PPP/RNBQKBNR w KQkq - 0 1",
jugadas_negras: ["d5", "Bg4", "Nd4"],
numero_jugadas: 4,
titulo: "Apertura táctica"
}
];


let index = 0;
let game;
let ground;
let turnoBlancas;


function cargarPuzzle(p) {
document.getElementById("info").textContent = p.titulo;
game = new Chess(p.fen);
turnoBlancas = 0;


ground = Chessground(document.getElementById("board"), {
fen: p.fen,
movable: {
color: "white",
free: false,
events: {
after: (orig, dest) => moverBlancas(orig, dest, p)
}
}
});
}


function moverBlancas(orig, dest, p) {
const move = game.move({ from: orig, to: dest, promotion: "q" });
if (!move) { alert("Movimiento ilegal"); ground.set({ fen: game.fen() }); return; }


if (turnoBlancas === p.numero_jugadas - 1) {
if (game.isCheckmate()) alert("¡Mate en 4 correcto!");
else alert("No es mate. Inténtalo de nuevo.");
return;
}


const movNegro = game.move(p.jugadas_negras[turnoBlancas]);
if (!movNegro) { alert("Error: jugada de negro inválida en este puzzle."); return; }


turnoBlancas++;
ground.set({ fen: game.fen() });
}


function siguientePuzzle() {
index = (index + 1) % puzzles.length;
cargarPuzzle(puzzles[index]);
}


document.addEventListener('DOMContentLoaded', () => cargarPuzzle(puzzles[0]));