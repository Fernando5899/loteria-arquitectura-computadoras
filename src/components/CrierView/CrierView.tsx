import styles from './CrierView.module.css'
import { socket } from "../../services/socket.ts";

type CrierViewProps = {
    deck: string[];
    calledCards: string[];
};

export const CrierView = ({ deck, calledCards}: CrierViewProps) => {
    const currentCard = calledCards.length > 0 ? calledCards[calledCards.length - 1] : '¡Presiona para empezar!';
    const remainingCards = deck.length - calledCards.length;

    const handleCallNextCard = () => {
        socket.emit('crier:callNextCard') // Emitimos el evento al servidor
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainCardWrapper}>
                <p className={styles.mainCardLabel}>Carta Actual</p>
                <div className={styles.mainCard}>{currentCard}</div>
            </div>

            <button
                onClick={handleCallNextCard}
                disabled={remainingCards <= 0}
                className={styles.nextButton}
            >
                {calledCards.length === 0 ? 'Empezar Juego' : 'Siguiente Carta'}
            </button>

            <p className={styles.remaining}>Cartas restantes: {remainingCards}</p>

            <div className={styles.history}>
                <p className={styles.historyTitle}>Cartas Jugadas:</p>
                <div className={styles.historyGrid}>
                    {calledCards.map(card => (
                        <div key={card} className={styles.historyCard}>{card}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};