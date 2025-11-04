// Initialize socket connection using config
const socket = io(CONFIG.SERVER_URL, CONFIG.SOCKET_OPTIONS);

let currentRoom = "";
let roomsettings = {};
roomsettings.wordwrite = "all";
roomsettings.blanconumber = 1;

const frontpage = document.getElementById("frontpage");
const createbutton = document.getElementById("create");
const joinbutton = document.getElementById("join");
const createsection = document.getElementById("createsection");
const joinsection = document.getElementById("joinsection");
const namesection = document.getElementById("namesection");
const bottombar = document.getElementById("bottombar");
const loader = document.getElementById("loader");
const nameInput = document.getElementById("nameInput");
const submitButton = document.getElementById("savename");
const changenameButton = document.getElementById("changenameButton");
const hostsettings = document.getElementById("hostsettings");
const playersettings = document.getElementById("playersettings");
const gamesection = document.getElementById("gamesection");
const howtoplaybutton = document.getElementById("howtoplay");
const howtoplaypage = document.getElementById("howtoplaypage");

if (localStorage.getItem("userName")) {
  document.getElementById("changenameButton").style.display = "block";
}

// How to play page functions
function openHowToPlay() {
  // Step 1: Hide front buttons (opacity 0)
  document.querySelector(".front").style.opacity = "0";

  // Step 2: Add subcontainer class and wait
  setTimeout(() => {
    frontpage.classList.add("subcontainer");

    // Step 3: Hide buttons with visibility and prepare howtoplay section
    setTimeout(() => {
      // Hide all main buttons with visibility (maintains space and styles)
      document.querySelector(".front").style.visibility = "hidden";

      // Show howtoplay section with opacity 0
      howtoplaypage.style.opacity = "0";
      howtoplaypage.style.display = "block";

      // Step 4: Fade in howtoplay section
      setTimeout(() => {
        howtoplaypage.style.opacity = "1";
      }, 300);
    }, 400);
  }, 10);
}

function backToHome() {
  // Step 1: Fade out howtoplay section
  howtoplaypage.style.opacity = "0";

  // Step 2: Hide section and remove subcontainer
  setTimeout(() => {
    howtoplaypage.style.display = "none";
    frontpage.classList.remove("subcontainer");

    // Step 3: Show buttons with visibility
    setTimeout(() => {
      document.querySelector(".front").style.visibility = "visible";

      // Step 4: Fade in buttons
      setTimeout(() => {
        document.querySelector(".front").style.opacity = "1";
      }, 50);
    }, 300);
  }, 300);
}

// Add event listener to how to play button
howtoplaybutton.addEventListener("click", openHowToPlay);

function createRoom(name) {
  socket.emit("createRoom", { username: name });
}

function joinRoom(code, name) {
  loader.style.display = "flex";
  socket.emit("joinRoom", { code: code, username: name });
}

function sendGamestatus(data) {
  socket.emit("gamestatus", { roomCode: currentRoom, gamedata: data });
}

function nextRound() {
  socket.emit("words", { roomCode: currentRoom, word: "", order: "continue" });
}

function banPlayer(id) {
  const user = document.getElementById(id);
  if (user) {
    socket.emit("kickPlayer", {
      roomCode: currentRoom,
      player: { id: user.dataset.id },
    });
  }
  bottombar.style.bottom = "-500px";
}

function leave() {
  socket.emit("leaveRoom", { roomCode: currentRoom });
  back();
}

function gamestart() {
  if (roomsettings.blanconumber >= playerlist.length) {
    document.getElementById("topbartext").innerText = "Aviso";
    document.getElementById("normalbar").innerHTML = `
                <div class="contextcontainer">
                    <p class="subtext">NO SE HA PODIDO INICIAR LA PARTIDA. TIENE QUE HABER AL MENOS UN JUGADOR NORMAL.</p>
                </div>
                <button class="button" onclick="settings()" style="margin-top: 7px;">CAMBIAR AJUSTES</button>
                `;
    bottombar.style.bottom = "0";
  } else {
    bottombar.style.bottom = "-500px";
    sendGamestatus({
      state: "start",
      data: roomsettings,
    });
  }
}

