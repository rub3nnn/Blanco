# BLANCO - API Server

Este es el servidor API para el juego BLANCO. Proporciona WebSocket (Socket.IO) y endpoints REST para gestionar las salas de juego y la comunicación en tiempo real.

## 🚀 Instalación

```bash
npm install
```

## 🎮 Ejecución

### Desarrollo (con auto-reload)

```bash
npm run dev
```

### Producción

```bash
npm start
```

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` (opcional):

```env
PORT=8080
NODE_ENV=production
```

### CORS Configuration

Por defecto, el servidor acepta conexiones desde cualquier origen (`*`). En producción, debes cambiar esto en `index.js`:

```javascript
const io = socketIo(server, {
  cors: {
    origin: "https://your-client-domain.com", // Cambia esto a tu dominio del cliente
    methods: ["GET", "POST"],
    credentials: true,
  },
});
```

Y en el middleware de CORS:

```javascript
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://your-client-domain.com");
  // ... resto del código
});
```

## 📡 API Endpoints

### REST Endpoints

#### Health Check

```
GET /api/health
```

Respuesta:

```json
{
  "status": "ok",
  "message": "BLANCO API Server is running",
  "timestamp": "2025-10-31T12:00:00.000Z",
  "activeRooms": 5
}
```

#### Get Room Players

```
GET /api/rooms/:roomCode/players
```

Respuesta:

```json
{
  "players": [
    {
      "userId": "uuid",
      "username": "Player1",
      "role": "leader"
    }
  ]
}
```

### WebSocket Events (Socket.IO)

#### Cliente → Servidor

| Evento       | Parámetros                | Descripción                   |
| ------------ | ------------------------- | ----------------------------- |
| `createRoom` | `{username}`              | Crea una nueva sala           |
| `joinRoom`   | `{code, username}`        | Une a un jugador a una sala   |
| `leaveRoom`  | `{roomCode}`              | Sale de la sala               |
| `kickPlayer` | `{roomCode, player}`      | Expulsa un jugador            |
| `gamestatus` | `{roomCode, gamedata}`    | Actualiza el estado del juego |
| `words`      | `{roomCode, word, order}` | Envía palabras del juego      |

#### Servidor → Cliente

| Evento             | Descripción                        |
| ------------------ | ---------------------------------- |
| `roomCreated`      | Confirmación de creación de sala   |
| `joinedRoom`       | Resultado de unirse a sala         |
| `playerJoinedRoom` | Notifica que un jugador se unió    |
| `playerListUpdate` | Actualiza la lista de jugadores    |
| `exitRoom`         | Notifica que un jugador salió      |
| `kicked`           | Notifica que fuiste expulsado      |
| `game`             | Actualización del estado del juego |

## 🏗️ Estructura

```
server/
├── index.js          # Servidor principal
├── package.json      # Dependencias
└── README.md         # Este archivo
```

## 🔒 Seguridad en Producción

1. **CORS**: Configura orígenes específicos en lugar de `*`
2. **Rate Limiting**: Considera agregar rate limiting para las conexiones
3. **Variables de Entorno**: Usa variables de entorno para configuraciones sensibles
4. **HTTPS**: Asegúrate de usar HTTPS en producción
5. **Validación**: Valida todos los datos de entrada del cliente

## 📦 Dependencias

- `express`: Framework web
- `socket.io`: WebSocket para comunicación en tiempo real
- `uuid`: Generación de IDs únicos
- `events`: Gestión de eventos
- `cors`: Manejo de CORS

## 🐛 Debugging

El servidor imprime mensajes de log en la consola:

- Creación de salas
- Jugadores uniéndose/saliendo
- Palabras enviadas
- Desconexiones

## 📝 Notas

- El servidor NO sirve archivos estáticos
- Los clientes deben estar desplegados por separado
- Asegúrate de configurar CORS correctamente para producción
