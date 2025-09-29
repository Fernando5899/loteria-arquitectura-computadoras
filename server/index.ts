// server/index.ts
import express from 'express';
import * as http from 'http'; // <-- CORRECCIÓN 1
import { Server } from 'socket.io';
import cors from 'cors';

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

// Estado del juego que vivirá en el servidor
let deck = shuffleArray(ALL_WORDS);
let calledCards: string[] = [];
// --- FIN DE LA LÓGICA DEL JUEGO ---2


const app = express();
app.use(cors());

const server = http.createServer(app); // <-- CORRECCIÓN 1

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // <-- CORRECCIÓN 2
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);

    // Cuando un usuario se conecta, le enviamos el estado actual del juego
    socket.emit('game:gameState', { deck, calledCards });

    // Escuchamos el evento del cantador pidiendo la siguiente carta
    socket.on('crier:callNextCard', () => {
        if (calledCards.length < deck.length) {
            const nextCard = deck[calledCards.length];
            calledCards.push(nextCard);

            // Emitimos la nueva carta a TODOS los clientes conectados
            io.emit('game:newCard', { newCard: nextCard, allCalledCards: calledCards });
        }
    });

    socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.id}`); // <-- CORRECCIÓN 3
    });
});

const PORT = 5000; // Puedes usar 5000 o 3001, solo asegúrate de que esté libre
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`); // <-- CORRECCIÓN 4 (usando backticks)
});