function writeword() {
  return new Promise((resolve) => {
    gamesection.innerHTML = `
                <div class="contextcontainer">
                    <p class="subtext">ESCRIBE UNA PALABRA PARA EL JUEGO</p>
                </div>
                <input type="text" id="wordinput" placeholder="Escribe aquí...">
                <button id="continueword" style="margin-top: 7px;">CONTINUAR</button>
                `;
    document
      .getElementById("continueword")
      .addEventListener("click", (event) => {
        if (document.getElementById("wordinput").value) {
          resolve(document.getElementById("wordinput").value);
          gamesection.innerHTML = `
                <div class="contextcontainer">
                    <p class="subtext">ESPERANDO A QUE TODOS ENVÍEN SU PALABRA</p>
                </div>
                `;
        }
      });
  });
}

socket.on("game", (data) => {
  gamestatefunction(data);
});

function gamestatefunction(data) {
  switch (data.state) {
    case "start":
      gamesection.style.opacity = 0;
      createsection.style.opacity = 0;
      frontpage.classList.remove("subcontainer");
      setTimeout(function () {
        createsection.style.display = "none";
        gamesection.style.display = "block";
        setTimeout(function () {
          gamesection.style.opacity = 1;
        }, 300);
      }, 300);
      if (data.data.wordwrite === "all") {
        writeword().then((word) => {
          socket.emit("words", { roomCode: currentRoom, word });
        });
      } else if (data.data.wordwrite === "onlyleader" && role === "leader") {
        writeword().then((word) => {
          socket.emit("words", { roomCode: currentRoom, word, order: "start" });
        });
      } else {
        gamesection.innerHTML = `
                <div class="contextcontainer">
                    <p class="subtext">ESPERANDO A QUE EL LÍDER INTRODUZCA UNA PALABRA</p>
                </div>
                `;
      }

      break;
    case "receivewords":
      // Ocultar botón de skip round del líder
      if (document.getElementById("skipround")) {
        document.getElementById("skipround").style.display = "none";
      }

      // Determinar si el jugador es blanco
      const isBlanco = data.data.blancos.some((user) => user.userId === userId);
      const word = data.data.word;

      // Guardar palabra actual
      window.currentWord = word;

      // Crear interfaz de juego con palabra y votaciones
      gamesection.innerHTML = `
        <div class="game-header">
          ${
            isBlanco
              ? '<p class="role-title blanco-role">ERES BLANCO</p>'
              : '<p class="role-title normal-role">ERES JUGADOR NORMAL</p>'
          }
          ${
            !isBlanco
              ? `
            <div class="word-container">
              <button class="toggle-word-btn" id="toggleWordBtn" onclick="toggleWord()">
                <i class="fa-solid fa-eye"></i> MOSTRAR PALABRA
              </button>
              <div class="word-display hidden" id="wordDisplay">
                <p class="subtext">LA PALABRA ES:</p>
                <p class="text word-text">${word}</p>
              </div>
            </div>
          `
              : ""
          }
        </div>
        
        <div class="voting-section">
          <p class="subtext voting-title">VOTACIÓN - Selecciona a quien expulsar:</p>
          <div class="players-voting-list" id="playersVotingList"></div>
          <div class="votes-display" id="votesDisplay">
            <p class="subtext">Votos en tiempo real:</p>
            <div id="votesContent"></div>
          </div>
          ${
            role === "leader"
              ? '<button class="button end-voting-btn" id="endVotingBtn" onclick="endVoting()">FINALIZAR VOTACIÓN</button>'
              : '<p class="subtext">Esperando a que el líder finalice la votación...</p>'
          }
        </div>
      `;

      // Cargar lista de jugadores para votar
      loadVotingPlayers(data.data.blancos);
      break;
    case "nextRound":
      gamesection.innerHTML = `
        <div class="contextcontainer">
          <p class="text">SIGUIENTE RONDA</p>
          <p class="subtext">${data.message}</p>
        </div>
      `;
      // Volver a mostrar la palabra después de 3 segundos
      setTimeout(() => {
        if (data.currentBlancos && data.remainingPlayers) {
          gamestatefunction({
            state: "receivewords",
            data: {
              word: window.currentWord,
              blancos: data.currentBlancos,
            },
          });
        }
      }, 3000);
      break;
    case "gameOver":
      document.getElementById("skipround").style.display = "none";
      gamesection.innerHTML = `
        <div class="game-over-container">
          <p class="text">${
            data.winner === "normales" ? "¡VICTORIA!" : "¡DERROTA!"
          }</p>
          <p class="secondtitle">${data.message}</p>
          ${
            data.blancos
              ? `
            <div class="contextcontainer">
              <p class="subtext">Los blancos eran:</p>
              ${data.blancos
                .map((b) => `<p class="subtext">${b.username}</p>`)
                .join("")}
            </div>
          `
              : ""
          }
          <button class="button" onclick="backToLobby()">VOLVER AL LOBBY</button>
        </div>
      `;
      break;
    case "end":
      document.getElementById("skipround").style.display = "none";
      gamesection.style.opacity = 0;
      createsection.style.opacity = 0;
      frontpage.classList.add("subcontainer");
      setTimeout(function () {
        createsection.style.display = "block";
        gamesection.style.display = "none";
        setTimeout(function () {
          createsection.style.opacity = 1;
        }, 300);
      }, 300);
      break;
  }
}

