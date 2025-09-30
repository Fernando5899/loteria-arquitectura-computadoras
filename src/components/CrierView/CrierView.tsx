import styles from './CrierView.module.css'
import { socket } from "../../services/socket.ts";

type CrierViewProps = {
    deck: string[];
    calledCards: string[];
};

export const CrierView = ({ deck, calledCards}: CrierViewProps) => {
    const currentCard = calledCards.length > 0 ? calledCards[calledCards.length - 1] : '¡Presiona para empezar!';
    const remainingCards = deck.length - calledCards.length;

    const handleNextCard = () => {
        socket.emit('crier:callNextCard') // Emitimos el evento al servidor
    };

    return (
        <div className={styles.container}>
            {/* --- COLUMNA IZQUIERDA: CONTROLES PRINCIPALES --- */}
            <div className={styles.mainControls}>
                <div className={styles.mainCardWrapper}>
                    <p className={styles.mainCardLabel}>Carta Actual</p>
                    <div className={styles.mainCard}>{currentCard}</div>
                </div>
                <button
                    onClick={handleNextCard}
                    disabled={remainingCards <= 0}
                    className={styles.nextButton}
                >
                    {calledCards.length === 0 ? 'Empezar Juego' : 'Siguiente Carta'}
                </button>
            </div>

            {/* --- COLUMNA DERECHA: INFORMACIÓN DEL JUEGO --- */}
            <div className={styles.gameInfo}>
                <div className={styles.stats}>
                    <div className={styles.statBox}>
                        <span className={styles.statValue}>{calledCards.length}</span>
                        <span className={styles.statLabel}>Cantadas</span>
                    </div>
                    <div className={styles.statBox}>
                        <span className={styles.statValue}>{remainingCards}</span>
                        <span className={styles.statLabel}>Restantes</span>
                    </div>
                </div>
                <div className={styles.history}>
                    <p className={styles.historyTitle}>Historial</p>
                    <div className={styles.historyGrid}>
                        {calledCards.slice().reverse().map(card => (
                            <div key={card} className={styles.historyCard}>{card}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};