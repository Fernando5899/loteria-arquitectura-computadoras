// server/index.ts
import express from 'express';
import * as http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

// --- LÓGICA DEL JUEGO ---
const ALL_WORDS = [
    'CPU', 'ALU', 'RAM', 'ROM', 'Caché', 'GPU', 'Placa Base', 'BIOS/UEFI',
    'Bus de Datos', 'Bus de Direcciones', 'Arquitectura Von Neumann', 'Arquitectura Harvard',
    'Set de Instrucciones (ISA)', 'CISC', 'RISC', 'Pipeline (Segmentación)',
    'Multiprocesamiento', 'Multihilo (Multithreading)', 'Sistema Operativo',
    'Kernel (Núcleo)', 'Drivers (Controladores)', 'SSD', 'HDD', 'Periférico',
    'Puerto (I/O Port)', 'Latencia', 'Ancho de Banda', 'Reloj del Sistema (Clock Speed)',
    'Virtualización', 'Firmware'
];

function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Estado del juego
let deck: string[] = [];
let calledCards: string[] = [];
let isGameWon = false;
let winnerId: string | null = null;

function resetGame() {
    console.log('Reseteando el juego...');
    deck = shuffleArray(ALL_WORDS);
    calledCards = [];
    isGameWon = false;
    winnerId = null;
}

// Inicia el juego por primera vez
resetGame();

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] } });

io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);

    // Notifica a todos los demás que un nuevo usuario se ha conectado
    socket.broadcast.emit('user:connected', { userId: socket.id });

    // Envía el estado actual del juego solo al usuario que acaba de conectar
    socket.emit('game:gameState', { deck, calledCards, isGameWon, winnerId });

    socket.on('crier:callNextCard', () => {
        if (isGameWon || calledCards.length >= deck.length) return;
        const nextCard = deck[calledCards.length];
        calledCards.push(nextCard);
        io.emit('game:newCard', { newCard: nextCard, allCalledCards: calledCards });
    });

    socket.on('player:declareWinner', () => {
        if (isGameWon) return;
        isGameWon = true;
        winnerId = socket.id;
        io.emit('game:gameOver', { winnerId });
        console.log(`¡Ganador declarado por ${socket.id}!`);
    });

    socket.on('game:playAgain', () => {
        resetGame();
        io.emit('game:gameState', { deck, calledCards, isGameWon, winnerId });
    });

    socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.id}`);
        // Notifica a todos los demás que un usuario se ha desconectado
        io.emit('user:disconnected', { userId: socket.id });
    });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));