function updatePlayerList(players) {
  const playersContainer = document.getElementById("playerscontainer");
  playersContainer.innerHTML = ""; // Limpiar contenedor de jugadores
  players.forEach((player) => {
    playersContainer.insertAdjacentHTML(
      "beforeend",
      `
            <div class="playercontainer fullcontainer" id="${player.userId}" data-id="${player.userId}" data-username="${player.username}" onclick="getUser(this.id)">
                <p class="subtext">${player.username}</p>
            </div>
        `
    );
  });
  updatestartbutton(players.length);
}

socket.on("roomCreated", (roomCode) => {
  window.userId = roomCode.user;
  window.role = "leader";
  currentRoom = roomCode.code;
  loader.style.display = "none";
  createsection.style.opacity = 1;
  createsection.style.display = "block";
  hostsettings.style.display = "flex";
  playersettings.style.display = "none";
  document.getElementById("waitingplayers").style.display = "block";
  makeCode(roomCode.code);
  document.getElementById("createroomcode").innerText = roomCode.code;
  updatePlayerList([{ userId: roomCode.user, username: roomCode.username }]);
});

socket.on("playerListUpdate", (data) => {
  window.playerlist = data.players;
  updatePlayerList(data.players);
});

function updatestartbutton(playersCount) {
  if (role === "leader") {
    if (playersCount > 1) {
      if (document.getElementById("waitingplayers")) {
        document.getElementById("waitingplayers").outerHTML =
          '<button class="button fullcontainer" style="color:#51a14c;" id="startgame" onclick="gamestart()">INICIAR</button>';
      }
    } else {
      if (document.getElementById("startgame")) {
        document.getElementById("startgame").outerHTML =
          '<p class="subtext" id="waitingplayers">Esperando jugadores...</p>';
      }
    }
  }
}

function getUser(id) {
  if (role === "leader") {
    if (id != userId) {
      bottombar.style.bottom = "0px";
      const user = document.getElementById(id).dataset;
      document.getElementById("topbartext").innerText = user.username;
      document.getElementById("normalbar").innerHTML = `
                <button class="normalbutton" onclick="banPlayer('${id}')">Expulsar</button>`;
      //       <button class="normalbutton">Hacer líder del grupo</button>
    }
  }
}

function confirmleave() {
  document.getElementById("topbartext").innerText = "¿Estás seguro?";
  document.getElementById("normalbar").innerHTML = `
        <button class="button" onclick="leave()">Salir</button>
        <button class="button" onclick="togglebar()">Cancelar</button>`;
  bottombar.style.bottom = "0px";
}

function settings() {
  function returncheckbox(setting, type) {
    if (setting === type) {
      return "checked";
    } else {
      return "";
    }
  }
  function returninput(setting) {
    if (setting) {
      return "value=" + setting;
    } else {
      return "";
    }
  }
  document.getElementById("topbartext").innerText = "Ajustes";
  document.getElementById("normalbar").innerHTML = `
    <div id="settings">
        <div class="switch-container">
            <label class="switch">
                <input type="checkbox" id="onlyleadercheckbox" onchange="setting(1,this)" ${returncheckbox(
                  roomsettings.wordwrite,
                  "onlyleader"
                )}>
                <span class="slider"></span>
            </label>
            <label class="switch-label">Solo el líder escribe las palaras</label>
        </div>
        <div class="switch-container">
            <label class="switch">
                <input type="checkbox" id="allcheckbox" onchange="setting(2,this)" ${returncheckbox(
                  roomsettings.wordwrite,
                  "all"
                )}>
                <span class="slider"></span>
            </label>
            <label class="switch-label">Todos los jugadores escriben las palabras</label>
        </div>
        <div class="switch-container">
            <input type="number" ${returninput(
              roomsettings.blanconumber
            )} onchange="setting(3,this)">
            <label class="switch-label">Blancos en la partida</label>
        </div>
    </div>
        `;
  bottombar.style.bottom = "0px";
}

