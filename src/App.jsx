import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  BookOpen,
  ArrowLeft,
  Users,
  Trophy,
  Target,
  Plus,
  X,
  Shuffle,
  Search,
  Eye,
  EyeOff,
  ChevronRight,
  HelpCircle,
  Settings,
  RefreshCcw,
  Fingerprint,
  Film,
  Utensils,
  Package,
  Dog,
  Briefcase,
  Globe,
  MapPin,
  Activity,
  Music,
  Gamepad2,
  ShoppingBag,
} from "lucide-react";

// --- COMPONENTES UI REUTILIZABLES (Definidos FUERA del componente principal para evitar bugs de foco) ---

const Header = ({ title, onBack, rightElement }) => (
  <div className="flex items-center justify-between px-5 py-4 shrink-0 z-20">
    <div className="flex items-center gap-3">
      {onBack && (
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl active:bg-white/20 transition backdrop-blur-md border border-white/10"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
      )}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight leading-none">
          {title}
        </h2>
        <div className="h-1 w-8 bg-blue-400 rounded-full mt-1"></div>
      </div>
    </div>
    {rightElement}
  </div>
);

const StickyFooter = ({ children }) => (
  <div className="p-5 sticky bottom-0 z-30 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent pointer-events-none">
    <div className="pointer-events-auto">{children}</div>
  </div>
);

const GlassCard = ({ children, className = "", onClick, noBorder = false }) => (
  <div
    onClick={onClick}
    className={`bg-white/10 backdrop-blur-md ${
      noBorder ? "" : "border border-white/10"
    } rounded-3xl shadow-xl ${className}`}
  >
    {children}
  </div>
);

