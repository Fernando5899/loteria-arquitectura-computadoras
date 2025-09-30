// src/components/LoginView/LoginView.tsx
import { useState, useEffect } from 'react';
import { socket } from '../../services/socket';
import styles from './LoginView.module.css';

type LoginViewProps = {
    onJoinAsPlayer: () => void;
};

export const LoginView = ({ onJoinAsPlayer }: LoginViewProps) => {
    const [password, setPassword] = useState('');
    // 1. Añadimos estado para el nombre de usuario
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const handleAuthFailed = () => setError('Contraseña incorrecta o rol no disponible.');
        socket.on('crier:authFailed', handleAuthFailed);
        return () => {
            socket.off('crier:authFailed', handleAuthFailed);
        };
    }, []);

    const handleCrierLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        socket.emit('crier:authenticate', password);
    };

    // 2. Nueva función para manejar el ingreso como jugador
    const handlePlayerJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) {
            setError('Por favor, ingresa un nombre de usuario.');
            return;
        }
        socket.emit('player:join', { name: username });
        onJoinAsPlayer(); // Le avisamos a App.tsx que cambie la vista
    };

    return (
        <div className={styles.container}>
            <h2>Elige tu Rol</h2>

            {/* Formulario para el Cantador */}
            <form onSubmit={handleCrierLogin} className={styles.form}>
                <p>Ingresa la contraseña para ser el cantador.</p>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña del Cantador"
                    className={styles.input}
                />
                <button type="submit" className={styles.button}>Ser Cantador</button>
            </form>

            <hr className={styles.divider} />

            {/* 3. Nuevo formulario para el Jugador */}
            <form onSubmit={handlePlayerJoin} className={styles.form}>
                <p>O ingresa tu nombre para unirte como jugador.</p>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Tu Nombre de Usuario"
                    className={styles.input}
                />
                <button type="submit" className={`${styles.button} ${styles.playerButton}`}>
                    Unirse como Jugador
                </button>
            </form>
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
};