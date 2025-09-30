// src/components/GameOverModal/GameOverModal.tsx
import Confetti from 'react-confetti';
import { socket } from '../../services/socket';
import styles from './GameOverModal.module.css';

// El modal ahora espera el objeto 'winner' y el 'role' del usuario actual
type Player = { id: string; name: string; role: 'crier' | 'player' };
type GameOverModalProps = {
    winner: Player | null;
    role: 'crier' | 'player' | 'login';
};

export const GameOverModal = ({ winner, role }: GameOverModalProps) => {
    // --- AÑADE ESTA LÍNEA PARA DEPURAR ---
    console.log("Mi ID de socket es:", socket.id, "y el ID del ganador es:", winner?.id);

    const didIWin = socket.id === winner?.id;


    const handlePlayAgain = () => {
        socket.emit('game:playAgain');
    };

    // Lógica para determinar el título y el mensaje
    let title = '';
    let message = '';

    if (role === 'crier') {
        title = '¡Juego Terminado!';
        message = `El ganador es ${winner?.name || 'un jugador'}.`;
    } else if (didIWin) {
        title = '🎉 ¡Ganaste! 🎉';
        message = '¡Felicidades, llenaste tu tablero!';
    } else {
        title = '😔 Perdiste';
        message = `El ganador es ${winner?.name || 'otro jugador'}.`;
    }

    return (
        <div className={styles.overlay}>
            {didIWin && <Confetti />}
            <div className={styles.modal}>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.message}>{message}</p>
                {/* El cantador siempre ve el botón de jugar de nuevo */}
                {role === 'crier' && (
                    <button onClick={handlePlayAgain} className={styles.playAgainButton}>
                        Jugar de Nuevo
                    </button>
                )}
            </div>
        </div>
    );
};