// Componente de Pantalla de Expulsión
const ExpulsionScreen = ({ gameData, votedPlayer, onContinue, isGameEnd }) => {
  useEffect(() => {
    if (isGameEnd) {
      const timer = setTimeout(() => {
        onContinue();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isGameEnd, onContinue]);

  return (
    <div className="flex flex-col h-screen animate-fadeIn">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8">
          <div
            className={`absolute inset-0 blur-3xl opacity-30 animate-pulse ${
              gameData.roles[votedPlayer] === "impostor"
                ? "bg-emerald-500"
                : "bg-red-500"
            }`}
          ></div>
          <div
            className={`w-32 h-32 rounded-[2rem] flex items-center justify-center relative z-10 shadow-2xl border-4 ${
              gameData.roles[votedPlayer] === "impostor"
                ? "bg-emerald-500 border-emerald-300"
                : "bg-red-500 border-red-300"
            }`}
          >
            {gameData.roles[votedPlayer] === "impostor" ? (
              <Trophy className="w-16 h-16 text-white" />
            ) : (
              <X className="w-16 h-16 text-white" />
            )}
          </div>
        </div>

        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
          {gameData.players[votedPlayer]}
        </h1>
        <p
          className={`text-xl font-bold mb-8 uppercase tracking-widest ${
            gameData.roles[votedPlayer] === "impostor"
              ? "text-emerald-400"
              : "text-red-400"
          }`}
        >
          {gameData.roles[votedPlayer] === "impostor"
            ? "Era el Impostor"
            : "Era Inocente"}
        </p>

        {!isGameEnd && (
          <button
            onClick={onContinue}
            className="w-full max-w-sm bg-white text-slate-900 font-bold py-4 rounded-2xl shadow-xl hover:bg-blue-50 transition active:scale-95"
          >
            Continuar
          </button>
        )}
      </div>
    </div>
  );
};

// Componente Carta Giratoria Específico (Con lógica de mantener pulsado)
const RoleCard = ({
  isFlipped,
  onStartReveal,
  onStopReveal,
  player,
  role,
  category,
  word,
  wordHint,
  showHint,
  showCategory,
}) => {
  return (
    <div
      className="relative w-full max-w-[320px] aspect-[3/4] perspective-1000 mx-auto cursor-pointer group select-none touch-none"
      onMouseDown={onStartReveal}
      onMouseUp={onStopReveal}
      onMouseLeave={onStopReveal}
      onTouchStart={onStartReveal}
      onTouchEnd={onStopReveal}
      onTouchCancel={onStopReveal}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <div
        className={`relative w-full h-full duration-500 preserve-3d transition-transform ${
          isFlipped ? "rotate-y-180" : ""
        }`}
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRENTE DE LA CARTA */}
        <div
          className="absolute inset-0 backface-hidden rounded-[2.5rem] p-1 bg-gradient-to-br from-blue-400/30 to-purple-500/30 border border-white/20 shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)] backdrop-blur-xl flex flex-col items-center justify-center text-center overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Diseño decorativo del frente */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent opacity-50"></div>

          <div className="relative z-10 flex flex-col items-center pointer-events-none">
            <div
              className={`w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-white/10 backdrop-blur-sm transition-transform duration-300 ${
                isFlipped ? "scale-90" : "scale-100"
              }`}
            >
              <Fingerprint className="w-12 h-12 text-white/80" />
            </div>
            <span className="text-blue-200 text-xs font-bold tracking-[0.3em] uppercase mb-2">
              IDENTIDAD SECRETA
            </span>
            <h2 className="text-4xl font-black text-white mb-8 tracking-tight">
              {player}
            </h2>
            <div className="bg-white/20 px-6 py-3 rounded-full text-white font-bold text-sm flex items-center gap-2 animate-pulse shadow-lg border border-white/20">
              <Eye className="w-4 h-4" />
              MANTÉN PARA VER
            </div>
          </div>
        </div>

        {/* DORSO DE LA CARTA (REVELADO) */}
        <div
          className={`absolute inset-0 backface-hidden rounded-[2.5rem] overflow-hidden rotate-y-180 border border-white/20 shadow-2xl ${
            role === "impostor"
              ? "bg-gradient-to-br from-red-900/90 to-red-600/90"
              : "bg-gradient-to-br from-emerald-900/90 to-emerald-600/90"
          }`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center pointer-events-none">
            {role === "impostor" ? (
              <>
                <div className="w-24 h-24 bg-black/20 rounded-full flex items-center justify-center mb-6 ring-4 ring-red-400/30">
                  <EyeOff className="w-12 h-12 text-red-200" />
                </div>
                <h2 className="text-4xl font-black text-white mb-2 drop-shadow-md tracking-tighter">
                  IMPOSTOR
                </h2>
                <div className="w-16 h-1 bg-red-400/50 rounded-full mb-6"></div>

                <div className="bg-black/20 rounded-2xl p-4 w-full backdrop-blur-sm border border-white/5">
                  <p className="text-red-100/70 text-xs uppercase font-bold mb-1">
                    Tu Misión
                  </p>
                  <p className="text-white text-sm">
                    Engaña a todos. No conoces la palabra secreta.
                  </p>
                </div>

                {showCategory && (
                  <div className="mt-4 bg-white/10 rounded-xl p-3 w-full border border-white/10">
                    <p className="text-red-100/70 text-xs uppercase font-bold mb-1">
                      Categoría
                    </p>
                    <p className="text-red-100 text-base font-bold">
                      {category}
                    </p>
                  </div>
                )}

                {showHint && wordHint && (
                  <div className="mt-4 bg-white/10 rounded-xl p-3 w-full border border-white/10">
                    <p className="text-red-100/70 text-xs uppercase font-bold mb-1">
                      Pista
                    </p>
                    <p className="text-red-100 text-base font-bold">
                      {wordHint}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="w-24 h-24 bg-black/20 rounded-full flex items-center justify-center mb-6 ring-4 ring-emerald-400/30">
                  <Target className="w-12 h-12 text-emerald-200" />
                </div>
                <h2 className="text-4xl font-black text-white mb-2 drop-shadow-md tracking-tighter">
                  INOCENTE
                </h2>
                <div className="w-16 h-1 bg-emerald-400/50 rounded-full mb-6"></div>

                <div className="bg-black/20 rounded-2xl p-5 w-full backdrop-blur-sm border border-white/5">
                  <p className="text-emerald-100/70 text-xs uppercase font-bold mb-2">
                    Palabra Secreta
                  </p>
                  <p className="text-3xl font-bold text-white tracking-wide">
                    {word}
                  </p>
                </div>
                <p className="text-emerald-100/60 text-xs mt-4 uppercase font-bold tracking-widest">
                  {category}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("menu");
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem("blanco-players");
    return saved ? JSON.parse(saved) : [];
  });
  const [newPlayerName, setNewPlayerName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([
    "Comida y Bebida",
    "Animales",
    "Objetos",
  ]);
  const [impostorCount, setImpostorCount] = useState(1);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [hasRevealedOnce, setHasRevealedOnce] = useState(false);
  const [gameData, setGameData] = useState(null);
  const [votedPlayer, setVotedPlayer] = useState(null);
  const [showImpostorHint, setShowImpostorHint] = useState(false);
  const [showImpostorCategory, setShowImpostorCategory] = useState(false);
  const [showCategoryLibrary, setShowCategoryLibrary] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [currentRound, setCurrentRound] = useState(1);
  const [alivePlayers, setAlivePlayers] = useState([]);
  const [debateStartPlayer, setDebateStartPlayer] = useState(0);
  const [isCardTransitioning, setIsCardTransitioning] = useState(false);
  const [categoryWords, setCategoryWords] = useState({});
  const [usedWords, setUsedWords] = useState(() => {
    const saved = localStorage.getItem("blanco-used-words");
    return saved ? JSON.parse(saved) : {};
  });

  // Auto-scroll ref
  const playerListRef = useRef(null);

  // Guardar jugadores en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("blanco-players", JSON.stringify(players));
  }, [players]);

  // Guardar palabras usadas en localStorage
  useEffect(() => {
    localStorage.setItem("blanco-used-words", JSON.stringify(usedWords));
  }, [usedWords]);

  // Cargar palabras desde los archivos JSON
  useEffect(() => {
    const loadCategoryWords = async () => {
      const categoryFiles = {
        "Cine y Series": "peliculas",
        "Comida y Bebida": "comidas",
        Objetos: "objetos",
        Animales: "animales",
        Profesiones: "profesiones",
        Países: "paises",
        Ciudades: "ciudades",
        Deportes: "deportes",
        Música: "musica",
        Videojuegos: "videojuegos",
        Marcas: "marcas",
        Futbolistas: "futbolistas",
      };

      const loadedWords = {};

      for (const [category, fileName] of Object.entries(categoryFiles)) {
        try {
          const response = await import(`./data/es-es/${fileName}.json`);
          loadedWords[category] = response.default;
          console.log(`Loaded ${category}:`, response.default?.length, "words");
        } catch (error) {
          console.error(
            `❌ Error cargando ${fileName}.json para ${category}:`,
            error
          );
          loadedWords[category] = [];
        }
      }

      setCategoryWords(loadedWords);
    };

    loadCategoryWords();
  }, []);

  const allCategories = [
    { name: "Cine y Series", icon: Film },
    { name: "Comida y Bebida", icon: Utensils },
    { name: "Objetos", icon: Package },
    { name: "Animales", icon: Dog },
    { name: "Profesiones", icon: Briefcase },
    { name: "Países", icon: Globe },
    { name: "Ciudades", icon: MapPin },
    { name: "Deportes", icon: Activity },
    { name: "Música", icon: Music },
    { name: "Videojuegos", icon: Gamepad2 },
    { name: "Marcas", icon: ShoppingBag },
    { name: "Futbolistas", icon: Trophy },
  ];

  // Función para obtener una palabra aleatoria de una categoría
  const getRandomWord = (category) => {
    const words = categoryWords[category];
    if (!words || words.length === 0) return null;

    // Inicializar el array de palabras usadas para esta categoría si no existe
    if (!usedWords[category]) {
      usedWords[category] = [];
    }

    // Filtrar palabras que aún no se han usado
    const availableWords = words.filter(
      (wordObj) => !usedWords[category].includes(wordObj.word)
    );

    // Si no hay palabras disponibles, reiniciar la lista de palabras usadas
    if (availableWords.length === 0) {
      setUsedWords((prev) => ({
        ...prev,
        [category]: [],
      }));
      return words[Math.floor(Math.random() * words.length)];
    }

    // Seleccionar una palabra aleatoria de las disponibles
    const selectedWordObj =
      availableWords[Math.floor(Math.random() * availableWords.length)];

    // Marcar la palabra como usada
    setUsedWords((prev) => ({
      ...prev,
      [category]: [...(prev[category] || []), selectedWordObj.word],
    }));

    return selectedWordObj;
  };

  // Handlers para revelar/ocultar rol
  const handleStartReveal = () => {
    setIsCardFlipped(true);
    setHasRevealedOnce(true);
  };

  const handleStopReveal = () => {
    setIsCardFlipped(false);
  };

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < 10) {
      setPlayers([...players, newPlayerName.trim()]);
      setNewPlayerName("");
      setTimeout(() => {
        if (playerListRef.current) {
          playerListRef.current.scrollTop = playerListRef.current.scrollHeight;
        }
      }, 100);
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

      // Obtener palabra aleatoria que no se haya usado
      const wordObj = getRandomWord(randomCategory);

      if (!wordObj) {
        alert("No hay palabras disponibles para esta categoría");
        return;
      }

      // Mantener el orden original de los jugadores
      const gamePlayers = [...players];

      // Seleccionar impostores aleatorios
      const impostorIndices = [];
      while (impostorIndices.length < impostorCount) {
        const idx = Math.floor(Math.random() * gamePlayers.length);
        if (!impostorIndices.includes(idx)) {
          impostorIndices.push(idx);
        }
      }

      const roles = gamePlayers.map((_, idx) =>
        impostorIndices.includes(idx) ? "impostor" : "innocent"
      );

      setGameData({
        players: gamePlayers,
        secretWord: wordObj.word,
        wordHint: wordObj.hint,
        category: randomCategory,
        impostorIndices,
        roles,
      });
      setAlivePlayers(gamePlayers.map((_, idx) => idx));
      setCurrentPlayerIndex(0);
      setIsCardFlipped(false);
      setHasRevealedOnce(false);
      setCurrentRound(1);
      setCurrentScreen("role-reveal");
    }
  };

  const nextPlayer = () => {
    if (currentPlayerIndex < gameData.players.length - 1) {
      // Iniciar animación de salida
      setIsCardTransitioning(true);

      // Después de la animación, cambiar al siguiente jugador
      setTimeout(() => {
        setCurrentPlayerIndex(currentPlayerIndex + 1);
        setIsCardFlipped(false);
        setHasRevealedOnce(false);
        setIsCardTransitioning(false);
      }, 400);
    } else {
      // Determinar quién empieza el debate (primer jugador vivo)
      setDebateStartPlayer(alivePlayers[0]);
      setCurrentScreen("debate");
    }
  };

  const startVoting = () => {
    setCurrentScreen("voting");
    setVotedPlayer(null);
  };

  const revealResult = () => {
    if (votedPlayer !== null) {
      setCurrentScreen("expulsion");
    }
  };

  const continueToNextRound = () => {
    // Eliminar al expulsado de los jugadores vivos
    const newAlivePlayers = alivePlayers.filter((idx) => idx !== votedPlayer);
    setAlivePlayers(newAlivePlayers);

    // Verificar condiciones de victoria
    const aliveRoles = newAlivePlayers.map((idx) => gameData.roles[idx]);
    const aliveImpostors = aliveRoles.filter((r) => r === "impostor").length;
    const aliveInnocents = aliveRoles.filter((r) => r === "innocent").length;

    if (aliveImpostors === 0) {
      setCurrentScreen("game-end");
      return;
    }
    if (aliveImpostors >= aliveInnocents) {
      setCurrentScreen("game-end");
      return;
    }

    // Continuar a siguiente ronda
    setCurrentRound(currentRound + 1);
    setDebateStartPlayer(newAlivePlayers[0]);
    setVotedPlayer(null);
    setCurrentScreen("debate");
  };

  const checkGameEnd = () => {
    // Calcular jugadores vivos después de la expulsión
    const newAlivePlayers = alivePlayers.filter((idx) => idx !== votedPlayer);
    const aliveRoles = newAlivePlayers.map((idx) => gameData.roles[idx]);
    const aliveImpostors = aliveRoles.filter((r) => r === "impostor").length;
    const aliveInnocents = aliveRoles.filter((r) => r === "innocent").length;

    return aliveImpostors === 0 || aliveImpostors >= aliveInnocents;
  };

  const resetGame = () => {
    setGameData(null);
    setCurrentPlayerIndex(0);
    setIsCardFlipped(false);
    setHasRevealedOnce(false);
    setVotedPlayer(null);
    setCurrentRound(1);
    setAlivePlayers([]);
    setDebateStartPlayer(0);
    setCurrentScreen("local-setup");
  };

  const filteredCategories = allCategories.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-slate-900 font-sans selection:bg-blue-500/30">
      {/* --- FONDO ANIMADO --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#0f172a]">
        <div className="absolute top-[-20%] left-[-20%] w-[80vw] h-[80vw] bg-blue-600/20 rounded-full blur-[100px] animate-blob mix-blend-screen"></div>
        <div className="absolute top-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-purple-600/20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[80vw] h-[80vw] bg-indigo-600/20 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* MENU */}
        {currentScreen === "menu" && (
          <div className="flex flex-col h-screen animate-fadeIn">
            <div className="flex-1 flex flex-col justify-center items-center px-6 relative">
              <div className="mb-12 text-center relative z-10">
                <div className="inline-block relative">
                  <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-white via-blue-100 to-blue-400 tracking-tighter drop-shadow-2xl">
                    BLANCO
                  </h1>
                  <div className="absolute -inset-4 bg-blue-500/20 blur-2xl rounded-full -z-10 animate-pulse-slow"></div>
                </div>
                <div className="h-1.5 w-20 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full mt-2"></div>
                <p className="text-blue-200/60 text-sm font-medium mt-3 tracking-widest uppercase">
                  Encuentra al impostor
                </p>
                <div className="mt-4 flex items-center gap-2 justify-center">
                  <span className="text-blue-300/80 text-xs font-semibold">
                    v1.0
                  </span>
                  <span className="bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    Beta
                  </span>
                </div>
              </div>

              <div className="w-full max-w-xs space-y-3 z-10">
                <button
                  onClick={() => setCurrentScreen("local-setup")}
                  className="w-full group relative overflow-hidden bg-white text-slate-900 font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_-10px_rgba(255,255,255,0.4)]"
                >
                  <div className="absolute inset-0 bg-blue-50 transform translate-y-full group-active:translate-y-0 transition-transform duration-200"></div>
                  <div className="relative flex items-center justify-between">
                    <span className="flex items-center gap-3 text-lg">
                      <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                        <Play className="w-5 h-5 fill-current" />
                      </div>
                      Jugar
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 transition-colors" />
                  </div>
                </button>

                <button
                  onClick={() => setCurrentScreen("instructions")}
                  className="w-full group bg-white/5 backdrop-blur-md border border-white/10 text-white font-semibold py-4 px-6 rounded-2xl active:scale-95 transition-all hover:bg-white/10"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-3">
                      <div className="bg-white/10 p-1.5 rounded-lg">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      Cómo Jugar
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* INSTRUCTIONS */}
        {currentScreen === "instructions" && (
          <div className="flex flex-col h-screen animate-slideIn">
            <Header
              title="Cómo Jugar"
              onBack={() => setCurrentScreen("menu")}
            />
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {[
                {
                  icon: Target,
                  title: "Objetivo",
                  text: "Inocentes: descubrid al impostor. Impostor: pasad desapercibido.",
                },
                {
                  icon: Users,
                  title: "Roles",
                  text: "Inocentes conocen la palabra. Impostor no conoce la palabra secreta.",
                },
                {
                  icon: Play,
                  title: "Rondas",
                  text: "Cada jugador dice una palabra relacionada sin ser muy obvio.",
                },
                {
                  icon: Trophy,
                  title: "Votación",
                  text: "Debatid y votad para expulsar al sospechoso.",
                },
                {
                  icon: Eye,
                  title: "Revelar Categoría",
                  text: "Hace visible para el impostor de qué categoría es la palabra secreta.",
                },
                {
                  icon: HelpCircle,
                  title: "Revelar Pista",
                  text: "Da una pista muy grande al impostor sobre la palabra. Recomendado para grupos pequeños donde hay poca oportunidad de deducción.",
                },
              ].map((item, i) => (
                <GlassCard
                  key={i}
                  className="p-4 flex gap-4 items-start hover:bg-white/15 transition-colors"
                >
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-xl text-white shadow-lg shrink-0 mt-1">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base mb-1">
                      {item.title}
                    </h3>
                    <p className="text-blue-100/70 text-sm leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* SETUP */}
        {currentScreen === "local-setup" && (
          <div className="flex flex-col h-screen animate-slideIn">
            <Header
              title="Configuración"
              onBack={() => setCurrentScreen("menu")}
            />

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Add Player Section */}
              <GlassCard className="p-0 overflow-hidden bg-white/5">
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                  <h3 className="text-sm font-bold text-blue-200 uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4" /> Jugadores{" "}
                    <span className="bg-white/10 text-white px-2 py-0.5 rounded-md text-xs">
                      {players.length}
                    </span>
                  </h3>
                </div>

                <div className="p-4">
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newPlayerName}
                      onChange={(e) => setNewPlayerName(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addPlayer()}
                      placeholder="Nombre..."
                      maxLength={12}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
                    />
                    <button
                      onClick={addPlayer}
                      disabled={!newPlayerName.trim()}
                      className="bg-blue-600 text-white w-12 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition shadow-lg hover:bg-blue-500"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>

                  <div
                    ref={playerListRef}
                    className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar"
                  >
                    {players.map((player, idx) => (
                      <div
                        key={idx}
                        className="bg-white/10 border border-white/5 text-blue-100 px-3 py-2.5 rounded-xl text-sm font-medium flex justify-between items-center group"
                      >
                        <span className="truncate">{player}</span>
                        <button
                          onClick={() => removePlayer(idx)}
                          className="text-white/40 hover:text-red-400 p-1 rounded-md hover:bg-white/5 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {players.length === 0 && (
                      <div className="col-span-2 text-center py-6 text-white/20 text-sm italic border-2 border-dashed border-white/10 rounded-xl">
                        Añade 3+ jugadores
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>

              {/* Game Settings Grid */}
              <div className="space-y-3">
                {/* Categories */}
                <GlassCard
                  className="p-0 overflow-hidden bg-white/5"
                  onClick={() => setShowCategoryLibrary(true)}
                >
                  <div className="p-4 flex flex-col gap-3 active:bg-white/5 transition-colors cursor-pointer">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-blue-200 uppercase tracking-wider flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> Categorías
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-blue-500/20 text-blue-300 font-bold px-2 py-1 rounded-md border border-blue-500/20">
                          {selectedCategories.length}
                        </span>
                        <ChevronRight className="w-4 h-4 text-white/30" />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategories.slice(0, 5).map((cat) => (
                        <span
                          key={cat}
                          className="text-xs bg-white/10 border border-white/10 px-2 py-1 rounded-md text-white/80"
                        >
                          {cat}
                        </span>
                      ))}
                      {selectedCategories.length > 5 && (
                        <span className="text-xs text-white/40 py-1">
                          +{selectedCategories.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                </GlassCard>

                {/* Impostors */}
                <GlassCard className="flex flex-col p-4 gap-3 bg-white/5">
                  <h3 className="text-sm font-bold text-blue-200 uppercase tracking-wider">
                    Impostores
                  </h3>
                  <div className="flex gap-2 items-center w-full">
                    <div className="flex bg-black/20 rounded-lg p-1 flex-1">
                      {[1, 2].map((num) => (
                        <button
                          key={num}
                          onClick={() => setImpostorCount(num)}
                          disabled={num > Math.floor(players.length / 2)}
                          className={`flex-1 py-1.5 rounded-md text-sm font-bold transition-all ${
                            impostorCount === num
                              ? "bg-blue-600 text-white shadow-md"
                              : num > Math.floor(players.length / 2)
                              ? "text-white/20 cursor-not-allowed"
                              : "text-white/40 hover:text-white/70"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          const maxImpostors = Math.floor(players.length / 2);
                          if (impostorCount > 1) {
                            setImpostorCount(impostorCount - 1);
                          }
                        }}
                        disabled={impostorCount <= 1}
                        className="w-8 h-8 bg-black/20 rounded-md text-white/60 hover:text-white hover:bg-black/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold"
                      >
                        -
                      </button>
                      <div className="w-10 h-8 bg-blue-600/20 border border-blue-500/30 rounded-md flex items-center justify-center text-blue-300 font-bold text-sm">
                        {impostorCount}
                      </div>
                      <button
                        onClick={() => {
                          const maxImpostors = Math.floor(players.length / 2);
                          if (impostorCount < maxImpostors) {
                            setImpostorCount(impostorCount + 1);
                          }
                        }}
                        disabled={
                          impostorCount >= Math.floor(players.length / 2)
                        }
                        className="w-8 h-8 bg-black/20 rounded-md text-white/60 hover:text-white hover:bg-black/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </GlassCard>

                <div className="grid grid-cols-2 gap-3">
                  {/* Impostor Category Toggle */}
                  <GlassCard
                    onClick={() =>
                      setShowImpostorCategory(!showImpostorCategory)
                    }
                    className={`flex flex-col items-center justify-center p-4 gap-3 cursor-pointer active:scale-95 transition-all ${
                      showImpostorCategory
                        ? "bg-purple-900/20 border-purple-500/30"
                        : "bg-white/5"
                    }`}
                  >
                    <span
                      className={`text-xs font-bold uppercase tracking-wide text-center ${
                        showImpostorCategory
                          ? "text-purple-300"
                          : "text-blue-200"
                      }`}
                    >
                      Categoría
                    </span>
                    <div
                      className={`p-2 rounded-full transition-colors ${
                        showImpostorCategory
                          ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20"
                          : "bg-white/10 text-white/30"
                      }`}
                    >
                      {showImpostorCategory ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </div>
                  </GlassCard>

                  {/* Impostor Hint Toggle */}
                  <GlassCard
                    onClick={() => setShowImpostorHint(!showImpostorHint)}
                    className={`flex flex-col items-center justify-center p-4 gap-3 cursor-pointer active:scale-95 transition-all ${
                      showImpostorHint
                        ? "bg-emerald-900/20 border-emerald-500/30"
                        : "bg-white/5"
                    }`}
                  >
                    <span
                      className={`text-xs font-bold uppercase tracking-wide text-center ${
                        showImpostorHint ? "text-emerald-300" : "text-blue-200"
                      }`}
                    >
                      Pista
                    </span>
                    <div
                      className={`p-2 rounded-full transition-colors ${
                        showImpostorHint
                          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                          : "bg-white/10 text-white/30"
                      }`}
                    >
                      {showImpostorHint ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </div>
                  </GlassCard>
                </div>
              </div>
            </div>

            <StickyFooter>
              <button
                onClick={startGame}
                disabled={players.length < 3}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg disabled:opacity-50 disabled:grayscale transition-all active:scale-95 hover:shadow-blue-500/25 border border-white/10"
              >
                {players.length < 3
                  ? `Faltan ${3 - players.length} Jugadores`
                  : "Comenzar Partida"}
              </button>
            </StickyFooter>
          </div>
        )}

        {/* ROLE REVEAL (HOLD TO REVEAL) */}
        {currentScreen === "role-reveal" && (
          <div className="flex flex-col h-screen animate-fadeIn bg-slate-900">
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center perspective-container">
              <div
                className={`w-full transition-all duration-400 ${
                  isCardTransitioning
                    ? "opacity-0 scale-95 -translate-x-20"
                    : "opacity-100 scale-100 translate-x-0"
                }`}
              >
                <RoleCard
                  isFlipped={isCardFlipped}
                  onStartReveal={handleStartReveal}
                  onStopReveal={handleStopReveal}
                  player={gameData?.players[currentPlayerIndex]}
                  role={gameData?.roles[currentPlayerIndex]}
                  category={gameData?.category}
                  word={gameData?.secretWord}
                  wordHint={gameData?.wordHint}
                  showHint={showImpostorHint}
                  showCategory={showImpostorCategory}
                />
              </div>

              {/* El botón aparece SOLO si has revelado al menos una vez Y NO estás pulsando actualmente */}
              <div
                className={`mt-10 transition-all duration-300 ${
                  hasRevealedOnce && !isCardFlipped && !isCardTransitioning
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 pointer-events-none"
                }`}
              >
                <button
                  onClick={nextPlayer}
                  disabled={isCardTransitioning}
                  className="bg-white text-slate-900 font-bold py-4 px-12 rounded-full shadow-[0_0_25px_rgba(255,255,255,0.4)] active:scale-95 transition hover:bg-blue-50 uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentPlayerIndex < gameData?.players.length - 1
                    ? "Continuar"
                    : "Empezar"}
                </button>
              </div>

              {!isCardFlipped && !hasRevealedOnce && !isCardTransitioning && (
                <div className="absolute bottom-10 text-white/40 text-xs font-medium animate-pulse">
                  Pasa el móvil a {gameData?.players[currentPlayerIndex]}
                </div>
              )}
            </div>
          </div>
        )}

        {/* GAME PLAY - DEBATE */}
        {currentScreen === "debate" && (
          <div className="flex flex-col h-screen animate-slideIn">
            <Header
              title={`Ronda ${currentRound}`}
              rightElement={
                <div className="bg-white/10 border border-white/10 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                  {alivePlayers.length} Vivos
                </div>
              }
            />

            <div className="flex-1 overflow-y-auto p-5">
              <GlassCard className="p-4 mb-6 bg-orange-500/10 border-orange-500/20 flex gap-3 items-center">
                <div className="bg-orange-500 p-2 rounded-lg shrink-0">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <p className="text-orange-100 text-sm font-medium leading-snug">
                  Cada jugador dice una palabra relacionada. Debatid quién es el
                  impostor.
                </p>
              </GlassCard>

              <div className="mb-6">
                <h3 className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-3">
                  Comienza el debate
                </h3>
                <GlassCard className="p-4 bg-white/5 border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {debateStartPlayer + 1}
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">
                        {gameData?.players[debateStartPlayer]}
                      </p>
                      <p className="text-blue-200/60 text-xs">
                        Empieza la ronda
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </div>

              <div>
                <h3 className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-3">
                  Jugadores en partida
                </h3>
                <div className="space-y-2">
                  {alivePlayers.map((playerIdx) => (
                    <GlassCard
                      key={playerIdx}
                      className="p-3 bg-white/5 border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white/60 font-bold text-sm">
                          {playerIdx + 1}
                        </div>
                        <span className="text-white font-medium">
                          {gameData?.players[playerIdx]}
                        </span>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            </div>

            <StickyFooter>
              <button
                onClick={startVoting}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition hover:shadow-orange-500/25"
              >
                Ir a Votación
              </button>
            </StickyFooter>
          </div>
        )}

        {/* VOTING */}
        {currentScreen === "voting" && (
          <div className="flex flex-col h-screen animate-slideIn">
            <Header title="Votación" />
            <div className="flex-1 overflow-y-auto p-5">
              <div className="text-center mb-8">
                <h2 className="text-white text-2xl font-bold mb-2">
                  ¿Quién es el impostor?
                </h2>
                <p className="text-blue-200/60 text-sm">
                  Debatid y tocad al jugador para expulsar.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {alivePlayers.map((playerIdx) => (
                  <button
                    key={playerIdx}
                    onClick={() => setVotedPlayer(playerIdx)}
                    className={`p-5 rounded-2xl font-bold text-sm transition-all relative overflow-hidden group ${
                      votedPlayer === playerIdx
                        ? "bg-red-500 text-white shadow-lg shadow-red-500/30 ring-2 ring-white scale-[1.02]"
                        : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {gameData?.players[playerIdx]}
                    {votedPlayer === playerIdx && (
                      <div className="absolute top-2 right-2 animate-bounce-slight">
                        <Target className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <StickyFooter>
              <button
                onClick={revealResult}
                disabled={votedPlayer === null}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-4 rounded-2xl shadow-lg disabled:opacity-50 disabled:grayscale active:scale-95 transition border border-white/10"
              >
                Confirmar Expulsión
              </button>
            </StickyFooter>
          </div>
        )}

        {/* EXPULSION REVEAL */}
        {currentScreen === "expulsion" && gameData && votedPlayer !== null && (
          <ExpulsionScreen
            gameData={gameData}
            votedPlayer={votedPlayer}
            onContinue={continueToNextRound}
            isGameEnd={checkGameEnd()}
          />
        )}

        {/* GAME END */}
        {currentScreen === "game-end" && gameData && (
          <div className="flex flex-col h-screen animate-fadeIn">
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              {(() => {
                const aliveRoles = alivePlayers.map(
                  (idx) => gameData.roles[idx]
                );
                const aliveImpostors = aliveRoles.filter(
                  (r) => r === "impostor"
                ).length;
                const innocentsWon = aliveImpostors === 0;

                return (
                  <>
                    <div className="relative mb-8">
                      <div
                        className={`absolute inset-0 blur-3xl opacity-30 animate-pulse ${
                          innocentsWon ? "bg-emerald-500" : "bg-red-500"
                        }`}
                      ></div>
                      <div
                        className={`w-32 h-32 rounded-[2rem] flex items-center justify-center relative z-10 shadow-2xl border-4 ${
                          innocentsWon
                            ? "bg-emerald-500 border-emerald-300"
                            : "bg-red-500 border-red-300"
                        }`}
                      >
                        <Trophy className="w-16 h-16 text-white" />
                      </div>
                    </div>

                    <h1 className="text-5xl font-black text-white mb-4 tracking-tight">
                      {innocentsWon ? "¡Victoria!" : "¡Derrota!"}
                    </h1>
                    <p
                      className={`text-2xl font-bold mb-8 uppercase tracking-widest ${
                        innocentsWon ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      Ganan {innocentsWon ? "Ciudadanos" : "Impostores"}
                    </p>

                    <GlassCard className="w-full max-w-sm mb-6 p-6">
                      <p className="text-white/40 text-xs uppercase font-bold mb-2 tracking-widest">
                        Palabra Secreta
                      </p>
                      <p className="text-3xl font-bold text-white mb-4">
                        {gameData.secretWord}
                      </p>
                      <p className="text-white/60 text-sm">
                        Rondas jugadas:{" "}
                        <span className="font-bold text-white">
                          {currentRound}
                        </span>
                      </p>

                      {!innocentsWon && (
                        <>
                          <div className="w-full h-px bg-white/10 my-4"></div>
                          <p className="text-white/40 text-xs uppercase font-bold mb-2 tracking-widest">
                            {gameData.impostorIndices.length > 1
                              ? "Los Impostores"
                              : "El Impostor"}
                          </p>
                          <div className="flex flex-wrap gap-2 justify-around">
                            {gameData.impostorIndices.map((idx) => (
                              <span
                                key={idx}
                                className="bg-red-500/20 border border-red-500/30 text-red-300 px-3 py-1.5 rounded-lg text-sm font-bold"
                              >
                                {gameData.players[idx]}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </GlassCard>

                    <div className="flex gap-3 w-full max-w-sm">
                      <button
                        onClick={() => setCurrentScreen("menu")}
                        className="flex-1 bg-white/5 border border-white/10 text-white font-bold py-4 rounded-2xl hover:bg-white/10 transition"
                      >
                        Menú
                      </button>
                      <button
                        onClick={resetGame}
                        className="flex-[2] bg-white text-slate-900 font-bold py-4 rounded-2xl shadow-xl hover:bg-blue-50 transition"
                      >
                        Jugar de Nuevo
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* CATEGORY MODAL */}
        {showCategoryLibrary && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
            <div className="bg-[#1e293b] border border-white/10 w-full max-w-md rounded-3xl h-[85vh] flex flex-col overflow-hidden animate-slideUp shadow-2xl">
              <div className="p-5 border-b border-white/10 flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Buscar categorías..."
                  className="flex-1 outline-none text-lg bg-transparent text-white placeholder-gray-500"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                />
                <button
                  onClick={() => setShowCategoryLibrary(false)}
                  className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                <div className="grid grid-cols-1 gap-3">
                  {filteredCategories.map((cat) => {
                    const IconComponent = cat.icon;
                    const isSelected = selectedCategories.includes(cat.name);
                    return (
                      <button
                        key={cat.name}
                        onClick={() => toggleCategory(cat.name)}
                        className={`relative p-4 rounded-2xl font-bold text-base border-2 transition-all duration-200 flex items-center gap-4 ${
                          isSelected
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400 shadow-lg shadow-blue-500/30 scale-[1.02]"
                            : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/20"
                        }`}
                      >
                        <div
                          className={`p-3 rounded-xl transition-all ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-white/5 text-gray-400"
                          }`}
                        >
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="flex-1 text-left">{cat.name}</span>
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-blue-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-5 bg-black/20 border-t border-white/5 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {selectedCategories.length} Seleccionadas
                </span>
                <button
                  onClick={() => setShowCategoryLibrary(false)}
                  className="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-blue-50 transition"
                >
                  Listo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateX(30px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-bounce-slight {
          animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(-3%);
          }
          50% {
            transform: translateY(0);
          }
        }

        /* CARD FLIP STYLES */
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden; /* Safari fix */
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
