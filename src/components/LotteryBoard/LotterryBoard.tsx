import { LotteryCard } from "../LotteryCard/LotteryCard.tsx";
import styles from "./LotteryBoard.module.css";

type LoterryBoardProps = {
    words: string[]; // El tablero recibe un array de strings
};

export const LotterryBoard = ({ words }: LoterryBoardProps) => {
    return (
        <div className={styles.board}>
            {words.map((word) => (
                <LotteryCard key={word} word={word} />
            ))}
        </div>
    );
};