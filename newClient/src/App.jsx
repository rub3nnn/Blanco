import React, { useState } from "react";
import {
  Play,
  Wifi,
  BookOpen,
  ArrowLeft,
  Users,
  Trophy,
  Target,
  Plus,
  X,
  Shuffle,
  Search,
  ChevronRight,
  Settings,
  QrCode,
  Clock,
  MessageSquare,
  Eye,
  EyeOff,
} from "lucide-react";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("menu");
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([
    "Comida",
    "Animales",
  ]);
  const [impostorCount, setImpostorCount] = useState(1);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showRole, setShowRole] = useState(false);
  const [gameData, setGameData] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [votedPlayer, setVotedPlayer] = useState(null);
  const [impostorHasHint, setImpostorHasHint] = useState(false);

  // Online mode states
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [roomData, setRoomData] = useState(null);
  const [myRole, setMyRole] = useState(null);
  const [cluesList, setCluesList] = useState([]);
  const [myClue, setMyClue] = useState("");
  const [onlineVote, setOnlineVote] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [showCategoryLibrary, setShowCategoryLibrary] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");

  // Online game settings
  const [turnMode, setTurnMode] = useState("normal"); // normal, leader-only, no-turns, free
  const [writtenClues, setWrittenClues] = useState(true);
  const [votingResults, setVotingResults] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [allVoted, setAllVoted] = useState(false);

  const allCategories = [
    "Comida",
    "Películas",
    "Objetos",
    "Animales",
    "Profesiones",
    "Países",
    "Deportes",
    "Música",
    "Videojuegos",
    "Tecnología",
    "Frutas",
    "Verduras",
    "Bebidas",
    "Postres",
    "Marcas",
    "Ciudades",
    "Colores",
    "Emociones",
    "Instrumentos",
    "Superhéroes",
  ];

  const categoryWords = {
    Comida: ["Pizza", "Sushi", "Hamburguesa", "Tacos", "Paella", "Pasta"],
    Películas: [
      "Titanic",
      "Avatar",
      "Matrix",
      "Gladiador",
      "Inception",
      "Joker",
    ],
    Objetos: ["Teléfono", "Reloj", "Silla", "Lámpara", "Libro", "Guitarra"],
    Animales: ["Tigre", "Elefante", "Delfín", "Águila", "Pingüino", "León"],
    Profesiones: [
      "Médico",
      "Chef",
      "Piloto",
      "Profesor",
      "Bombero",
      "Arquitecto",
    ],
    Países: ["Japón", "Italia", "Brasil", "Francia", "Australia", "Egipto"],
    Deportes: [
      "Fútbol",
      "Baloncesto",
      "Tenis",
      "Natación",
      "Atletismo",
      "Ciclismo",
    ],
    Música: ["Rock", "Jazz", "Pop", "Clásica", "Rap", "Electrónica"],
    Videojuegos: ["Mario", "Zelda", "Minecraft", "Fortnite", "FIFA", "GTA"],
    Tecnología: [
      "Ordenador",
      "Tablet",
      "Smartwatch",
      "Auriculares",
      "Consola",
      "Dron",
    ],
    Frutas: ["Manzana", "Plátano", "Naranja", "Fresa", "Uva", "Sandía"],
    Verduras: [
      "Tomate",
      "Lechuga",
      "Zanahoria",
      "Brócoli",
      "Pepino",
      "Cebolla",
    ],
    Bebidas: ["Café", "Té", "Agua", "Zumo", "Refresco", "Batido"],
    Postres: ["Helado", "Tarta", "Galletas", "Flan", "Brownie", "Donut"],
    Marcas: ["Nike", "Apple", "Samsung", "Adidas", "Coca-Cola", "Google"],
    Ciudades: ["París", "Londres", "Nueva York", "Tokio", "Roma", "Madrid"],
    Colores: ["Rojo", "Azul", "Verde", "Amarillo", "Negro", "Blanco"],
    Emociones: ["Alegría", "Tristeza", "Miedo", "Sorpresa", "Enfado", "Amor"],
    Instrumentos: [
      "Piano",
      "Guitarra",
      "Batería",
      "Violín",
      "Flauta",
      "Trompeta",
    ],
    Superhéroes: [
      "Superman",
      "Batman",
      "Spiderman",
      "Iron Man",
      "Thor",
      "Hulk",
    ],
  };

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < 10) {
      setPlayers([...players, newPlayerName.trim()]);
      setNewPlayerName("");
    }
  };

  const removePlayer = (index) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const toggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const startGame = () => {
    if (players.length >= 3 && selectedCategories.length > 0) {
      const randomCategory =
        selectedCategories[
          Math.floor(Math.random() * selectedCategories.length)
        ];
      const words = categoryWords[randomCategory];
      const secretWord = words[Math.floor(Math.random() * words.length)];

      const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
      const impostorIndices = [];
      while (impostorIndices.length < impostorCount) {
        const idx = Math.floor(Math.random() * shuffledPlayers.length);
        if (!impostorIndices.includes(idx)) {
          impostorIndices.push(idx);
        }
      }

      setGameData({
        players: shuffledPlayers,
        secretWord,
        category: randomCategory,
        impostorIndices,
        roles: shuffledPlayers.map((_, idx) =>
          impostorIndices.includes(idx) ? "impostor" : "innocent"
        ),
      });
      setCurrentPlayerIndex(0);
      setShowRole(false);
      setCurrentScreen("role-reveal");
    }
  };

  const nextPlayer = () => {
    if (currentPlayerIndex < gameData.players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setShowRole(false);
    } else {
      setCurrentScreen("game-play");
      setCurrentRound(0);
    }
  };

  const startVoting = () => {
    setCurrentScreen("voting");
    setVotedPlayer(null);
  };

  const revealResult = () => {
    if (votedPlayer !== null) {
      setCurrentScreen("game-end");
    }
  };

  const resetGame = () => {
    setPlayers([]);
    setSelectedCategories(["Comida", "Animales"]);
    setGameData(null);
    setCurrentPlayerIndex(0);
    setShowRole(false);
    setCurrentRound(0);
    setVotedPlayer(null);
    setImpostorHasHint(false);
    setCurrentScreen("menu");
  };

  // Online functions
  const generateRoomCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  };

  const createRoom = () => {
    if (!playerName.trim()) return;

    const code = generateRoomCode();
    const mockPlayers = [
      { name: playerName.trim(), ready: true, voted: false },
      { name: "Ana", ready: true, voted: false },
      { name: "Carlos", ready: true, voted: false },
      { name: "María", ready: false, voted: false },
    ];

    const room = {
      code,
      host: playerName.trim(),
      players: mockPlayers,
      categories: selectedCategories,
      impostorCount,
      impostorHasHint,
      turnMode,
      writtenClues,
      status: "lobby",
    };

    setRoomCode(code);
    setIsHost(true);
    setRoomData(room);
    setCurrentScreen("online-lobby");
  };

  const joinRoom = () => {
    if (!playerName.trim()) return;

    const mockPlayers = [
      { name: "Host", ready: true, voted: false },
      { name: playerName.trim(), ready: true, voted: false },
      { name: "Pedro", ready: true, voted: false },
      { name: "Laura", ready: false, voted: false },
    ];

    const room = {
      code: roomCode.toUpperCase() || "DEMO",
      host: "Host",
      players: mockPlayers,
      categories: ["Comida", "Animales"],
      impostorCount: 1,
      impostorHasHint: false,
      turnMode: "normal",
      writtenClues: true,
      status: "lobby",
    };

    setRoomCode(room.code);
    setIsHost(false);
    setRoomData(room);
    setCurrentScreen("online-lobby");
  };

  const startOnlineGame = () => {
    if (!roomData) return;

    const randomCategory =
      roomData.categories[
        Math.floor(Math.random() * roomData.categories.length)
      ];
    const words = categoryWords[randomCategory];
    const secretWord = words[Math.floor(Math.random() * words.length)];

    const shuffledPlayers = [...roomData.players].sort(
      () => Math.random() - 0.5
    );
    const impostorIndices = [];
    while (impostorIndices.length < roomData.impostorCount) {
      const idx = Math.floor(Math.random() * shuffledPlayers.length);
      if (!impostorIndices.includes(idx)) {
        impostorIndices.push(idx);
      }
    }

    const myIndex = shuffledPlayers.findIndex((p) => p.name === playerName);
    const role = impostorIndices.includes(myIndex) ? "impostor" : "innocent";

    setMyRole(role);
    setRoomData({
      ...roomData,
      status: "playing",
      category: randomCategory,
      secretWord,
      currentTurn: 0,
      players: shuffledPlayers,
      impostorIndices,
      round: 1,
    });
    setCurrentScreen("online-role");
    setCurrentTurn(0);

    setTimeout(() => {
      setCurrentScreen("online-play");
      setCluesList([]);
    }, 3000);
  };

  const submitClue = () => {
    if (!myClue.trim()) return;
    setCluesList([...cluesList, { player: playerName, clue: myClue.trim() }]);
    setMyClue("");

    // Simulate other players
    setTimeout(() => {
      const mockClues = [
        { player: "Ana", clue: "Delicioso" },
        { player: "Carlos", clue: "Italiano" },
      ];
      setCluesList((prev) => [...prev, ...mockClues]);
    }, 1000);
  };

  const nextTurn = () => {
    if (currentTurn < roomData.players.length - 1) {
      setCurrentTurn(currentTurn + 1);
      setRoomData({ ...roomData, currentTurn: currentTurn + 1 });
    } else {
      goToVoting();
    }
  };

  const goToVoting = () => {
    setCurrentScreen("online-voting");
    setOnlineVote(null);
    setAllVoted(false);
  };

  const submitVote = (votedPlayerName) => {
    setOnlineVote(votedPlayerName);

    // Simulate other votes
    const mockVotes = {
      [votedPlayerName]: 2,
      Ana: 1,
      Carlos: 1,
    };
    setVotingResults(mockVotes);
    setAllVoted(true);
  };

  const showVotingResults = () => {
    setCurrentScreen("online-voting-results");
  };

  const revealEliminated = () => {
    const eliminated = Object.keys(votingResults).reduce((a, b) =>
      votingResults[a] > votingResults[b] ? a : b
    );

    const eliminatedIndex = roomData.players.findIndex(
      (p) => p.name === eliminated
    );
    const wasImpostor = roomData.impostorIndices.includes(eliminatedIndex);

    setRoomData({
      ...roomData,
      eliminated,
      eliminatedRole: wasImpostor ? "impostor" : "innocent",
    });

    setCurrentScreen("online-elimination");
  };

  const showFinalResult = () => {
    setCurrentScreen("online-end");
  };

  const continueOrEnd = () => {
    // Check if game should continue
    const remainingImpostors = roomData.impostorIndices.filter(
      (idx) => roomData.players[idx].name !== roomData.eliminated
    ).length;

    const remainingPlayers = roomData.players.filter(
      (p) => p.name !== roomData.eliminated
    ).length;

    if (remainingImpostors === 0 || remainingPlayers <= 2) {
      showFinalResult();
    } else {
      // Continue to next round
      setRoomData({
        ...roomData,
        round: roomData.round + 1,
        players: roomData.players.filter((p) => p.name !== roomData.eliminated),
      });
      setCurrentTurn(0);
      setCluesList([]);
      setCurrentScreen("online-play");
    }
  };

  const leaveRoom = () => {
    setRoomCode("");
    setPlayerName("");
    setIsHost(false);
    setRoomData(null);
    setMyRole(null);
    setCluesList([]);
    setMyClue("");
    setOnlineVote(null);
    setShowQR(false);
    setVotingResults(null);
    setCurrentTurn(0);
    setAllVoted(false);
    setSelectedCategories(["Comida", "Animales"]);
    setTurnMode("normal");
    setWrittenClues(true);
    setImpostorHasHint(false);
    setCurrentScreen("menu");
  };

  const filteredCategories = allCategories.filter((cat) =>
    cat.toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-56 h-56 bg-white/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* MAIN MENU */}
      <div
        className={`absolute inset-0 flex flex-col transition-all duration-500 ease-in-out ${
          currentScreen === "menu"
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex-1 flex flex-col justify-center px-6 pb-20">
          <div className="text-center mb-16">
            <h1 className="text-7xl font-bold text-white mb-3 tracking-wider drop-shadow-2xl">
              BLANCO
            </h1>
            <div className="h-1 w-24 bg-white mx-auto rounded-full"></div>
          </div>

          <div className="space-y-4 max-w-sm mx-auto w-full">
            <button
              onClick={() => setCurrentScreen("local-setup")}
              className="w-full group relative overflow-hidden bg-white text-blue-600 font-bold py-5 px-6 rounded-3xl transition-all duration-300 transform active:scale-95 shadow-2xl border-2 border-blue-100"
            >
              <div className="absolute inset-0 bg-blue-50 transform translate-y-full group-active:translate-y-0 transition-transform duration-200"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-md">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl">Juego Local</span>
                </div>
                <Users className="w-5 h-5 text-blue-400" />
              </div>
            </button>

            <button
              onClick={() => setCurrentScreen("online-menu")}
              className="w-full group relative overflow-hidden bg-white/95 text-blue-600 font-bold py-5 px-6 rounded-3xl transition-all duration-300 transform active:scale-95 shadow-xl border-2 border-blue-100"
            >
              <div className="absolute inset-0 bg-blue-50 transform translate-y-full group-active:translate-y-0 transition-transform duration-200"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-md">
                    <Wifi className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl">Juego Online</span>
                </div>
                <Trophy className="w-5 h-5 text-blue-400" />
              </div>
            </button>

            <button
              onClick={() => setCurrentScreen("instructions")}
              className="w-full group relative overflow-hidden bg-white/20 backdrop-blur-md text-white font-bold py-5 px-6 rounded-3xl transition-all duration-300 transform active:scale-95 border-2 border-white/40 shadow-lg"
            >
              <div className="absolute inset-0 bg-white/10 transform translate-y-full group-active:translate-y-0 transition-transform duration-200"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl">Cómo Jugar</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="pb-8 text-center">
          <p className="text-white/40 text-sm font-medium">Versión 2.0.0</p>
        </div>
      </div>

      {/* INSTRUCTIONS SCREEN */}
      <div
        className={`absolute inset-0 flex flex-col transition-all duration-500 ease-in-out ${
          currentScreen === "instructions"
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative z-10 pt-12 pb-6 px-6">
          <button
            onClick={() => setCurrentScreen("menu")}
            className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white transition-all duration-200 active:scale-95 border border-white/30"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-4xl font-bold text-white mt-6 mb-2">
            Cómo Jugar
          </h2>
          <div className="h-1 w-16 bg-white rounded-full"></div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-8">
          <div className="space-y-6 max-w-sm mx-auto">
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-900 mb-2">
                    Objetivo
                  </h3>
                  <p className="text-blue-700 leading-relaxed">
                    Los inocentes deben descubrir al impostor. El impostor debe
                    pasar desapercibido y evitar ser descubierto.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-900 mb-2">
                    Roles Secretos
                  </h3>
                  <p className="text-blue-700 leading-relaxed">
                    Cada jugador verá su rol en secreto. Los inocentes conocen
                    la palabra secreta, el impostor solo sabe la categoría.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Play className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-900 mb-2">
                    Las Pistas
                  </h3>
                  <p className="text-blue-700 leading-relaxed">
                    Cada jugador da una pista de una palabra relacionada. Los
                    inocentes intentan demostrar que saben la palabra sin
                    revelárla.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-900 mb-2">
                    Victoria
                  </h3>
                  <p className="text-blue-700 leading-relaxed">
                    Tras el debate, votad al sospechoso. Ganan los inocentes si
                    expulsan al impostor, gana el impostor si expulsan a un
                    inocente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-8 pt-4">
          <button
            onClick={() => setCurrentScreen("menu")}
            className="w-full bg-white text-blue-600 font-bold py-5 rounded-3xl transition-all duration-200 active:scale-95 shadow-xl"
          >
            Volver al Menú
          </button>
        </div>
      </div>

      {/* LOCAL SETUP SCREEN */}
      <div
        className={`absolute inset-0 flex flex-col transition-all duration-500 ease-in-out ${
          currentScreen === "local-setup"
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative z-10 pt-12 pb-6 px-6">
          <button
            onClick={() => setCurrentScreen("menu")}
            className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white transition-all duration-200 active:scale-95 border border-white/30"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-4xl font-bold text-white mt-6 mb-2">
            Configuración
          </h2>
          <div className="h-1 w-16 bg-white rounded-full"></div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-8">
          <div className="space-y-6 max-w-sm mx-auto">
            {/* Add Players */}
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-blue-900 mb-4">
                Jugadores ({players.length}/10)
              </h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addPlayer()}
                  placeholder="Nombre del jugador"
                  className="flex-1 px-4 py-3 rounded-2xl bg-blue-50 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border-2 border-blue-100"
                  maxLength={15}
                />
                <button
                  onClick={addPlayer}
                  disabled={!newPlayerName.trim() || players.length >= 10}
                  className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-md"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>

              {players.length < 3 && (
                <p className="text-sm text-blue-600 mb-3">
                  Mínimo 3 jugadores requeridos
                </p>
              )}

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {players.map((player, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-blue-50 rounded-2xl px-4 py-3"
                  >
                    <span className="text-blue-900 font-medium">{player}</span>
                    <button
                      onClick={() => removePlayer(idx)}
                      className="w-8 h-8 bg-red-100 text-red-600 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Selection */}
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-blue-900">
                  Categorías ({selectedCategories.length})
                </h3>
                <button
                  onClick={() => setShowCategoryLibrary(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95"
                >
                  <Search className="w-4 h-4" />
                  Explorar
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 active:scale-95 border-2 border-blue-600 flex items-center gap-2"
                  >
                    <span>{cat}</span>
                    {selectedCategories.length > 1 && <X className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Impostor Count */}
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-blue-900 mb-4">
                Impostores
              </h3>
              <div className="flex gap-3">
                {[1, 2].map((count) => (
                  <button
                    key={count}
                    onClick={() => setImpostorCount(count)}
                    className={`flex-1 py-3 rounded-2xl font-medium transition-all duration-200 active:scale-95 border-2 ${
                      impostorCount === count
                        ? "bg-blue-600 text-white shadow-lg border-blue-600"
                        : "bg-blue-50 text-blue-700 border-blue-100"
                    }`}
                  >
                    {count} Impostor{count > 1 ? "es" : ""}
                  </button>
                ))}
              </div>
            </div>

            {/* Impostor Hint Option */}
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-blue-900 mb-4">
                Pista del Impostor
              </h3>
              <button
                onClick={() => setImpostorHasHint(!impostorHasHint)}
                className={`w-full py-4 rounded-2xl font-medium transition-all duration-200 active:scale-95 border-2 flex items-center justify-between px-6 ${
                  impostorHasHint
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-blue-50 text-blue-700 border-blue-100"
                }`}
              >
                <span>El impostor recibe una pista</span>
                {impostorHasHint ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
              <p className="text-sm text-blue-600 mt-2">
                {impostorHasHint
                  ? "El impostor verá una pista relacionada con la categoría"
                  : "El impostor solo sabrá la categoría"}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-8 pt-4">
          <button
            onClick={startGame}
            disabled={players.length < 3 || selectedCategories.length === 0}
            className="w-full bg-white text-blue-600 font-bold py-5 rounded-3xl transition-all duration-200 active:scale-95 shadow-xl disabled:opacity-50 disabled:active:scale-100"
          >
            Empezar Partida
          </button>
        </div>
      </div>

      {/* CATEGORY LIBRARY MODAL */}
      {showCategoryLibrary && (
        <div
          onClick={() => setShowCategoryLibrary(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[80vh] flex flex-col animate-scaleIn"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-blue-900">
                Biblioteca de Categorías
              </h3>
              <button
                onClick={() => setShowCategoryLibrary(false)}
                className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                <input
                  type="text"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  placeholder="Buscar categorías..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-blue-50 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border-2 border-blue-100"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">
                {filteredCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      toggleCategory(cat);
                      setShowCategoryLibrary(false);
                    }}
                    className={`py-3 px-4 rounded-2xl font-medium transition-all duration-200 active:scale-95 border-2 ${
                      selectedCategories.includes(cat)
                        ? "bg-blue-600 text-white shadow-md border-blue-600"
                        : "bg-blue-50 text-blue-700 border-blue-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-blue-100">
              <p className="text-sm text-blue-600 text-center">
                {selectedCategories.length} categoría
                {selectedCategories.length !== 1 ? "s" : ""} seleccionada
                {selectedCategories.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ROLE REVEAL SCREEN - Same as before */}
      <div
        className={`absolute inset-0 flex flex-col transition-all duration-500 ease-in-out ${
          currentScreen === "role-reveal"
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex-1 flex flex-col justify-center items-center px-6">
          {!showRole ? (
            <div
              className={`text-center max-w-sm mx-auto w-full ${
                showRole === false ? "animate-slideIn" : ""
              }`}
            >
              <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white/40">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">Turno de</h2>
              <p className="text-6xl font-bold text-white mb-12">
                {gameData?.players[currentPlayerIndex]}
              </p>
              <p className="text-xl text-white/80 mb-8">
                Asegúrate de que nadie más pueda ver la pantalla
              </p>
              <button
                onClick={() => setShowRole(true)}
                className="w-full bg-white text-blue-600 font-bold py-6 rounded-3xl transition-all duration-200 active:scale-95 shadow-2xl text-xl border-2 border-blue-100"
              >
                TOCA PARA VER TU ROL
              </button>
            </div>
          ) : (
            <div
              className={`text-center max-w-sm mx-auto w-full ${
                showRole ? "animate-reveal" : ""
              }`}
            >
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border-4 animate-scaleIn ${
                  gameData?.roles[currentPlayerIndex] === "impostor"
                    ? "bg-red-500/20 border-red-400"
                    : "bg-green-500/20 border-green-400"
                }`}
              >
                {gameData?.roles[currentPlayerIndex] === "impostor" ? (
                  <X className="w-12 h-12 text-red-400" />
                ) : (
                  <Target className="w-12 h-12 text-green-400" />
                )}
              </div>

              <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-xl mb-8 border-2 border-blue-100 animate-fadeInUp">
                <p className="text-blue-700 font-medium mb-4">Categoría:</p>
                <p className="text-3xl font-bold text-blue-900 mb-6">
                  {gameData?.category}
                </p>

                {gameData?.roles[currentPlayerIndex] === "impostor" ? (
                  <>
                    <div className="h-px bg-blue-200 my-6"></div>
                    <p className="text-5xl font-bold text-red-600 mb-4 animate-pulse">
                      ¡IMPOSTOR!
                    </p>
                    {impostorHasHint ? (
                      <>
                        <p className="text-blue-700 mb-2">Pista:</p>
                        <p className="text-2xl font-bold text-blue-900">
                          "Algo relacionado con {gameData?.category}"
                        </p>
                      </>
                    ) : (
                      <p className="text-blue-700">
                        No conoces la palabra secreta
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <div className="h-px bg-blue-200 my-6"></div>
                    <p className="text-blue-700 font-medium mb-4">
                      Palabra Secreta:
                    </p>
                    <p className="text-5xl font-bold text-green-600 animate-pulse">
                      {gameData?.secretWord}
                    </p>
                  </>
                )}
              </div>

              <button
                onClick={nextPlayer}
                className="w-full bg-white text-blue-600 font-bold py-6 rounded-3xl transition-all duration-200 active:scale-95 shadow-2xl text-xl border-2 border-blue-100"
              >
                {currentPlayerIndex < gameData?.players.length - 1
                  ? "¡Entendido! Siguiente →"
                  : "¡Empezar a Jugar!"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* GAME PLAY SCREEN */}
      <div
        className={`absolute inset-0 flex flex-col transition-all duration-500 ease-in-out ${
          currentScreen === "game-play"
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative z-10 pt-12 pb-6 px-6">
          <h2 className="text-4xl font-bold text-white mb-2">
            Ronda de Pistas
          </h2>
          <div className="h-1 w-16 bg-white rounded-full"></div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-8">
          <div className="space-y-6 max-w-sm mx-auto">
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-xl text-center">
              <Shuffle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                Orden de Juego
              </h3>
              <p className="text-blue-700 mb-6">
                Cada jugador debe dar una pista de UNA palabra en voz alta
              </p>

              <div className="space-y-3">
                {gameData?.players.map((player, idx) => (
                  <div
                    key={idx}
                    className={`py-3 px-4 rounded-2xl font-medium border-2 ${
                      idx === currentTurn
                        ? "bg-blue-600 text-white shadow-lg scale-105 border-blue-600"
                        : "bg-blue-50 text-blue-700 border-blue-100"
                    } transition-all duration-300`}
                  >
                    {idx + 1}. {player}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-red-500/20 backdrop-blur-lg rounded-3xl p-6 border-2 border-red-400/50">
              <p className="text-white font-bold text-center text-lg">
                ⚠️ ¡No digas la palabra secreta en voz alta!
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-8 pt-4">
          {currentTurn < gameData?.players.length - 1 ? (
            <button
              onClick={() => setCurrentTurn(currentTurn + 1)}
              className="w-full bg-white text-blue-600 font-bold py-5 rounded-3xl transition-all duration-200 active:scale-95 shadow-xl"
            >
              Siguiente Jugador →
            </button>
          ) : (
            <button
              onClick={startVoting}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-5 rounded-3xl transition-all duration-200 active:scale-95 shadow-xl"
            >
              Ir a Votación
            </button>
          )}
        </div>
      </div>

      {/* VOTING SCREEN */}
      <div
        className={`absolute inset-0 flex flex-col transition-all duration-500 ease-in-out ${
          currentScreen === "voting"
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative z-10 pt-12 pb-6 px-6">
          <h2 className="text-4xl font-bold text-white mb-2">Votación</h2>
          <div className="h-1 w-16 bg-white rounded-full"></div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-8">
          <div className="space-y-6 max-w-sm mx-auto">
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-xl text-center">
              <Trophy className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                ¿Quién es el impostor?
              </h3>
              <p className="text-blue-700 mb-6">
                Debatid y votad al jugador más sospechoso. Contad los votos y
                seleccionad al expulsado.
              </p>
            </div>

            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-xl">
              <h4 className="text-lg font-bold text-blue-900 mb-4">
                Selecciona al expulsado:
              </h4>
              <div className="space-y-2">
                {gameData?.players.map((player, idx) => (
                  <button
                    key={idx}
                    onClick={() => setVotedPlayer(idx)}
                    className={`w-full py-3 px-4 rounded-2xl font-medium transition-all duration-200 active:scale-95 border-2 ${
                      votedPlayer === idx
                        ? "bg-red-600 text-white shadow-lg border-red-600"
                        : "bg-blue-50 text-blue-700 border-blue-100"
                    }`}
                  >
                    {player}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-8 pt-4">
          <button
            onClick={revealResult}
            disabled={votedPlayer === null}
            className="w-full bg-white text-blue-600 font-bold py-5 rounded-3xl transition-all duration-200 active:scale-95 shadow-xl disabled:opacity-50 disabled:active:scale-100"
          >
            Revelar Resultado
          </button>
        </div>
      </div>

      {/* GAME END SCREEN */}
      <div
        className={`absolute inset-0 flex flex-col transition-all duration-500 ease-in-out ${
          currentScreen === "game-end"
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex-1 flex flex-col justify-center items-center px-6">
          <div className="text-center max-w-sm mx-auto w-full">
            {gameData && votedPlayer !== null && (
              <>
                <div
                  className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 ${
                    gameData.roles[votedPlayer] === "impostor"
                      ? "bg-green-500/20 border-8 border-green-400"
                      : "bg-red-500/20 border-8 border-red-400"
                  }`}
                >
                  {gameData.roles[votedPlayer] === "impostor" ? (
                    <Trophy className="w-16 h-16 text-green-400" />
                  ) : (
                    <X className="w-16 h-16 text-red-400" />
                  )}
                </div>

                <h2 className="text-5xl font-bold text-white mb-6">
                  {gameData.players[votedPlayer]}
                </h2>

                <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-xl mb-8">
                  <p
                    className="text-2xl font-bold mb-4 ${
                    gameData.roles[votedPlayer] === 'impostor'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }"
                  >
                    {gameData.roles[votedPlayer] === "impostor"
                      ? "¡Era el IMPOSTOR!"
                      : "Era un INOCENTE"}
                  </p>

                  <div className="h-px bg-blue-200 my-6"></div>

                  <p className="text-blue-700 font-medium mb-2">
                    La palabra secreta era:
                  </p>
                  <p className="text-4xl font-bold text-blue-900 mb-6">
                    {gameData.secretWord}
                  </p>

                  <div className="h-px bg-blue-200 my-6"></div>

                  <p
                    className="text-3xl font-bold ${
                    gameData.roles[votedPlayer] === 'impostor'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }"
                  >
                    {gameData.roles[votedPlayer] === "impostor"
                      ? "🎉 ¡GANAN LOS INOCENTES!"
                      : "😈 ¡GANA EL IMPOSTOR!"}
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={resetGame}
                    className="w-full bg-white text-blue-600 font-bold py-5 rounded-3xl transition-all duration-200 active:scale-95 shadow-xl"
                  >
                    Nueva Partida
                  </button>
                  <button
                    onClick={() => setCurrentScreen("menu")}
                    className="w-full bg-white/20 backdrop-blur-md text-white font-bold py-5 rounded-3xl transition-all duration-200 active:scale-95 border-2 border-white/40"
                  >
                    Menú Principal
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ONLINE MENU SCREEN */}
      <div
        className={`absolute inset-0 flex flex-col transition-all duration-500 ease-in-out ${
          currentScreen === "online-menu"
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative z-10 pt-12 pb-6 px-6">
          <button
            onClick={() => setCurrentScreen("menu")}
            className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white transition-all duration-200 active:scale-95 border border-white/30"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-4xl font-bold text-white mt-6 mb-2">
            Juego Online
          </h2>
          <div className="h-1 w-16 bg-white rounded-full"></div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 pb-20">
          <div className="space-y-4 max-w-sm mx-auto w-full">
            <button
              onClick={() => setCurrentScreen("create-room")}
              className="w-full group relative overflow-hidden bg-white text-blue-600 font-bold py-6 px-6 rounded-3xl transition-all duration-300 transform active:scale-95 shadow-2xl border-2 border-blue-100"
            >
              <div className="absolute inset-0 bg-blue-50 transform translate-y-full group-active:translate-y-0 transition-transform duration-200"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-md">
                    <Plus className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-xl">Crear Sala</span>
                </div>
              </div>
            </button>

            <button
              onClick={() => setCurrentScreen("join-room")}
              className="w-full group relative overflow-hidden bg-white text-blue-600 font-bold py-6 px-6 rounded-3xl transition-all duration-300 transform active:scale-95 shadow-2xl border-2 border-blue-100"
            >
              <div className="absolute inset-0 bg-blue-50 transform translate-y-full group-active:translate-y-0 transition-transform duration-200"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-md">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-xl">Unirse a Sala</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* CREATE ROOM SCREEN - Enhanced */}
      <div
        className={`absolute inset-0 flex flex-col transition-all duration-500 ease-in-out ${
          currentScreen === "create-room"
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative z-10 pt-12 pb-6 px-6">
          <button
            onClick={() => setCurrentScreen("online-menu")}
            className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white transition-all duration-200 active:scale-95 border border-white/30"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-4xl font-bold text-white mt-6 mb-2">
            Crear Sala
          </h2>
          <div className="h-1 w-16 bg-white rounded-full"></div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 pb-20">
          <div className="space-y-6 max-w-sm mx-auto w-full">
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-xl border-2 border-blue-100">
              <h3 className="text-xl font-bold text-blue-900 mb-4">
                Tu Nombre
              </h3>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Escribe tu nombre"
                className="w-full px-4 py-3 rounded-2xl bg-blue-50 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border-2 border-blue-100"
                maxLength={15}
              />
            </div>

            {/* Categories */}
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-xl border-2 border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-blue-900">
                  Categorías ({selectedCategories.length})
                </h3>
                <button
                  onClick={() => setShowCategoryLibrary(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95"
                >
                  <Search className="w-4 h-4" />
                  Explorar
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 active:scale-95 border-2 border-blue-600 flex items-center gap-2"
                  >
                    <span>{cat}</span>
                    {selectedCategories.length > 1 && <X className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Game Settings */}
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-xl border-2 border-blue-100">
              <h3 className="text-xl font-bold text-blue-900 mb-4">
                Configuración
              </h3>

              {/* Impostor Count */}
              <div className="mb-4">
                <p className="text-sm text-blue-700 font-medium mb-2">
                  Impostores
                </p>
                <div className="flex gap-2">
                  {[1, 2].map((count) => (
                    <button
                      key={count}
                      onClick={() => setImpostorCount(count)}
                      className={`flex-1 py-2 rounded-xl font-medium transition-all duration-200 active:scale-95 border-2 ${
                        impostorCount === count
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-blue-50 text-blue-700 border-blue-100"
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              {/* Impostor Hint */}
              <div className="mb-4">
                <button
                  onClick={() => setImpostorHasHint(!impostorHasHint)}
                  className={`w-full py-3 rounded-xl font-medium transition-all duration-200 active:scale-95 border-2 flex items-center justify-between px-4 ${
                    impostorHasHint
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-blue-50 text-blue-700 border-blue-100"
                  }`}
                >
                  <span className="text-sm">Pista para impostor</span>
                  {impostorHasHint ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Turn Mode */}
              <div className="mb-4">
                <p className="text-sm text-blue-700 font-medium mb-2">
                  Modo de turnos
                </p>
                <select
                  value={turnMode}
                  onChange={(e) => setTurnMode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-blue-50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 border-2 border-blue-100"
                >
                  <option value="normal">Turnos normales</option>
                  <option value="leader-only">Solo líder controla</option>
                  <option value="no-turns">Sin indicar turnos</option>
                  <option value="free">Totalmente libre</option>
                </select>
              </div>

              {/* Written Clues */}
              <div>
                <button
                  onClick={() => setWrittenClues(!writtenClues)}
                  className={`w-full py-3 rounded-xl font-medium transition-all duration-200 active:scale-95 border-2 flex items-center justify-between px-4 ${
                    writtenClues
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-blue-50 text-blue-700 border-blue-100"
                  }`}
                >
                  <span className="text-sm">Pistas por escrito</span>
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-8 pt-4">
          <button
            onClick={createRoom}
            disabled={!playerName.trim()}
            className="w-full bg-white text-blue-600 font-bold py-5 rounded-3xl transition-all duration-200 active:scale-95 shadow-xl disabled:opacity-50 disabled:active:scale-100 border-2 border-blue-100"
          >
            Crear Sala
          </button>
        </div>
      </div>

      {/* JOIN ROOM SCREEN - Same as before */}
      <div
        className={`absolute inset-0 flex flex-col transition-all duration-500 ease-in-out ${
          currentScreen === "join-room"
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative z-10 pt-12 pb-6 px-6">
          <button
            onClick={() => setCurrentScreen("online-menu")}
            className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white transition-all duration-200 active:scale-95 border border-white/30"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-4xl font-bold text-white mt-6 mb-2">
            Unirse a Sala
          </h2>
          <div className="h-1 w-16 bg-white rounded-full"></div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 pb-20">
          <div className="space-y-6 max-w-sm mx-auto w-full">
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-xl border-2 border-blue-100">
              <h3 className="text-xl font-bold text-blue-900 mb-4">
                Tu Nombre
              </h3>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Escribe tu nombre"
                className="w-full px-4 py-3 rounded-2xl bg-blue-50 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border-2 border-blue-100"
                maxLength={15}
              />
            </div>

            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-xl border-2 border-blue-100">
              <h3 className="text-xl font-bold text-blue-900 mb-4">
                Código de Sala
              </h3>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Ej: AXB4"
                className="w-full px-4 py-4 rounded-2xl bg-blue-50 text-blue-900 text-center text-2xl font-bold placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border-2 border-blue-100 uppercase"
                maxLength={4}
              />
            </div>
          </div>
        </div>

        <div className="px-6 pb-8 pt-4">
          <button
            onClick={joinRoom}
            disabled={!playerName.trim() || roomCode.length !== 4}
            className="w-full bg-white text-blue-600 font-bold py-5 rounded-3xl transition-all duration-200 active:scale-95 shadow-xl disabled:opacity-50 disabled:active:scale-100 border-2 border-blue-100"
          >
            Unirse
          </button>
        </div>
      </div>

      {/* ONLINE LOBBY SCREEN - Enhanced */}
      <div
        className={`absolute inset-0 flex flex-col transition-all duration-500 ease-in-out ${
          currentScreen === "online-lobby"
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative z-10 pt-12 pb-6 px-6">
          <button
            onClick={leaveRoom}
            className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white transition-all duration-200 active:scale-95 border border-white/30"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-4xl font-bold text-white mt-6 mb-2">
            Sala {roomCode}
          </h2>
          <div className="h-1 w-16 bg-white rounded-full"></div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-8">
          <div className="space-y-4 max-w-sm mx-auto">
            {/* Room Code & QR - Enhanced */}
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-xl border-2 border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-blue-600 font-medium mb-1">
                    Código de Sala
                  </p>
                  <p className="text-4xl font-bold text-blue-900 tracking-wider">
                    {roomCode}
                  </p>
                </div>
                <button
                  onClick={() => setShowQR(true)}
                  className="relative group"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 active:scale-95 shadow-lg">
                    <QrCode className="w-10 h-10 text-white mb-1" />
                    <span className="text-[10px] text-white/90 font-medium">
                      Ver QR
                    </span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                    <ChevronRight className="w-4 h-4 text-white" />
                  </div>
                </button>
              </div>
              <p className="text-sm text-blue-700">
                Comparte el código o toca para ver el QR
              </p>
            </div>

            {/* Players List */}
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-xl border-2 border-blue-100">
              <h3 className="text-lg font-bold text-blue-900 mb-4">
                Jugadores ({roomData?.players.length || 0})
              </h3>
              <div className="space-y-2">
                {roomData?.players.map((player, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-blue-50 rounded-2xl px-4 py-3 border-2 border-blue-100"
                  >
                    <span className="text-blue-900 font-medium">
                      {player.name}
                    </span>
                    <div className="flex items-center gap-2">
                      {player.ready && (
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      )}
                      {player.name === roomData.host && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-lg font-bold">
                          HOST
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Game Settings Display */}
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-xl border-2 border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-blue-900">
                  Configuración
                </h3>
                {isHost && (
                  <button
                    onClick={() => setCurrentScreen("create-room")}
                    className="text-blue-600 text-sm font-medium flex items-center gap-1"
                  >
                    <Settings className="w-4 h-4" />
                    Editar
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-blue-100">
                  <span className="text-sm text-blue-600">
                    Categorías activas
                  </span>
                  <span className="text-sm font-bold text-blue-900">
                    {roomData?.categories?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-blue-100">
                  <span className="text-sm text-blue-600">Impostores</span>
                  <span className="text-sm font-bold text-blue-900">
                    {roomData?.impostorCount || 1}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-blue-100">
                  <span className="text-sm text-blue-600">Pista impostor</span>
                  <span className="text-sm font-bold text-blue-900">
                    {roomData?.impostorHasHint ? "Sí" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-blue-100">
                  <span className="text-sm text-blue-600">Modo turnos</span>
                  <span className="text-sm font-bold text-blue-900">
                    {roomData?.turnMode === "normal" && "Normal"}
                    {roomData?.turnMode === "leader-only" && "Líder"}
                    {roomData?.turnMode === "no-turns" && "Sin turnos"}
                    {roomData?.turnMode === "free" && "Libre"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-blue-600">Pistas escritas</span>
                  <span className="text-sm font-bold text-blue-900">
                    {roomData?.writtenClues ? "Sí" : "No"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Start Button */}
        {isHost && (
          <div className="px-6 pb-8 pt-4">
            <button
              onClick={startOnlineGame}
              disabled={
                !roomData ||
                roomData.players.length < 3 ||
                selectedCategories.length === 0
              }
              className="w-full bg-white text-blue-600 font-bold py-5 rounded-3xl transition-all duration-200 active:scale-95 shadow-xl disabled:opacity-50 disabled:active:scale-100 border-2 border-blue-100"
            >
              {roomData && roomData.players.length < 3
                ? "Mínimo 3 jugadores"
                : "Empezar Partida"}
            </button>
          </div>
        )}
        {!isHost && (
          <div className="px-6 pb-8 pt-4">
            <div className="bg-white/20 backdrop-blur-md text-white text-center py-5 rounded-3xl border-2 border-white/40">
              <p className="font-medium">Esperando al host...</p>
            </div>
          </div>
        )}
      </div>

      {/* QR MODAL */}
      {showQR && (
        <div
          onClick={() => setShowQR(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-fadeIn"
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-sm w-full animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">
                Escanea para unirte
              </h3>
              <p className="text-blue-700">Sala: {roomCode}</p>
            </div>

            {/* QR Code Placeholder */}
            <div className="bg-white border-8 border-blue-100 rounded-2xl p-4 mb-6 aspect-square flex items-center justify-center">
              <div className="w-full h-full bg-blue-50 rounded-xl grid grid-cols-8 gap-1 p-2">
                {[...Array(64)].map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-sm ${
                      Math.random() > 0.5 ? "bg-blue-900" : "bg-white"
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowQR(false)}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl transition-all duration-200 active:scale-95"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* ONLINE ROLE SCREEN */}
      <div
        className={`absolute inset-0 flex flex-col transition-all duration-500 ease-in-out ${
          currentScreen === "online-role"
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex-1 flex flex-col justify-center items-center px-6">
          <div className="text-center max-w-sm mx-auto w-full animate-reveal">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border-4 animate-scaleIn ${
                myRole === "impostor"
                  ? "bg-red-500/20 border-red-400"
                  : "bg-green-500/20 border-green-400"
              }`}
            >
              {myRole === "impostor" ? (
                <X className="w-12 h-12 text-red-400" />
              ) : (
                <Target className="w-12 h-12 text-green-400" />
              )}
            </div>

            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-xl mb-8 border-2 border-blue-100 animate-fadeInUp">
              <p className="text-blue-700 font-medium mb-4">Categoría:</p>
              <p className="text-3xl font-bold text-blue-900 mb-6">
                {roomData?.category}
              </p>

              {myRole === "impostor" ? (
                <>
                  <div className="h-px bg-blue-200 my-6"></div>
                  <p className="text-5xl font-bold text-red-600 mb-4 animate-pulse">
                    ¡IMPOSTOR!
                  </p>
                  <p className="text-blue-700">No conoces la palabra secreta</p>
                </>
              ) : (
                <>
                  <div className="h-px bg-blue-200 my-6"></div>
                  <p className="text-blue-700 font-medium mb-4">
                    Palabra Secreta:
                  </p>
                  <p className="text-5xl font-bold text-green-600 animate-pulse">
                    {roomData?.gameData?.secretWord}
                  </p>
                </>
              )}
            </div>

            <div className="bg-white/20 backdrop-blur-md text-white text-center py-5 rounded-3xl border-2 border-white/40">
              <p className="font-medium">Preparando ronda de pistas...</p>
            </div>
          </div>
        </div>
      </div>

      {/* ONLINE PLAY SCREEN */}
      <div
        className={`absolute inset-0 flex flex-col transition-all duration-500 ease-in-out ${
          currentScreen === "online-play"
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative z-10 pt-12 pb-6 px-6">
          <h2 className="text-4xl font-bold text-white mb-2">
            Ronda de Pistas
          </h2>
          <div className="h-1 w-16 bg-white rounded-full"></div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-8">
          <div className="space-y-6 max-w-sm mx-auto">
            {/* Current turn indicator */}
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-xl text-center border-2 border-blue-100">
              <p className="text-blue-700 font-medium mb-2">Turno de:</p>
              <p className="text-3xl font-bold text-blue-900">
                {roomData?.players?.[0]?.name || "Esperando..."}
              </p>
            </div>

            {/* Clues list */}
            {cluesList && cluesList.length > 0 && (
              <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-xl border-2 border-blue-100">
                <h3 className="text-xl font-bold text-blue-900 mb-4">Pistas</h3>
                <div className="space-y-3">
                  {cluesList.map((clue, idx) =>
                    clue && clue.player && clue.clue ? (
                      <div
                        key={idx}
                        className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-100"
                      >
                        <p className="text-sm text-blue-600 font-medium mb-1">
                          {clue.player}
                        </p>
                        <p className="text-2xl font-bold text-blue-900">
                          {clue.clue}
                        </p>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            )}

            {/* Input for current player */}
            {playerName && (
              <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-3xl p-6 shadow-xl border-2 border-blue-400">
                <h3 className="text-xl font-bold text-white mb-4">
                  Da tu pista
                </h3>
                <input
                  type="text"
                  value={myClue}
                  onChange={(e) => setMyClue(e.target.value)}
                  placeholder="Escribe una palabra..."
                  className="w-full px-4 py-3 rounded-2xl bg-white text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-white mb-4"
                  maxLength={20}
                />
                <button
                  onClick={submitClue}
                  disabled={!myClue.trim()}
                  className="w-full bg-white text-blue-600 font-bold py-3 rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                >
                  Enviar Pista
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ONLINE VOTING SCREEN */}
      <div
        className={`absolute inset-0 flex flex-col transition-all duration-500 ease-in-out ${
          currentScreen === "online-voting"
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative z-10 pt-12 pb-6 px-6">
          <h2 className="text-4xl font-bold text-white mb-2">Votación</h2>
          <div className="h-1 w-16 bg-white rounded-full"></div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-8">
          <div className="space-y-6 max-w-sm mx-auto">
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-xl text-center">
              <Trophy className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                ¿Quién es el impostor?
              </h3>
              <p className="text-blue-700 mb-4">
                Vota al jugador más sospechoso
              </p>
              <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-100">
                <p className="text-sm text-blue-600 font-medium">
                  Votos recibidos (simulado)
                </p>
              </div>
            </div>

            {!onlineVote ? (
              <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-xl border-2 border-blue-100">
                <h4 className="text-lg font-bold text-blue-900 mb-4">
                  Selecciona un jugador:
                </h4>
                <div className="space-y-2">
                  {roomData?.players.map((player, idx) => (
                    <button
                      key={idx}
                      onClick={() => submitVote(player.name)}
                      className="w-full py-3 px-4 rounded-2xl font-medium transition-all duration-200 active:scale-95 bg-blue-50 text-blue-700 border-2 border-blue-100"
                    >
                      {player.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-green-500/20 backdrop-blur-lg rounded-3xl p-6 border-2 border-green-400/50">
                <p className="text-white font-bold text-center text-lg">
                  ✓ Has votado a {onlineVote}
                </p>
                <p className="text-white/80 text-center mt-2">
                  Esperando a los demás...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ONLINE END SCREEN */}
      <div
        className={`absolute inset-0 flex flex-col transition-all duration-500 ease-in-out ${
          currentScreen === "online-end"
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex-1 flex flex-col justify-center items-center px-6">
          <div className="text-center max-w-sm mx-auto w-full">
            {roomData && roomData.eliminated && (
              <>
                <div
                  className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 ${
                    roomData.eliminatedRole === "impostor"
                      ? "bg-green-500/20 border-8 border-green-400"
                      : "bg-red-500/20 border-8 border-red-400"
                  }`}
                >
                  {roomData.eliminatedRole === "impostor" ? (
                    <Trophy className="w-16 h-16 text-green-400" />
                  ) : (
                    <X className="w-16 h-16 text-red-400" />
                  )}
                </div>

                <h2 className="text-5xl font-bold text-white mb-6">
                  {roomData.eliminated}
                </h2>

                <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-xl mb-8">
                  <p
                    className={`text-2xl font-bold mb-4 ${
                      roomData.eliminatedRole === "impostor"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {roomData.eliminatedRole === "impostor"
                      ? "¡Era el IMPOSTOR!"
                      : "Era un INOCENTE"}
                  </p>

                  <div className="h-px bg-blue-200 my-6"></div>

                  <p className="text-blue-700 font-medium mb-2">
                    La palabra secreta era:
                  </p>
                  <p className="text-4xl font-bold text-blue-900 mb-6">
                    {roomData.secretWord}
                  </p>

                  <div className="h-px bg-blue-200 my-6"></div>

                  <p
                    className={`text-3xl font-bold ${
                      roomData.eliminatedRole === "impostor"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {roomData.eliminatedRole === "impostor"
                      ? "🎉 ¡GANAN LOS INOCENTES!"
                      : "😈 ¡GANA EL IMPOSTOR!"}
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={leaveRoom}
                    className="w-full bg-white text-blue-600 font-bold py-5 rounded-3xl transition-all duration-200 active:scale-95 shadow-xl border-2 border-blue-100"
                  >
                    Volver al Menú
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
        }
        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }

        @keyframes reveal {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-reveal {
          animation: reveal 0.5s ease-out;
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out 0.2s both;
        }
      `}</style>
    </div>
  );
}