function setting(type, checkbox) {
  switch (type) {
    case 1:
      if (checkbox.checked === true) {
        roomsettings.wordwrite = "onlyleader";
        document.getElementById("allcheckbox").checked = false;
      } else {
        roomsettings.wordwrite = "all";
        document.getElementById("allcheckbox").checked = true;
      }
      break;
    case 2:
      if (checkbox.checked === true) {
        roomsettings.wordwrite = "all";
        document.getElementById("onlyleadercheckbox").checked = false;
      } else {
        roomsettings.wordwrite = "onlyleader";
        document.getElementById("onlyleadercheckbox").checked = true;
      }
      break;
    case 3:
      roomsettings.blanconumber = checkbox.value;
      break;
  }
}

socket.on("joinedRoom", (roomCode) => {
  if (roomCode.success) {
    window.userId = roomCode.user;
    window.role = "player";
    currentRoom = roomCode.code;
    makeCode(roomCode.code);
    document.getElementById("waitingplayers").style.display = "none";
    loader.style.display = "none";
    if (roomCode.emitdata !== undefined) {
      document.getElementById("mainalert").style.display = "none";
      gamesection.style.opacity = 0;
      createsection.style.opacity = 0;
      frontpage.classList.remove("subcontainer");
      setTimeout(function () {
        createsection.style.display = "none";
        gamesection.style.display = "block";
        setTimeout(function () {
          gamesection.style.opacity = 1;
          gamestatefunction(roomCode.emitdata);
        }, 300);
      }, 300);
    } else {
      createsection.style.opacity = 1;
      createsection.style.display = "block";

      //        document.getElementsByClassName("playerscontainer")[0].style.paddingTop = '1px';
    }
    document.getElementById("createroomcode").innerText = roomCode.code;
    playersettings.style.display = "flex";
    hostsettings.style.display = "none";
  } else {
    switch (roomCode.errorcode) {
      case 1:
        pedirNombre(roomCode.msg, true).then((nombre) => {
          joinRoom(roomCode.code, nombre);
        });
        break;
      case 2:
        document.getElementById("mainalerttext").innerText = roomCode.msg;
        document.getElementById("mainalert").style.display = "block";
        break;
      default:
        document.getElementById("errortext").innerText = roomCode.msg;
        joinsection.style.display = "block";
        document.getElementById("num1").value = "";
        document.getElementById("num2").value = "";
        document.getElementById("num3").value = "";
        document.getElementById("num4").value = "";
        setTimeout(function () {
          loader.style.display = "none";
          joinsection.style.opacity = 1;
        }, 200);
        break;
    }
  }
});

socket.on("exitRoom", (roomCode) => {
  if (document.getElementById(roomCode.user)) {
    document.getElementById(roomCode.user).remove();
  }
  const playersCount =
    document.getElementById("playerscontainer").childElementCount;
  updatestartbutton(playersCount);
});

socket.on("kicked", (roomCode) => {
  const playerElement = document.getElementById(roomCode.user);
  if (userId === roomCode.user) {
    document.getElementById("alerttext").innerText = roomCode.msg;
    document.getElementById("alert").style.display = "block";
    leave();
  } else if (playerElement) {
    playerElement.remove();
  }
});

socket.on("message", (message) => {
  console.log(message);
});

socket.on("error", (message) => {
  alert(message);
});

changenameButton.addEventListener("click", function () {
  frontpage.classList.add("subcontainer");
  setTimeout(function () {
    document.getElementById("alert").style.display = "none";
    setfrontbuttons(1, "none");
    pedirNombre(undefined, true).then(() => {
      back();
    });
  }, 300);
});

