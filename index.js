const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const EventEmitter = require('events');
const evento = new EventEmitter();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = parseInt(process.env.PORT) || parseInt(process.argv[3]) || 8080;

app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

const rooms = {};

function generateRoomCode() {
    let code;
    do {
        code = Math.floor(1000 + Math.random() * 9000).toString();
    } while (rooms[code]);
    return code;
}

io.on('connection', (socket) => {
    const userId = uuidv4();
    socket.userId = userId;
    //console.log('a user connected');
    socket.currentRoom = null; 

    // Función para actualizar y enviar la lista de jugadores
    function updatePlayerList(roomCode) {
        if(rooms[roomCode]){
            const players = rooms[roomCode].players;
            io.to(roomCode).emit('playerListUpdate', { players });
        }
    }

    socket.on('createRoom', (usern) => {
        const username = usern.username
        socket.username = username;
        const roomCode = generateRoomCode();
        rooms[roomCode] = { players: [{ userId: userId, username: socket.username, role: 'leader' }] };
        socket.currentRoom = roomCode;
        socket.join(roomCode);
        socket.emit('roomCreated', { code: roomCode, user: userId, username: socket.username });
        console.log(`${username} ha creado la sala: ${roomCode}`);
        updatePlayerList(roomCode); // Enviar lista de jugadores al crear sala
    });

    function waitstatus(code) {
        return new Promise((resolve) => {
            evento.once(code, (emitdata) => {
                resolve(emitdata);
            });
        });
    }

    socket.on('joinRoom', (data) => {
        socket.username = data.username;
        if (rooms[data.code]) {
            const usernameExists = rooms[data.code].players.some(player => player.username === socket.username);
            if (usernameExists) {
                socket.emit('joinedRoom', { success: false, msg: "Ya hay un jugador con ese nombre de usuario en la sala", code: data.code, errorcode: 1 });
                return;
            }
            if(!rooms[data.code].gamestatus || rooms[data.code].gamestatus === "end"){
            rooms[data.code].players.push({ userId, username: socket.username, role: 'player' });
            socket.join(data.code);
            socket.currentRoom = data.code;
            socket.emit('joinedRoom', { success: true, code: data.code, user: userId });
            io.to(data.code).emit('playerJoinedRoom', { user: userId, username: socket.username });
            console.log(`${socket.username} se ha unido a la sala: ${data.code}`);
            updatePlayerList(data.code); // Enviar lista de jugadores al unirse a la sala
            }else{
                socket.emit('joinedRoom', { success: false, msg: "Esperando a la siguiente ronda para unirte", errorcode: 2 });
                console.log(`${socket.username} está pendiente para entrar a la sala ${data.code}.`);
                waitstatus(data.code).then((emitdata)=>{
                    rooms[data.code].players.push({ userId, username: socket.username, role: 'player' });
                    socket.join(data.code);
                    socket.currentRoom = data.code;
                    socket.emit('joinedRoom', { success: true, code: data.code, user: userId, emitdata });
                    io.to(data.code).emit('playerJoinedRoom', { user: userId, username: socket.username });
                    console.log(`${socket.username} se ha unido a la sala: ${data.code}`);
                    updatePlayerList(data.code); // Enviar lista de jugadores al unirse a la sala
                })
            }
        } else {
            console.log(`${socket.username} ha intentado unirse a la sala ${data.code} pero no existe.`);
            socket.emit('joinedRoom', { success: false, msg: "Esa sala no existe", errorcode: 0 });
        }
    });

    socket.on('message', (data) => {
        const { roomCode, message } = data;
        io.to(roomCode).emit('message', message);
    });

    socket.on('words', (data) => {
        const { roomCode, word, order } = data;
    
        if (!rooms[roomCode]) return; // Asegurarse de que la sala existe
    
        if (word) {
            if (!rooms[roomCode].words) {
                rooms[roomCode].words = [];
            }
    
            // Evitar palabras duplicadas del mismo jugador
            if (!rooms[roomCode].words.includes(word)) {
                rooms[roomCode].words.push(word);
                console.log(`${socket.username} en la sala ${roomCode}, ha introducido la palabra ${word}.`);
            }
        }
    
        // Cambiar el estado del juego a "waitingForWords" si es necesario
        if (rooms[roomCode].gamestatus !== "receivewords") {
            rooms[roomCode].gamestatus = "waitingForWords";
        }
    
        // Comprobar si se han recibido todas las palabras
        const playersCount = rooms[roomCode].players.length;
        const wordsCount = rooms[roomCode].words.length;
        const allWordsReceived = (rooms[roomCode].settings.wordwrite === "all" && playersCount === wordsCount);
        const leaderOnlyReceived = (rooms[roomCode].settings.wordwrite === "onlyleader" && wordsCount === 1);
        const shouldContinue = (order === "continue") || allWordsReceived || leaderOnlyReceived;
    
        if (shouldContinue) {
            continueGame(roomCode); // Llamada a la función `continueGame` para avanzar el juego
        }
    });

    socket.on('gamestatus', (data) => {
        const { roomCode, gamedata } = data;
        rooms[roomCode].gamestatus = gamedata.state
        if(gamedata.state === "start"){
            rooms[roomCode].settings = gamedata.data
        }
        io.to(roomCode).emit('game', gamedata);
    });

    socket.on('kickPlayer', (data) => {
        const { roomCode, player } = data;
        const currentRoom = socket.currentRoom;
        if (currentRoom && rooms[currentRoom]) {
            rooms[currentRoom].players = rooms[currentRoom].players.filter(p => p.userId !== player.id);
            if (rooms[currentRoom].players.length === 0) {
                delete rooms[currentRoom];
            } else {
                io.to(currentRoom).emit('exitRoom', { user: player.id, username: socket.username });
                updatePlayerList(currentRoom); // Enviar lista de jugadores al salir de la sala
            }
        }
        io.to(roomCode).emit('kicked', { user: player.id, username: player.username, msg: "Has sido expulsado de la partida" });
        
    });

    socket.on('disconnect', () => {
        
        if(socket.username){
            console.log(socket.username + "("+ userId + ") se ha desconectado" );
        }else{
           // console.log( userId + " se ha desconectado" );
        }
    
        const currentRoom = socket.currentRoom;
        if (currentRoom && rooms[currentRoom]) {
            const currentPlayer = rooms[currentRoom].players.find(p => p.userId === userId);
    
            // Remover al jugador de la lista de jugadores
            rooms[currentRoom].players = rooms[currentRoom].players.filter(p => p.userId !== userId);
    
            if (rooms[currentRoom].players.length === 0) {
                delete rooms[currentRoom];
            } else {
                if (currentPlayer.role === 'leader') {
                    // Si el líder se desconecta, expulsar a todos y eliminar la sala
                    rooms[currentRoom].players.forEach(player => {
                        io.to(currentRoom).emit('kicked', { user: player.userId, username: player.username, msg: "El líder se ha desconectado" });
                    });
                    delete rooms[currentRoom];
                } else {
                    // Si no es líder, simplemente notificar a los demás jugadores
                    io.to(currentRoom).emit('exitRoom', { user: userId, username: socket.username });
                }
    
                updatePlayerList(currentRoom); // Enviar lista de jugadores al salir de la sala
                
                // Comprobar si el juego estaba esperando palabras y el jugador que se desconectó aún no había enviado la suya
                if (rooms[currentRoom].gamestatus === 'waitingForWords') {
                    const pendingPlayers = rooms[currentRoom].players.length - rooms[currentRoom].words.length;
    
                    // Si todos los jugadores restantes han enviado sus palabras, continuar el juego
                    if (pendingPlayers <= 0) {
                        continueGame(currentRoom);
                    }
                }
            }
        }
    });
    
    function continueGame(roomCode) {
        if (!rooms[roomCode]) return;
    
        // Comprobar si hay palabras restantes
        if (rooms[roomCode].words.length === 0) {
            // No hay más palabras, el juego debe finalizar
            rooms[roomCode].gamestatus = "end";
            io.to(roomCode).emit('game', { state: "end" });
            return;
        }
    
        const players = rooms[roomCode].players;
        const blancos = rooms[roomCode].settings.blanconumber;
        const selectedBlancos = [];
        const randomword = rooms[roomCode].words[Math.floor(Math.random() * rooms[roomCode].words.length)];
    
        // Seleccionar jugadores blancos
        while (selectedBlancos.length < blancos) {
            const randomPlayer = players[Math.floor(Math.random() * players.length)];
            if (!selectedBlancos.includes(randomPlayer) && !(rooms[roomCode].settings.wordwrite === "onlyleader" && randomPlayer.role === "leader")) {
                selectedBlancos.push(randomPlayer);
            }
        }
    
        // Eliminar la palabra seleccionada de la lista de palabras
        rooms[roomCode].words = rooms[roomCode].words.filter(p => p !== randomword);
    
        // Actualizar el estado del juego y emitir los datos correspondientes
        rooms[roomCode].gamestatus = "receivewords";
        let emitdata = { 
            state: "receivewords", 
            data: {
                word: randomword, 
                blancos: selectedBlancos 
            }
        };
    
        io.to(roomCode).emit('game', emitdata);
        evento.emit(roomCode, emitdata);
    }
    
    
    

    socket.on('leaveRoom', () => {
        const currentRoom = socket.currentRoom;
        console.log(socket.username + " ha abandonado la sala " + currentRoom );
        // Guardar el valor de prevRoom antes de cualquier modificación
        const originalPrevRoom = rooms[currentRoom] ? { ...rooms[currentRoom] } : null;
        
        if (currentRoom && rooms[currentRoom] && originalPrevRoom.players.filter(p => p.userId === userId)[0]) {
            rooms[currentRoom].players = rooms[currentRoom].players.filter(p => p.userId !== userId);
            if (rooms[currentRoom].players.length === 0) {
                delete rooms[currentRoom];
            } else {
                const currentPlayer = originalPrevRoom.players.filter(p => p.userId === userId);
                console.log(originalPrevRoom.players);
                console.log(userId);
                if (currentPlayer[0].role === 'leader') {
                    rooms[currentRoom].players.filter(p => p.userId !== userId).forEach(player => {
                        io.to(currentRoom).emit('kicked', { user: player.userId, username: player.username, msg: "El líder se ha desconectado" });
                    });
                    delete rooms[currentRoom];
                } else {  
                    io.to(currentRoom).emit('exitRoom', { user: userId, username: socket.username });
                }
                
                updatePlayerList(currentRoom); // Enviar lista de jugadores al salir de la sala
            }
        }
        socket.leave(currentRoom);
    });

    
});

app.get('/api/rooms/:roomCode/players', (req, res) => {
    const roomCode = req.params.roomCode;
    if (rooms[roomCode]) {
        res.json({ players: rooms[roomCode].players });
    } else {
        res.status(404).json({ msg: "Room not found" });
    }
});

app.get('/api', (req, res) => {
    res.json({ "msg": "Hello world" });
});

server.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
