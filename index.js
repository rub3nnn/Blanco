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
    console.log('a user connected');
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
        console.log(`Room created with code: ${roomCode}`);
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
            console.log(`User joined room: ${data.code}`);
            updatePlayerList(data.code); // Enviar lista de jugadores al unirse a la sala
            }else{
                socket.emit('joinedRoom', { success: false, msg: "Esperando a la siguiente ronda para unirte", errorcode: 2 });
                waitstatus(data.code).then((emitdata)=>{
                    rooms[data.code].players.push({ userId, username: socket.username, role: 'player' });
                    socket.join(data.code);
                    socket.currentRoom = data.code;
                    socket.emit('joinedRoom', { success: true, code: data.code, user: userId, emitdata });
                    io.to(data.code).emit('playerJoinedRoom', { user: userId, username: socket.username });
                    console.log(`User joined room: ${data.code}`);
                    updatePlayerList(data.code); // Enviar lista de jugadores al unirse a la sala
                })
            }
        } else {
            socket.emit('joinedRoom', { success: false, msg: "Esa sala no existe", errorcode: 0 });
        }
    });

    socket.on('message', (data) => {
        const { roomCode, message } = data;
        io.to(roomCode).emit('message', message);
    });

    socket.on('words', (data) => {
        const { roomCode, word, order } = data;
        if(word){
            if(rooms[roomCode].words){
                rooms[roomCode].words.push(word)
            }else{
                rooms[roomCode].words = [];
                rooms[roomCode].words.push(word);
            }
        }
        if(rooms[roomCode].words.length >= 1){
        if((rooms[roomCode].settings.wordwrite === "all" && rooms[roomCode].players.length === rooms[roomCode].words.length) || (rooms[roomCode].settings.wordwrite === "onlyleader" && rooms[roomCode].words.length === 1) || order === "continue"){
            
            const players = rooms[roomCode].players;
            const blancos = rooms[roomCode].settings.blanconumber; // Número de jugadores blancos que necesitas
            const selectedBlancos = [];
            const randomword = rooms[roomCode].words[Math.floor(Math.random() * rooms[roomCode].words.length)];
            while (selectedBlancos.length < blancos) {
                const randomPlayer = players[Math.floor(Math.random() * players.length)];
                if (!selectedBlancos.includes(randomPlayer) && !(rooms[roomCode].settings.wordwrite === "onlyleader" && randomPlayer.role === "leader") ) {
                    selectedBlancos.push(randomPlayer);
                }
            }
            rooms[roomCode].words = rooms[roomCode].words.filter(p => p !== randomword);
            rooms[roomCode].gamestatus = "receivewords"
            let emitdata = { 
                state: "receivewords", 
                data: {
                    word: randomword, 
                    blancos: selectedBlancos 
                }
            }
            io.to(roomCode).emit('game', emitdata);
            evento.emit(roomCode, emitdata);
        }
        }else{
            rooms[roomCode].gamestatus = "end"
            io.to(roomCode).emit('game', { 
                state: "end"
            });
        }
        
    });

    socket.on('gamestatus', (data) => {
        console.log(data)
        const { roomCode, gamedata } = data;
        rooms[roomCode].gamestatus = gamedata.state
        if(gamedata.state === "start"){
            rooms[roomCode].settings = gamedata.data
        }
        io.to(roomCode).emit('game', gamedata);
        console.log( rooms[roomCode].settings)
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
        console.log('user disconnected ' + userId);
        
        const currentRoom = socket.currentRoom;
        // Guardar el valor de prevRoom antes de cualquier modificación
        const originalPrevRoom = rooms[currentRoom] ? { ...rooms[currentRoom] } : null;
        
        if (currentRoom && rooms[currentRoom]) {
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
    });
    

    socket.on('leaveRoom', () => {
        const currentRoom = socket.currentRoom;
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