createbutton.addEventListener("click", function () {
  frontpage.classList.add("subcontainer");
  setTimeout(function () {
    document.getElementById("alert").style.display = "none";
    setfrontbuttons(1, "none");
    pedirNombre().then((nombre) => {
      loader.style.display = "flex";
      createRoom(nombre);
    });
  }, 300);
});

joinbutton.addEventListener("click", function () {
  setfrontbuttons(2, 0);
  frontpage.classList.add("subcontainer");

  setTimeout(function () {
    document.getElementById("alert").style.display = "none";
    setfrontbuttons(1, "none");
    joinsection.style.opacity = 0;
    joinsection.style.display = "block";
    setTimeout(function () {
      loader.style.display = "none";
      joinsection.style.opacity = 1;
    }, 300);
  }, 400);
});

function pedirNombre(error, allowChange = false) {
  return new Promise((resolve) => {
    // Verificar si el nombre ya está guardado en localStorage
    const savedName = localStorage.getItem("userName");
    if (savedName && !allowChange) {
      resolve(savedName);
      return;
    } else if (savedName) {
      nameInput.value = savedName;
    }

    // Mostrar mensaje de error si existe
    if (error != undefined) {
      document.getElementById("namealerttext").innerText = error;
      document.getElementById("namealert").style.display = "block";
    } else {
      document.getElementById("namealert").style.display = "none";
    }

    namesection.style.opacity = 0;
    namesection.style.display = "block";
    setTimeout(function () {
      loader.style.display = "none";
      namesection.style.opacity = 1;
    }, 300);

    function handleSubmit() {
      const name = nameInput.value;
      if (name) {
        // Guardar el nombre en localStorage
        localStorage.setItem("userName", name);
        namesection.style.opacity = 0;
        setTimeout(function () {
          resolve(name);
          namesection.style.display = "none";
        }, 300);
      }
    }

    submitButton.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        handleSubmit();
      }
    });

    submitButton.addEventListener("click", () => {
      handleSubmit();
    });
  });
}

function back() {
  setfrontbuttons(2, 0);
  frontpage.classList.remove("subcontainer");
  gamesection.style.opacity = 0;
  namesection.style.opacity = 0;
  createsection.style.opacity = 0;
  joinsection.style.opacity = 0;
  bottombar.style.bottom = "-500px";
  setTimeout(function () {
    setfrontbuttons(1, "inline-block");
    document.getElementById("errortext").innerText = "";
    document.getElementById("num1").value = "";
    document.getElementById("num2").value = "";
    document.getElementById("num3").value = "";
    document.getElementById("num4").value = "";
    setTimeout(function () {
      gamesection.style.display = "none";
      createsection.style.display = "none";
      namesection.style.display = "none";
      joinsection.style.display = "none";
      setfrontbuttons(2, 1);
    }, 200);
  }, 400);
}

function togglebar() {
  if (bottombar.style.bottom === "0px") {
    bottombar.style.bottom = "-500px";
  } else {
    bottombar.style.bottom = "0px";
  }
}

document
  .getElementById("num1")
  .addEventListener("keydown", (event) => handleInput(event, "num1", 0));
document
  .getElementById("num2")
  .addEventListener("keydown", (event) => handleInput(event, "num2", 1));
document
  .getElementById("num3")
  .addEventListener("keydown", (event) => handleInput(event, "num3", 2));
document
  .getElementById("num4")
  .addEventListener("keydown", (event) => handleInput(event, "num4", 3));

document
  .getElementById("num1")
  .addEventListener("input", (event) => getCode(event, "num1", 0));
document
  .getElementById("num2")
  .addEventListener("input", (event) => getCode(event, "num2", 1));
document
  .getElementById("num3")
  .addEventListener("input", (event) => getCode(event, "num3", 2));
document
  .getElementById("num4")
  .addEventListener("input", (event) => getCode(event, "num4", 3));

function handleInput(event, currentInputId, index) {
  const currentInput = document.getElementById(currentInputId);
  const nextInputId =
    index < 3 ? ["num1", "num2", "num3", "num4"][index + 1] : null;
  const prevInputId =
    index > 0 ? ["num1", "num2", "num3", "num4"][index - 1] : null;

  if (
    event.key === "Backspace" &&
    currentInput.value.length === 0 &&
    prevInputId
  ) {
    document.getElementById(prevInputId).focus();
  }

  if (currentInput.value.length === 1 && nextInputId) {
    document.getElementById(nextInputId).focus();
  }
}

