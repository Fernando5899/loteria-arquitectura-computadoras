import { useState, useEffect } from "react";
import { LotteryBoard } from "./components/LotteryBoard/LotteryBoard.tsx";
import styles from "./App.module.css";
import { shuffleArray} from "./utils/shuffle.ts";
import { CrierView } from "./components/CrierView/CrierView.tsx";

// Datos de prueba - 24 palabras
const ALL_WORDS = [
    'CPU', 'ALU', 'RAM', 'ROM', 'Caché', 'GPU', 'Placa Base', 'BIOS/UEFI',
    'Bus de Datos', 'Bus de Direcciones', 'Arquitectura Von Neumann', 'Arquitectura Harvard',
    'Set de Instrucciones (ISA)', 'CISC', 'RISC', 'Pipeline (Segmentación)',
    'Multiprocesamiento', 'Multihilo (Multithreading)', 'Sistema Operativo',
    'Kernel (Núcleo)', 'Drivers (Controladores)', 'SSD', 'HDD', 'Periférico',
    'Puerto (I/O Port)', 'Latencia', 'Ancho de Banda', 'Reloj del Sistema (Clock Speed)',
    'Virtualización', 'Firmware'
];

function App() {
    // Inicializar el estado. ``markedWords` es la memoria,
    // y la `setMarkedWords` es la única función que puede modificarla
    const [markedWords, setMarkedWords] = useState<string[]>([]); // Inicialmente, no hay palabras marcadas

    // Nuevos Estados
    const [deck, setDeck] = useState<string[]>([]);
    const [calledCards, setCalledCards] = useState<string[]>([]);
    const [playerBoard, setPlayerBoard] = useState<string[]>([]); // Estado para el tablero del jugador
    const [notification, setNotification] = useState('');
    const [currentView, setCurrentView] = useState('crier');

    // useEffect se ejecuta una sola vez cuando el componente se monta
    useEffect(() => {
        // Barajamos mazo completo de 30 palabras
        const shuffleDeck = shuffleArray(ALL_WORDS);
        setDeck(shuffleDeck);

        // Creamos el tablero del jugador con las primeras 24 cartas del mazo barajado
        setPlayerBoard(shuffleDeck.slice(0, 24));
    }, []);


    // Función para cantar las cartas
    const handleCallNextCard = () => {
        // Si aún quedan cartas en el mazo por cantar
        if (calledCards.length < deck.length) {
            // La siguiente carta es la que está en la posición actual del mazo
            const nextCard = deck[calledCards.length];
            // La añadimos a la lista de cartas cantadas
            setCalledCards([...calledCards, nextCard]);
        }
    };

    // Crear la función que manejará los clics en las cartas
    const handleCardClick = (clickedWord: string) => {
      // Un jugador solo puede marcar una carta si ya ha sido cantada
        if (!calledCards.includes(clickedWord)) {
            setNotification(`No seas tramposo: La carta "${clickedWord}" aún no ha salido.`)

            // Hacemos que la notificación desaparezca después de 2.5 segundos
            setTimeout(() => {
                setNotification('');
            }, 3000);
            return; // Detenemos la ejecución
        }

        // Si la carta es válida, procedemos a marcarla o desmarcarla
        if (markedWords.includes(clickedWord)) {
            setMarkedWords(markedWords.filter(word => word !== clickedWord));
        } else {
            setMarkedWords([...markedWords, clickedWord]);
        }
    };

    return (
      <div className={styles.appContainer}>
          {/* Este div solo se mostrará si 'notificación tiene texto '*/}
          {notification && <div className={styles.notification}>{notification}</div>}

          <h1 className={styles.title}>Lotería de Arquitectura de Computadoras</h1>

          {/* Renderizado condicional de la vista */}
          {currentView === 'player' ? (
              <LotteryBoard
                  words={playerBoard}
                  markedWords={markedWords}
                  onCardClick={handleCardClick}
              />
          ) : (
              <CrierView
                  deck={deck}
                  calledCards={calledCards}
                  onCallNextCard={handleCallNextCard}
              />
          )}
      </div>
  )
}
export default App;