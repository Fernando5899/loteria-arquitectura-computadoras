// src/App.tsx
import { useState, useEffect } from "react";
import { socket } from "./services/socket.ts";
import { LotteryBoard } from "./components/LotteryBoard/LotteryBoard.tsx";
import styles from "./App.module.css";
import { CrierView } from "./components/CrierView/CrierView.tsx";
import { GameOverModal } from "./components/GameOverModal/GameOverModal.tsx";

// Para las notificaciones de conexión
type Toast = { id: number; message: string; type: 'connect' | 'disconnect' };

function App() {
    const [markedWords, setMarkedWords] = useState<string[]>([]);
    const [deck, setDeck] = useState<string[]>([]);
    const [calledCards, setCalledCards] = useState<string[]>([]);
    const [playerBoard, setPlayerBoard] = useState<string[]>([]);
    const [notification, setNotification] = useState('');
    const [currentView, setCurrentView] = useState('crier');
    const [gameResult, setGameResult] = useState<{ isOver: boolean; winnerId: string | null }>({ isOver: false, winnerId: null });
    const [toasts, setToasts] = useState<Toast[]>([]); // Estado para los mensajes de conexión

    useEffect(() => {
        const addToast = (message: string, type: Toast['type']) => {
            const id = Date.now();
            setToasts(prev => [...prev, { id, message, type }]);
            setTimeout(() => {
                setToasts(prev => prev.filter(toast => toast.id !== id));
            }, 4000); // El toast desaparece después de 4 segundos
        };

        socket.on('connect', () => addToast(`¡Te has conectado! ID: ${socket.id}`, 'connect'));
        socket.on('disconnect', () => addToast('Te has desconectado del servidor.', 'disconnect'));

        socket.on('game:gameState', (state) => {
            setDeck(state.deck);
            setCalledCards(state.calledCards);
            setPlayerBoard(state.deck.slice(0, 24));
            setMarkedWords([]); // Limpiamos el tablero al recibir nuevo estado
            setGameResult({ isOver: state.isGameWon, winnerId: state.winnerId });
        });

        socket.on('game:newCard', (data) => setCalledCards(data.allCalledCards));
        socket.on('game:gameOver', ({ winnerId }) => setGameResult({ isOver: true, winnerId }));

        // Nuevos eventos para notificaciones de otros jugadores
        socket.on('user:connected', ({ userId }) => addToast(`Jugador conectado: ${userId.slice(0, 5)}...`, 'connect'));
        socket.on('user:disconnected', ({ userId }) => addToast(`Jugador desconectado: ${userId.slice(0, 5)}...`, 'disconnect'));

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('game:gameState');
            socket.off('game:newCard');
            socket.off('game:gameOver');
            socket.off('user:connected');
            socket.off('user:disconnected');
        };
    }, []);

    const handleCardClick = (clickedWord: string) => {
        if (!calledCards.includes(clickedWord)) {
            setNotification(`¡La carta "${clickedWord}" aún no ha salido!`);
            setTimeout(() => setNotification(''), 2500);
            return;
        }
        if (markedWords.includes(clickedWord)) {
            setMarkedWords(markedWords.filter(word => word !== clickedWord));
        } else {
            setMarkedWords([...markedWords, clickedWord]);
        }
    };

    return (
        <div className={styles.appContainer}>
            <div className={styles.toastContainer}>
                {toasts.map(toast => (
                    <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
                        {toast.message}
                    </div>
                ))}
            </div>
            {notification && <div className={styles.notification}>{notification}</div>}
            <h1 className={styles.title}>Lotería de Arquitectura de Computadoras</h1>

            {currentView === 'player' ? (
                <LotteryBoard words={playerBoard} markedWords={markedWords} onCardClick={handleCardClick} />
            ) : (
                <CrierView deck={deck} calledCards={calledCards} />
            )}

            {gameResult.isOver && <GameOverModal winnerId={gameResult.winnerId} />}
        </div>
    );
}

export default App;