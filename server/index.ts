// server/index.ts
import express from 'express';
import * as http from 'http';
import { Server, Socket } from 'socket.io'; // Asegúrate de importar Socket
import cors from 'cors';

// --- CONSTANTES Y TIPOS ---
const ALL_WORDS = [
    'CPU', 'ALU', 'RAM', 'ROM', 'Caché', 'GPU', 'Placa Base', 'BIOS/UEFI',
    'Bus de Datos', 'Bus de Direcciones', 'Arquitectura Von Neumann', 'Arquitectura Harvard',
    'Set de Instrucciones (ISA)', 'CISC', 'RISC', 'Pipeline (Segmentación)',
    'Multiprocesamiento', 'Multihilo (Multithreading)', 'Sistema Operativo',
    'Kernel (Núcleo)', 'Drivers (Controladores)', 'SSD', 'HDD', 'Periférico',
    'Puerto (I/O Port)', 'Latencia', 'Ancho de Banda', 'Reloj del Sistema (Clock Speed)',
    'Virtualización', 'Firmware'
];
const MAX_PLAYERS = 9;
const CRIER_PASSWORD = 'PollitoRojo'; // La contraseña que pusimos de ejemplo

type Player = { id: string; role: 'crier' | 'player' };

// --- ESTADO DEL JUEGO (VIVE EN EL SERVIDOR) ---
let deck: string[] = [];
let calledCards: string[] = [];
let isGameWon = false;
let winnerId: string | null = null;
let players: Player[] = [];

// --- FUNCIONES DE AYUDA ---
function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function resetGame() {
    console.log('🔄 Reseteando el juego...');
    deck = shuffleArray(ALL_WORDS);
    calledCards = [];
    isGameWon = false;
    winnerId = null;
}

// --- INICIALIZACIÓN DEL SERVIDOR ---
const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://loteria-arquitectura-computadoras.vercel.app"],
        methods: ["GET", "POST"]
    }
});

// Inicializa el juego por primera vez cuando arranca el servidor
resetGame();

// --- LÓGICA DE CONEXIÓN (UN SOLO BLOQUE) ---
io.on('connection', (socket: Socket) => {

    // 1. Verificar si la sala está llena
    if (players.length >= MAX_PLAYERS) {
        socket.emit('server:roomFull');
        socket.disconnect(true);
        console.log(`Conexión rechazada para ${socket.id}, sala llena.`);
        return;
    }

    console.log(`Usuario conectado: ${socket.id}`);

    // 2. Notificar a los demás que alguien entró
    socket.broadcast.emit('user:connected', { userId: socket.id });

    // 3. El nuevo usuario se añade a la lista como jugador por defecto
    const newPlayer: Player = { id: socket.id, role: 'player' };
    players.push(newPlayer);

    // 4. Enviar el estado actual del juego al nuevo usuario
    socket.emit('game:gameState', { deck, calledCards, isGameWon, winnerId });
    io.emit('game:playersUpdate', players); // Actualizar la lista de jugadores para todos

    // 5. Escuchar por intentos de autenticación como Cantador
    socket.on('crier:authenticate', (password: string) => {
        const crierExists = players.some(p => p.role === 'crier');
        if (!crierExists && password === CRIER_PASSWORD) {
            // Si la contraseña es correcta y no hay cantador, actualizamos su rol
            const playerIndex = players.findIndex(p => p.id === socket.id);
            if (playerIndex !== -1) {
                players[playerIndex].role = 'crier';
                socket.emit('crier:authSuccess');
                io.emit('game:playersUpdate', players);
                console.log(`${socket.id} ha sido asignado como Cantador.`);
            }
        } else {
            socket.emit('crier:authFailed');
        }
    });

    // 6. Escuchar el resto de eventos del juego
    socket.on('crier:callNextCard', () => {
        if (isGameWon || calledCards.length >= deck.length) return;
        const player = players.find(p => p.id === socket.id);
        if (player?.role !== 'crier') return; // Solo el cantador puede llamar cartas

        const nextCard = deck[calledCards.length];
        calledCards.push(nextCard);
        io.emit('game:newCard', { newCard: nextCard, allCalledCards: calledCards });
    });

    socket.on('player:declareWinner', () => {
        if (isGameWon) return;
        isGameWon = true;
        winnerId = socket.id;
        io.emit('game:gameOver', { winnerId });
        console.log(`🏆 ¡Ganador declarado por ${socket.id}!`);
    });

    socket.on('game:playAgain', () => {
        resetGame();
        io.emit('game:gameState', { deck, calledCards, isGameWon, winnerId });
    });

    socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.id}`);
        players = players.filter(player => player.id !== socket.id);
        io.emit('user:disconnected', { userId: socket.id });
        io.emit('game:playersUpdate', players);
    });
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});