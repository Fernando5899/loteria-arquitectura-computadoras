import { LotteryCard } from "../LotteryCard/LotteryCard.tsx";
import styles from "./LotteryBoard.module.css";

type LotteryBoardProps = {
    words: string[]; // El tablero recibe un array de strings
    markedWords: string[]; // Prop nueva
    onCardClick: (word: string) => void; // Prop nueva
};

export const LotteryBoard = ({ words, markedWords, onCardClick }: LotteryBoardProps) => {
    return (
        <div className={styles.board}>
            {words.map((word) => (
                <LotteryCard
                    key={word}
                    word={word}
                    // Pasamos la información a cada carta
                    isMarked={markedWords.includes(word)}
                    onClick={onCardClick}
                />
            ))}
        </div>
    );
};