function getCode() {
  const num1 = document.getElementById("num1").value;
  const num2 = document.getElementById("num2").value;
  const num3 = document.getElementById("num3").value;
  const num4 = document.getElementById("num4").value;

  const allInputs = num1 + num2 + num3 + num4;

  if (allInputs.length === 4) {
    joinsection.style.opacity = 0;
    setTimeout(function () {
      joinsection.style.display = "none";
      pedirNombre().then((nombre) => {
        joinRoom(allInputs, nombre);
      });
    }, 200);
  }
}

let params = new URLSearchParams(document.location.search);
if (params.has("code")) {
  setfrontbuttons(2, 0);
  frontpage.classList.add("subcontainer");

  setTimeout(function () {
    setfrontbuttons(1, "none");
    pedirNombre().then((nombre) => {
      joinRoom(params.get("code"), nombre);
    });
  }, 400);
}

function setfrontbuttons(type, setting) {
  switch (type) {
    case 1:
      document.querySelectorAll(".front").forEach(function (button) {
        button.style.display = setting;
      });
      break;
    case 2:
      document.querySelectorAll(".front").forEach(function (button) {
        button.style.opacity = setting;
      });
      break;
  }
}

function makeCode(code) {
  document.getElementById("qrcode").innerHTML = "";
  const link = window.location.origin + "?code=" + code;
  var qrcode = new QRCode(document.getElementById("qrcode"), {
    text: link,
    width: 300, // Puedes ajustar el tamaño si es necesario
    height: 300, // Puedes ajustar el tamaño si es necesario
    colorDark: "#000000", // Color del QR
    colorLight: "#00000000", // Color del fondo
    correctLevel: QRCode.CorrectLevel.H, // Nivel de corrección de errores
  });
  qrcode.makeCode(link);
}

function shareLink() {
  const link = window.location.origin + "?code=" + currentRoom;
  const shareData = {
    title: "BLANCO - Milmarcos edition",
    text:
      "¡Únete a la partida! con el código " +
      currentRoom +
      " o desde este enlace: ",
    url: link,
  };

  // Check if navigator.share is supported
  if (navigator.share) {
    navigator
      .share(shareData)
      .then(() => {
        console.log("Compartido exitosamente");
      })
      .catch((error) => {
        console.error("Error al compartir:", error);
        // Fallback: copiar al portapapeles
        copyToClipboard(link);
      });
  } else {
    // Fallback para navegadores que no soportan Web Share API
    copyToClipboard(link);
  }
}

// ========== SISTEMA DE VOTACIONES ==========

let currentVote = null;
window.currentWord = null;

// Mostrar/ocultar palabra
window.toggleWord = function toggleWord() {
  const wordDisplay = document.getElementById("wordDisplay");
  const toggleBtn = document.getElementById("toggleWordBtn");

  if (wordDisplay.classList.contains("hidden")) {
    wordDisplay.classList.remove("hidden");
    toggleBtn.innerHTML =
      '<i class="fa-solid fa-eye-slash"></i> OCULTAR PALABRA';
  } else {
    wordDisplay.classList.add("hidden");
    toggleBtn.innerHTML = '<i class="fa-solid fa-eye"></i> MOSTRAR PALABRA';
  }
};

// Cargar lista de jugadores para votar
function loadVotingPlayers(blancos) {
  const playersVotingList = document.getElementById("playersVotingList");
  if (!playersVotingList) return;

  playersVotingList.innerHTML = "";

  // Filtrar jugadores vivos (excluir al jugador actual)
  const votablePlayers = window.playerlist.filter((p) => p.userId !== userId);

  votablePlayers.forEach((player) => {
    const isBlanco = blancos.some((b) => b.userId === player.userId);
    playersVotingList.insertAdjacentHTML(
      "beforeend",
      `
      <div class="player-vote-item ${
        currentVote === player.userId ? "voted" : ""
      }" 
           id="vote-${player.userId}" 
           onclick="votePlayer('${player.userId}', '${player.username}')">
        <p class="subtext">${player.username}</p>
        <div class="vote-indicator" id="indicator-${player.userId}">
          <i class="fa-solid fa-circle-check"></i>
        </div>
      </div>
      `
    );
  });
}

