import ReactConfetti from "react-confetti";
import { socket } from "../../services/socket.ts";
import styles from "./GameOverModal.module.css";

type GameOverModalProps = {
    winnerId: string | null;
};

export const GameOverModal = ({ winnerId }: GameOverModalProps) => {
    const didIWin = socket.id === winnerId;

    const handlePlayAgain = () => {
        socket.emit('game:playAgain');
    };

    return (
        <div className={styles.overlay}>
            {didIWin && <ReactConfetti />}
            <div className={styles.modal}>
                <h2 className={styles.title}>{didIWin ? '🎉 ¡Ganaste! 🎉' : '😔 Perdiste'}</h2>
                <p className={styles.message}>
                    {didIWin
                    ? 'Felicidades, Ganaste!'
                    : `El ganador es el jugador con ID: ${winnerId}`}
                </p>
                <button onClick={handlePlayAgain} className={styles.playAgainButton}>
                    Jugar de Nuevo
                </button>
            </div>
        </div>
    );
};