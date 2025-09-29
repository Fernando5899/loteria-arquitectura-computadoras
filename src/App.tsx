// src/App.tsx
import { useState, useEffect } from "react";
import { socket } from "./services/socket.ts";
import { LotteryBoard } from "./components/LotteryBoard/LotteryBoard.tsx";
import styles from "./App.module.css";
import { CrierView } from "./components/CrierView/CrierView.tsx";
import { GameOverModal } from "./components/GameOverModal/GameOverModal.tsx";
import { LoginView } from "./components/LoginView/LoginView.tsx";

type Toast = { id: number; message: string; type: 'connect' | 'disconnect' };

function App() {
    const [markedWords, setMarkedWords] = useState<string[]>([]);
    const [deck, setDeck] = useState<string[]>([]);
    const [calledCards, setCalledCards] = useState<string[]>([]);
    const [playerBoard, setPlayerBoard] = useState<string[]>([]);
    const [notification, setNotification] = useState('');
    const [currentView, setCurrentView] = useState<'login' | 'crier' | 'player'>('login');
    const [gameResult, setGameResult] = useState<{ isOver: boolean; winnerId: string | null }>({ isOver: false, winnerId: null });
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
        const addToast = (message: string, type: Toast['type']) => {
            const id = Date.now();
            setToasts(prev => [...prev, { id, message, type }]);
            setTimeout(() => {
                setToasts(prev => prev.filter(toast => toast.id !== id));
            }, 4000);
        };

        socket.on('connect', () => addToast(`¡Te has conectado!`, 'connect'));
        socket.on('disconnect', () => addToast('Te has desconectado.', 'disconnect'));
        socket.on('game:gameState', (state) => {
            setDeck(state.deck);
            setCalledCards(state.calledCards);
            setPlayerBoard(state.deck.slice(0, 24));
            setMarkedWords([]);
            setGameResult({ isOver: state.isGameWon, winnerId: state.winnerId });
        });
        socket.on('game:newCard', (data) => setCalledCards(data.allCalledCards));
        socket.on('game:gameOver', ({ winnerId }) => setGameResult({ isOver: true, winnerId }));
        socket.on('user:connected', ({ userId }) => addToast(`Jugador se unió: ${userId.slice(0,5)}...`, 'connect'));
        socket.on('user:disconnected', ({ userId }) => addToast(`Jugador se fue: ${userId.slice(0,5)}...`, 'disconnect'));
        socket.on('crier:authSuccess', () => setCurrentView('crier'));
        socket.on('crier:authFailed', () => alert('Contraseña incorrecta o el rol de cantador ya está ocupado.'));
        socket.on('server:roomFull', () => alert('La sala está llena. No puedes unirte.'));

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('game:gameState');
            socket.off('game:newCard');
            socket.off('game:gameOver');
            socket.off('user:connected');
            socket.off('user:disconnected');
            socket.off('crier:authSuccess');
            socket.off('crier:authFailed');
            socket.off('server:roomFull');
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

    const handleJoinAsPlayer = () => {
        setCurrentView('player');
    };

    const renderView = () => {
        switch (currentView) {
            case 'crier':
                return <CrierView deck={deck} calledCards={calledCards} />;
            case 'player':
                return <LotteryBoard words={playerBoard} markedWords={markedWords} onCardClick={handleCardClick} />;
            case 'login':
            default:
                return <LoginView onJoinAsPlayer={handleJoinAsPlayer} />;
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

            {renderView()}

            {gameResult.isOver && <GameOverModal winnerId={gameResult.winnerId} />}
        </div>
    );
}

export default App;