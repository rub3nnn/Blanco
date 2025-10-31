# 🎮 BLANCO - Milmarcos Edition

<div align="center">

![blancophone](https://github.com/user-attachments/assets/46a3d58b-0986-4b89-8e0b-71f6d6b78726)

**Un juego de deducción social multijugador en tiempo real**

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

[🎮 **JUGAR AHORA**](https://blanco.vercel.app) | [📖 Documentación](#-instalación-y-configuración) | [🐛 Reportar Bug](https://github.com/rub3nnn/Blanco/issues)

</div>

---

## 🎮 Juega Ya

**¿Quieres jugar sin instalar nada?**

👉 **[blanco.vercel.app](https://blanco.vercel.app)** 👈

¡Abre el enlace en tu navegador y empieza a jugar al instante!

---

## 📖 Descripción

**BLANCO** es un emocionante juego de deducción social multijugador donde los jugadores deben identificar quién es el "blanco" del grupo mientras este intenta pasar desapercibido. Perfectamente optimizado para dispositivos móviles, este juego combina estrategia, engaño y comunicación en una experiencia única.

### 🎯 ¿Cómo se juega?

#### **Objetivo del Juego**

- **Jugadores Normales**: Reciben una palabra secreta y deben identificar al/los "blanco(s)" sin revelar la palabra.
- **El/Los Blanco(s)**: NO reciben ninguna palabra, solo ven "BLANCO". Deben pasar desapercibidos escuchando las pistas de los demás.

#### **Desarrollo del Juego**

1. **Preparación**

   - Un jugador crea una partida y comparte el código con los demás
   - Se necesitan mínimo 3 jugadores para comenzar
   - El anfitrión configura el número de "blancos" en la partida

2. **Rondas de Juego**

   - En cada ronda, todos los jugadores dicen UNA palabra relacionada con la palabra secreta
   - Los jugadores normales dan pistas sutiles sin ser demasiado obvios
   - Los blancos deben decir algo coherente basándose en lo que escuchan
   - Después de cada ronda, se vota para expulsar a un jugador sospechoso

3. **Victoria**
   - **Ganan los Jugadores Normales**: Si identifican y expulsan a todos los blancos
   - **Ganan los Blancos**: Si sobreviven hasta el final o si los jugadores normales se eliminan entre ellos

#### **Estrategias**

- **Para Jugadores Normales**: Den pistas específicas pero no obvias. Observen respuestas vagas o genéricas.
- **Para los Blancos**: Escuchen atentamente. Sean creativos pero no demasiado específicos. Mantengan la calma.

---

## ✨ Características

- 🌐 **Multijugador en tiempo real** usando WebSockets (Socket.IO)
- 📱 **Diseño responsive** optimizado para móviles
- 🎲 **Sistema de salas** con códigos únicos de 4 dígitos
- 📊 **QR Code** para compartir salas fácilmente
- 👥 **Gestión de jugadores** (expulsar, líder de sala)
- ⚙️ **Configuración personalizable** de partidas
- 🎨 **Interfaz minimalista** y moderna
- 🔄 **Actualizaciones en tiempo real** del estado del juego
- 💾 **Persistencia de nombre** de usuario

---

## 🏗️ Estructura del Proyecto

```
BLANCO/
│
├── server/                 # Backend API (Node.js + Express + Socket.IO)
│   ├── index.js           # Servidor principal con lógica del juego
│   ├── package.json       # Dependencias del servidor
│   └── README.md          # Documentación del servidor
│
├── client/                # Frontend (Vanilla JavaScript - Estático)
│   ├── index.html         # Página principal
│   ├── config.js          # Configuración de conexión al servidor
│   ├── README.md          # Documentación del cliente
│   ├── assets/
│   │   ├── css/
│   │   │   └── styles.css # Estilos de la aplicación
│   │   ├── js/
│   │   │   └── index.js   # Lógica del cliente
│   │   └── img/           # Recursos gráficos
│   └── api/               # Librerías de terceros
│       ├── jquery.min.js
│       ├── qrcode.js
│       └── qrcode.min.js
│
└── README.md              # Este archivo
```

## 🎯 Arquitectura

Este proyecto utiliza una arquitectura **cliente-servidor desacoplada**:

- **Servidor**: API pura (WebSocket + REST) sin servir archivos estáticos
- **Cliente**: Aplicación estática que puede desplegarse independientemente
- **Comunicación**: Socket.IO para tiempo real + REST para consultas

### Ventajas de esta Arquitectura

✅ **Escalabilidad**: Cliente y servidor pueden escalar independientemente  
✅ **Flexibilidad**: Despliega el cliente en CDN y el servidor en servidores especializados  
✅ **Desarrollo**: Equipos frontend y backend pueden trabajar independientemente  
✅ **Costos**: Hosting estático es más barato que hosting de Node.js

---

## 🚀 Instalación y Configuración

### **Prerrequisitos**

- [Node.js](https://nodejs.org/) (versión 14 o superior) - Solo para el servidor
- [npm](https://www.npmjs.com/) (incluido con Node.js) - Solo para el servidor

### **Instalación del Servidor (Backend)**

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/rub3nnn/Blanco.git
   cd Blanco
   ```

2. **Navegar al directorio del servidor**

   ```bash
   cd server
   ```

3. **Instalar dependencias**

   ```bash
   npm install
   ```

4. **Configurar CORS (Producción)**

   Edita `server/index.js` y cambia el origen de CORS a tu dominio del cliente:

   ```javascript
   const io = socketIo(server, {
     cors: {
       origin: "https://tu-cliente.com", // Cambia esto
       methods: ["GET", "POST"],
       credentials: true,
     },
   });
   ```

### **Configuración del Cliente (Frontend)**

1. **Editar la configuración de conexión**

   Abre `client/config.js` y actualiza la URL del servidor:

   ```javascript
   const CONFIG = {
     SERVER_URL: "https://tu-servidor.com", // URL de tu servidor API
     SOCKET_OPTIONS: {
       reconnection: true,
       reconnectionDelay: 1000,
       reconnectionDelayMax: 5000,
       reconnectionAttempts: 5,
     },
   };
   ```

2. **El cliente NO requiere instalación**

   Es 100% HTML, CSS y JavaScript vanilla. **¡No requiere npm install ni build!** 🎉

---

## 🎮 Ejecutar la Aplicación

### **Servidor**

#### Modo Desarrollo (con auto-reload)

```bash
cd server
npm run dev
```

#### Modo Producción

```bash
cd server
npm start
```

El servidor API se iniciará en `http://localhost:8080` (o el puerto especificado en `PORT`).

### **Cliente**

El cliente es una aplicación estática. Opciones para ejecutarlo:

#### Opción 1: Servidor de desarrollo simple

```bash
# Con Python
cd client
python -m http.server 3000

# Con Node.js
cd client
npx http-server -p 3000

# Con PHP
cd client
php -S localhost:3000
```

Luego abre `http://localhost:3000` en tu navegador.

#### Opción 2: Desplegar en hosting estático

El cliente puede desplegarse en:

- **Vercel**: Arrastra la carpeta `client`
- **Netlify**: Arrastra la carpeta `client`
- **GitHub Pages**: Sube el contenido de `client`
- **Cualquier CDN o hosting de archivos estáticos**

---

## 🌐 Despliegue en Producción

### **Desplegar el Servidor**

1. **Recomendaciones de hosting para el servidor:**

   - Railway
   - Render
   - Heroku
   - DigitalOcean
   - AWS/GCP/Azure

2. **Configurar variables de entorno:**

   ```bash
   PORT=8080
   NODE_ENV=production
   ```

3. **Actualizar CORS** en `server/index.js` con tu dominio del cliente

### **Desplegar el Cliente**

1. **Actualizar `client/config.js`** con la URL del servidor desplegado

2. **Recomendaciones de hosting para el cliente:**

   - Vercel (Recomendado)
   - Netlify (Recomendado)
   - GitHub Pages
   - Cloudflare Pages
   - AWS S3 + CloudFront
   - Cualquier servidor web (Apache, Nginx)

3. **Subir los archivos** de la carpeta `client`

### **IMPORTANTE: Orden de Despliegue**

1. ✅ Despliega el **servidor** primero
2. ✅ Obtén la URL del servidor
3. ✅ Actualiza `client/config.js` con esa URL
4. ✅ Despliega el **cliente**
5. ✅ Actualiza el CORS del servidor con la URL del cliente

---

## 🎯 Cómo Jugar (Guía Rápida)

1. **Crear Partida**

   - Haz clic en "CREAR PARTIDA"
   - Comparte el código de 4 dígitos con tus amigos
   - Usa el QR para compartir fácilmente

2. **Unirse a Partida**

   - Haz clic en "UNIRSE A PARTIDA"
   - Ingresa el código de 4 dígitos

3. **Configurar Partida** (solo anfitrión)

   - Ajusta el número de "blancos"
   - Configura quién puede escribir palabras
   - Inicia cuando todos estén listos

4. **Jugar**
   - Lee tu palabra (o "BLANCO" si eres el impostor)
   - Di una palabra relacionada en tu turno
   - Vota para expulsar a los sospechosos
   - ¡Gana identificando a los blancos o sobreviviendo!

---

## 🛠️ Tecnologías Utilizadas

### **Backend**

- **[Node.js](https://nodejs.org/)** - Entorno de ejecución JavaScript
- **[Express.js](https://expressjs.com/)** - Framework web minimalista
- **[Socket.IO](https://socket.io/)** - Comunicación en tiempo real bidireccional
- **[UUID](https://github.com/uuidjs/uuid)** - Generación de identificadores únicos
- **EventEmitter** - Gestión de eventos del juego

### **Frontend**

- **HTML5** - Estructura semántica
- **CSS3** - Diseño responsive y animaciones
- **JavaScript Vanilla** - Sin frameworks, máximo rendimiento
- **[jQuery](https://jquery.com/)** - Compatibilidad con QRCode.js
- **[QRCode.js](https://davidshimjs.github.io/qrcodejs/)** - Generación de códigos QR
- **[Font Awesome](https://fontawesome.com/)** - Iconos vectoriales

---

## 📡 API de Socket.IO

### **Eventos del Cliente → Servidor**

| Evento       | Parámetros                | Descripción                           |
| ------------ | ------------------------- | ------------------------------------- |
| `createRoom` | `{username}`              | Crea una nueva sala de juego          |
| `joinRoom`   | `{code, username}`        | Une a un jugador a una sala existente |
| `leaveRoom`  | `{roomCode}`              | Sale de la sala actual                |
| `kickPlayer` | `{roomCode, player}`      | Expulsa a un jugador (solo anfitrión) |
| `gamestatus` | `{roomCode, gamedata}`    | Actualiza el estado del juego         |
| `words`      | `{roomCode, word, order}` | Envía palabras o comandos del juego   |

### **Eventos del Servidor → Cliente**

| Evento         | Descripción                        |
| -------------- | ---------------------------------- |
| `roomCreated`  | Confirmación de creación de sala   |
| `playerJoined` | Notifica cuando un jugador se une  |
| `playerLeft`   | Notifica cuando un jugador sale    |
| `gameUpdate`   | Actualización del estado del juego |
| `error`        | Mensajes de error                  |

---

## ⚙️ Variables de Entorno

Crea un archivo `.env` en el directorio `server/` (opcional):

```env
PORT=8080
NODE_ENV=production
```

---

## 📱 Compatibilidad

- ✅ Chrome (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)
- ✅ Edge (Desktop & Mobile)
- ✅ Opera (Desktop & Mobile)

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Haz Fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Roadmap

- [ ] Sistema de puntuación y estadísticas
- [ ] Modos de juego adicionales
- [ ] Chat en tiempo real
- [ ] Sistema de amigos
- [ ] Temas personalizables
- [ ] Soporte multi-idioma
- [ ] PWA (Progressive Web App)
- [ ] Ranking global

---

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

---

## 👥 Autor

**Milmarcos Team**

- GitHub: [@rub3nnn](https://github.com/rub3nnn)
- Repositorio: [Blanco](https://github.com/rub3nnn/Blanco)

---

## 🙏 Agradecimientos

- Inspirado en juegos clásicos de deducción social
- Font Awesome por los iconos
- La comunidad de Socket.IO
- Todos los jugadores que disfrutan del juego

---

<div align="center">

**¿Te gusta el proyecto? ¡Dale una ⭐ en GitHub!**

[🎮 Jugar Ahora](https://blanco.vercel.app) | [🐛 Reportar Bug](https://github.com/rub3nnn/Blanco/issues) | [💡 Solicitar Feature](https://github.com/rub3nnn/Blanco/issues)

</div>
