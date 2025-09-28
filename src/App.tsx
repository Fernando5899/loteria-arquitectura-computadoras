import { LotterryBoard } from "./components/LotteryBoard/LotterryBoard.tsx";
import styles from "./App.module.css";

// Datos de prueba - 24 palabras
const mockWords = [
    'CPU', 'ALU', 'RAM', 'ROM', 'Caché', 'GPU', 'Placa Base', 'BIOS/UEFI',
    'Bus de Datos', 'Bus de Direcciones', 'Von Neumann', 'Harvard',
    'ISA', 'CISC', 'RISC', 'Pipeline', 'Multiprocesamiento', 'Multihilo',
    'Kernel', 'Drivers', 'SSD', 'HDD', 'Periférico', 'Puerto I/O'
];

function App() {
  return (
      <div className={styles.appContainer}>
          <h1 className={styles.title}>Lotería de Arquitectura de Computadoras</h1>
          <LotterryBoard words={mockWords} />
      </div>
  )
}
export default App;