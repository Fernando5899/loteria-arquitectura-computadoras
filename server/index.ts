// server/index.ts
import express from 'express';
import * as http from 'http'; // <-- CORRECCIÓN 1
import { Server } from 'socket.io';
import cors from 'cors';

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

    socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.id}`); // <-- CORRECCIÓN 3
    });
});

const PORT = 5000; // Puedes usar 5000 o 3001, solo asegúrate de que esté libre
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`); // <-- CORRECCIÓN 4 (usando backticks)
});