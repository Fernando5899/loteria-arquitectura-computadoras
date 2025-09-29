import styles from './LotteryCard.module.css';

// Definimos los tipos de las props que nuestro componente recibirá
type LotteryCardProps = {
    word: string;
    isMarked: boolean; // Prop nueva
    onClick: (word: string) => void; // Prop nueva
};

export const LotteryCard = ({ word, isMarked, onClick }: LotteryCardProps) => {
    const cardClasses = `${styles.card} ${isMarked ? styles.marked : ''}`;
    return (
        // Al hacer clic en este div, llamamos a la función onClick
        // pasándole nuestra propia palabra
        <div className={cardClasses} onClick={() => onClick(word)}>
            <span className={styles.word}>{word}</span>
        </div>
    );
};