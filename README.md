# 🎲 Lotería — Arquitectura de Computadoras

¡Una versión interactiva y moderna de la clásica Lotería, enfocada en términos de Arquitectura de Computadoras! Ideal para clases, prácticas o demostraciones. Frontend con Vite + React + TypeScript y backend en Node + Socket.IO para sincronizar partidas en tiempo real.

![Portada](public/Loteria.png)

Resumen rápido
- Frontend: [`src/App.tsx`](src/App.tsx) — componente principal y lógica UI.
- Socket cliente: [`src/services/socket.ts`](src/services/socket.ts) — punto de conexión al servidor.
- Backend: [`server/index.ts`](server/index.ts) — reglas del juego y eventos de Socket.IO.
- Scripts y configuración: [`package.json`](package.json), [`server/package.json`](server/package.json), [`vite.config.ts`](vite.config.ts).

Por qué ver este proyecto
- Interacción en tiempo real con WebSockets.
- UI responsive, tema oscuro/claro y animaciones llamativas.
- Código TypeScript con reglas estrictas: [`tsconfig.app.json`](tsconfig.app.json) y ESLint (`eslint.config.js`).

Instalación (rápida)
1. Clona el repo y desde la raíz:
   pnpm install
2. Instala dependencias del servidor:
   cd server && pnpm install

Desarrollo
- Frontend:
  pnpm run dev
- Backend (desde server/):
  cd server && pnpm run dev

Build / Producción
- Frontend:
  pnpm run build
- Backend:
  Ejecutar con Node (transpilar TypeScript o usar ts-node). Atención a CORS y variables de entorno.

Variables importantes
- VITE_SERVER_URL — usado por [`src/services/socket.ts`](src/services/socket.ts). Por defecto: `http://localhost:5000`.
- CRIER_PASSWORD — actualmente hardcodeada como [`CRIER_PASSWORD`](server/index.ts). Mover a variables de entorno en producción.

Eventos WebSocket (resumen)
- Emite el servidor ([`server/index.ts`](server/index.ts)):
  - `game:gameState` — estado (mazo, cartas llamadas, ganador).
  - `game:newCard` — nueva carta anunciada.
  - `game:gameOver` — juego finalizado.
  - `game:playersUpdate` — lista de jugadores y roles.
  - `user:connected` / `user:disconnected` — notificaciones.
  - `server:roomFull` — sala llena.
  - `crier:authSuccess` / `crier:authFailed` — autenticación de cantador.
- Cliente: ver suscriptores en [`src/App.tsx`](src/App.tsx).

Funciones clave (backend)
- Mezcla y reset del mazo: [`shuffleArray`](server/index.ts) y [`resetGame`](server/index.ts).
- Lógica de cantador y validaciones en [`server/index.ts`](server/index.ts).

Buenas prácticas y recomendaciones
- Seguridad: No publicar contraseñas en código. Mover [`CRIER_PASSWORD`](server/index.ts) a variables de entorno.
- CORS: Ajustar orígenes en [`server/index.ts`](server/index.ts) para producción.
- Tests: Añadir pruebas unitarias para la lógica de juego y pruebas e2e para la experiencia multiusuario.
- QA: Mantener reglas de lint y TypeScript estrictas (ver [`eslint.config.js`](eslint.config.js) y [`tsconfig.app.json`](tsconfig.app.json)).

Ideas para hacerlo aún más llamativo
- Añadir una landing page con GIF/demo y botón “Jugar ahora”.
- Badges (build / lint / coverage) y screenshots en la parte superior del README.
- Deploy automático del frontend (Vercel/Netlify) y backend (Heroku/Render/Vercel Serverless).

Contribuir
1. Haz fork → crea branch con nombre claro (feature/bugfix).
2. PR con descripción y pasos para probar.
3. Mantén commits pequeños y claros.

Licencia
- Añadir `LICENSE` según la política del equipo (MIT/Apache/…), por defecto incluir una licencia permisiva.

Contacto
- ¿Un bug o mejora? Abre un issue en el repositorio.

Créditos
- Diseño UI y lógica por el equipo del proyecto — revisa el código en [`src/`](src) y el servidor en [`server/index.ts`](server/index.ts).

¡Haz que brille en tu README con badges, GIFs y una demo en vivo para atraer más ojos! 🎉