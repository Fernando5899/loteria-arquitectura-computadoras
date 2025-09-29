import { useState, useEffect } from "react";
import { socket } from "./services/socket.ts";
import { LotteryBoard } from "./components/LotteryBoard/LotteryBoard.tsx";
import styles from "./App.module.css";
import { CrierView } from "./components/CrierView/CrierView.tsx";


function App() {
    // Inicializar el estado. ``markedWords` es la memoria,
    // y la `setMarkedWords` es la única función que puede modificarla
    const [markedWords, setMarkedWords] = useState<string[]>([]); // Inicialmente, no hay palabras marcadas
    const [deck, setDeck] = useState<string[]>([]);
    const [calledCards, setCalledCards] = useState<string[]>([]);
    const [playerBoard, setPlayerBoard] = useState<string[]>([]); // Estado para el tablero del jugador
    const [notification, setNotification] = useState('');
    const [currentView, setCurrentView] = useState('crier');

    // useEffect se ejecuta una sola vez cuando el componente se monta
    useEffect(() => {
        // Lógica de los sockets
        socket.on('connect', () => console.log(`Conectado: ${socket.id}`));
        socket.on('disconnect', () => console.log(`Desconectado: ${socket.id}`));

        //El servidor nos envía el estado del juego
        socket.on('game:gameState', (state) => {
            setDeck(state.deck);
            setCalledCards(state.calledCards);
            // Creamos el tablero del jugador con el mazo que nos dio el servidor
            setPlayerBoard(state.deck.slice(0, 24));
        });

        // El servidor nos anuncia una nueva carta cantada
        socket.on('game:newCard', (data) => {
            setCalledCards(data.allCalledCards);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('game:gameState');
            socket.off('game:newCard');
        };
    }, []);

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
              />
          )}
      </div>
  )
}
export default App;