import styles from './LotteryCard.module.css';

// Definimos los tipos de las props que nuestro componente recibirá
type LotteryCardProps = {
    word: string;
};

export const LotteryCard = ({ word }: LotteryCardProps) => {
    return (
        <div className={styles.card}>
        <span className={styles.word}>{word}</span>
            </div>
    );
};