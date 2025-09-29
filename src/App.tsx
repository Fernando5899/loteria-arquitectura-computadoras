import { useState } from "react";
import { LotteryBoard } from "./components/LotteryBoard/LotteryBoard.tsx";
import styles from "./App.module.css";

// Datos de prueba - 24 palabras
const mockWords = [
    'CPU', 'ALU', 'RAM', 'ROM', 'Caché', 'GPU', 'Placa Base', 'BIOS/UEFI',
    'Bus de Datos', 'Bus de Direcciones', 'Von Neumann', 'Harvard',
    'ISA', 'CISC', 'RISC', 'Pipeline', 'Multiprocesamiento', 'Multihilo',
    'Kernel', 'Drivers', 'SSD', 'HDD', 'Periférico', 'Puerto I/O'
];

function App() {
    // Inicializar el estado. ``markedWords` es la memoria,
    // y la `setMarkedWords` es la única función que puede modificarla
    const [markedWords, setMarkedWords] = useState<string[]>([]); // Inicialmente, no hay palabras marcadas

    // Crear la función que manejará los clics en las cartas
    const handleCardClick = (clickedWord: string) => {
        // Verificamos si la palabra ya está en nuestra lista de marcadas
        if (markedWords.includes(clickedWord)) {
            // Si ya está, creamos un nuevo array filtrando (quitando) esa palabra
            setMarkedWords(markedWords.filter(word => word !== clickedWord));
        } else {
            // Si no está, creamos un nuevo array con todo lo anterior... y la nueva palabra
            setMarkedWords([...markedWords,clickedWord]);
        }
    };
    return (
      <div className={styles.appContainer}>
          <h1 className={styles.title}>Lotería de Arquitectura de Computadoras</h1>
          {/* Pasamos el estado y la función como props al tablero */}
          <LotteryBoard
              words={mockWords}
              markedWords={markedWords}
              onCardClick={handleCardClick}
          />
      </div>
  )
}
export default App;