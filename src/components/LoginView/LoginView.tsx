// src/components/LoginView/LoginView.tsx
import { useState, useEffect } from 'react';
import { socket } from '../../services/socket';
import styles from './LoginView.module.css';

type LoginViewProps = {
    onJoinAsPlayer: () => void;
};

export const LoginView = ({ onJoinAsPlayer }: LoginViewProps) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Escuchamos por si falla el login para mostrar un error
    useEffect(() => {
        const handleAuthFailed = () => setError('Contraseña incorrecta o rol no disponible.');
        socket.on('crier:authFailed', handleAuthFailed);
        return () => {
            socket.off('crier:authFailed', handleAuthFailed);
        };
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        socket.emit('crier:authenticate', password);
    };

    return (
        <div className={styles.container}>
            <h2>Elige tu Rol</h2>
            <p>Ingresa la contraseña para ser el cantador o únete como jugador.</p>
            <form onSubmit={handleLogin} className={styles.form}>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña del Cantador"
                    className={styles.input}
                />
                <button type="submit" className={styles.button}>Ser Cantador</button>
            </form>
            {error && <p className={styles.error}>{error}</p>}
            <hr className={styles.divider} />
            <button onClick={onJoinAsPlayer} className={`${styles.button} ${styles.playerButton}`}>
                Unirse como Jugador
            </button>
        </div>
    );
};