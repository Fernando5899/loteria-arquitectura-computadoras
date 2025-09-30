// src/App.tsx
import { useState, useEffect } from "react";
import { socket } from "./services/socket.ts";
import { LotteryBoard } from "./components/LotteryBoard/LotteryBoard.tsx";
import styles from "./App.module.css";
import { CrierView } from "./components/CrierView/CrierView.tsx";
import { GameOverModal } from "./components/GameOverModal/GameOverModal.tsx";
import { LoginView } from "./components/LoginView/LoginView.tsx";

// 1. DEFINIMOS EL TIPO 'PLAYER' AQUÍ
type Player = { id: string; name: string; role: 'crier' | 'player' };
type Toast = { id: number; message: string; type: 'connect' | 'disconnect' };

function App() {
    // Estados del juego
    const [markedWords, setMarkedWords] = useState<string[]>([]);
    const [deck, setDeck] = useState<string[]>([]);
    const [calledCards, setCalledCards] = useState<string[]>([]);
    const [playerBoard, setPlayerBoard] = useState<string[]>([]);
    const [notification, setNotification] = useState('');
    const [currentView, setCurrentView] = useState<'login' | 'crier' | 'player'>('login');
    const [gameResult, setGameResult] = useState<{ isOver: boolean; winner: Player | null }>({
        isOver: false,
        winner: null,
    });
    const [toasts, setToasts] = useState<Toast[]>([]);

    // Estado para el tema (oscuro/claro)
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    // Función para regresar al inicio
    const handleExitToLogin = () => {
        setCurrentView('login');
    };

    // Efecto que aplica el tema al HTML y lo guarda
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Efecto para toda la lógica de sockets
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
            // 2. CORRECCIÓN AQUÍ: Usamos 'winner' en lugar de 'winnerId'
            setGameResult({ isOver: state.isGameWon, winner: state.winner });
        });

        socket.on('game:newCard', (data) => setCalledCards(data.allCalledCards));

        socket.on('game:gameOver', ({ winner }) => {
            setGameResult({ isOver: true, winner: winner });
        });

        socket.on('user:connected', ({ name }) => addToast(`Jugador '${name}' se ha unido.`, 'connect'));
        socket.on('user:disconnected', ({ name }) => addToast(`Jugador '${name}' se ha ido.`, 'disconnect'));
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

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

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

            <div className={styles.header}>
                {(currentView === 'player' || currentView === 'crier') && (
                    <button onClick={handleExitToLogin} className={styles.exitButton}>
                        Salir
                    </button>
                )}
                <h1 className={styles.title}>Lotería de Arquitectura de Computadoras</h1>
                <button onClick={toggleTheme} className={styles.themeToggle}>
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
            </div>

            {renderView()}

            {gameResult.isOver && <GameOverModal winner={gameResult.winner} role={currentView} />}
        </div>
    );
}

export default App;