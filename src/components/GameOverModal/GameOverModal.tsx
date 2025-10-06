// src/components/GameOverModal/GameOverModal.tsx
import { useEffect } from 'react';
import Confetti from 'react-confetti';
import { socket } from '../../services/socket';
import styles from './GameOverModal.module.css';

type Player = { id: string; name: string; role: 'crier' | 'player' };
type GameOverModalProps = {
    winner: Player | null;
    role: 'crier' | 'player' | 'login';
    isMuted: boolean; // Recibimos el estado de silencio
};

export const GameOverModal = ({ winner, role, isMuted }: GameOverModalProps) => {
    const didIWin = socket.id === winner?.id;

    // Efecto para el sonido de victoria
    useEffect(() => {
        // Si yo gané y el audio no está silenciado...
        if (didIWin && !isMuted) {
            const victoryAudio = new Audio('/audio/victory-sound.ogg'); // Usamos .ogg
            victoryAudio.volume = 0.3;
            victoryAudio.play();
        }
    }, []); // El array vacío asegura que se ejecute solo una vez

    const handlePlayAgain = () => {
        socket.emit('game:playAgain');
    };

    let title = '';
    let message = '';

    if (role === 'crier') {
        title = '¡Juego Terminado!';
        message = `El ganador es ${winner?.name || 'un jugador'}.`;
    } else if (didIWin) {
        title = '¡Ganaste!';
        message = '¡Felicidades, llenaste tu tablero!';
    } else {
        title = 'Perdiste';
        message = `El ganador es ${winner?.name || 'otro jugador'}.`;
    }

    return (
        <div className={styles.overlay}>
            {didIWin && <Confetti />}
            <div className={styles.modal}>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.message}>{message}</p>
                {role === 'crier' && (
                    <button onClick={handlePlayAgain} className={styles.playAgainButton}>
                        Jugar de Nuevo
                    </button>
                )}
            </div>
        </div>
    );
};