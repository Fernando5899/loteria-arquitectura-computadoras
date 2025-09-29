export const checkWin = (board: string[], marked: string[]): boolean => {
    // Si el tablero no tiene 24 cartas, no se puede ganar (es una guarda de seguridad)
    if (board.length !== 24) {
        return false;
    }

    // La condición de victoria es que todas las cartas del tablero estén marcadas.
    // Simplemente, comparamos la cantidad de cartas marcadas con las del tablero.
    return marked.length === board.length;
};