// Votar a un jugador
window.votePlayer = function votePlayer(playerId, playerName) {
  // Actualizar voto actual
  currentVote = playerId;

  // Actualizar UI
  document.querySelectorAll(".player-vote-item").forEach((item) => {
    item.classList.remove("voted");
  });
  document.getElementById(`vote-${playerId}`).classList.add("voted");

  // Enviar voto al servidor
  socket.emit("vote", {
    roomCode: currentRoom,
    votedPlayerId: playerId,
  });

  console.log(`Votaste a ${playerName}`);
};

// Finalizar votación (solo líder)
window.endVoting = function endVoting() {
  if (role !== "leader") return;

  socket.emit("endVoting", {
    roomCode: currentRoom,
  });
};

// Recibir actualizaciones de votos en tiempo real
socket.on("votesUpdate", (data) => {
  const { votes, players } = data;
  const votesContent = document.getElementById("votesContent");
  if (!votesContent) return;

  votesContent.innerHTML = "";

  // Contar votos por jugador
  const voteCount = {};
  Object.entries(votes).forEach(([voterId, votedId]) => {
    if (!voteCount[votedId]) {
      voteCount[votedId] = [];
    }
    const voter = players.find((p) => p.userId === voterId);
    if (voter) {
      voteCount[votedId].push(voter.username);
    }
  });

  // Mostrar votos
  Object.entries(voteCount).forEach(([playerId, voters]) => {
    const player = players.find((p) => p.userId === playerId);
    if (player) {
      votesContent.insertAdjacentHTML(
        "beforeend",
        `
        <div class="vote-count-item">
          <p class="subtext"><strong>${player.username}</strong>: ${
          voters.length
        } voto(s)</p>
          <p class="vote-details">${voters.join(", ")}</p>
        </div>
        `
      );
    }
  });

  if (Object.keys(voteCount).length === 0) {
    votesContent.innerHTML = '<p class="subtext">Aún no hay votos...</p>';
  }
});

// Jugador eliminado
socket.on("playerEliminated", (data) => {
  const { player, wasBlanco, votes } = data;

  gamesection.innerHTML = `
    <div class="elimination-container">
      <p class="text">JUGADOR ELIMINADO</p>
      <p class="secondtitle">${player.username}</p>
      <p class="subtext">${
        wasBlanco ? "¡ERA UN BLANCO!" : "Era un jugador normal"
      }</p>
      <div class="votes-result">
        <p class="subtext">Votos recibidos: ${votes[player.userId] || 0}</p>
      </div>
      <p class="subtext">Preparando siguiente ronda...</p>
    </div>
  `;
});

// Sin eliminación
socket.on("noElimination", (data) => {
  gamesection.innerHTML = `
    <div class="contextcontainer">
      <p class="text">SIN ELIMINACIÓN</p>
      <p class="subtext">${data.message}</p>
    </div>
  `;
});

// Volver al lobby después de game over
window.backToLobby = function backToLobby() {
  gamesection.style.opacity = 0;
  setTimeout(() => {
    gamesection.style.display = "none";
    createsection.style.display = "block";
    createsection.style.opacity = 0;
    frontpage.classList.add("subcontainer");
    setTimeout(() => {
      createsection.style.opacity = 1;
    }, 300);
  }, 300);
};

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showAlert("¡Enlace copiado al portapapeles!", "success");
      })
      .catch((err) => {
        console.error("Error al copiar:", err);
        fallbackCopyToClipboard(text);
      });
  } else {
    fallbackCopyToClipboard(text);
  }
}

function fallbackCopyToClipboard(text) {
  // Método alternativo para copiar
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    if (successful) {
      showAlert("¡Enlace copiado al portapapeles!", "success");
    } else {
      showAlert("No se pudo copiar. Código: " + currentRoom, "error");
    }
  } catch (err) {
    console.error("Error al copiar:", err);
    showAlert("No se pudo copiar. Código: " + currentRoom, "error");
  }

  document.body.removeChild(textArea);
}

function showAlert(message, type) {
  const alert = document.getElementById("alert");
  const alertText = document.getElementById("alerttext");

  alertText.innerText = message;
  alert.style.display = "block";
  alert.style.backgroundColor = type === "success" ? "#d4edda" : "#f8d7da";

  setTimeout(() => {
    alert.style.display = "none";
  }, 3000);
}
