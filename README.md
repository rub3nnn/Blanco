# 🎮 BLANCO

<div align="center">

![Version](https://img.shields.io/badge/version-1.0-blue.svg)
![Status](https://img.shields.io/badge/status-beta-yellow.svg)
![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?logo=vite)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Un juego social de deducción y engaño para jugar con amigos**

🎮 **[Juega ahora en blanco.rub3n.es](https://blanco.rub3n.es)**

[Características](#-características) • [Instalación](#-instalación) • [Cómo Jugar](#-cómo-jugar) • [Desarrollo](#-desarrollo)

</div>

---

## 📖 Descripción

**BLANCO** es un juego de deducción social inspirado en juegos como "Undercover" donde los jugadores deben descubrir quién es el impostor. Los jugadores inocentes conocen una palabra secreta, mientras que el impostor debe fingir que la conoce sin ser descubierto.

## ✨ Características

- 🎭 **Roles Dinámicos**: Inocentes vs Impostores
- 📚 **12 Categorías**: Desde películas hasta deportes, pasando por comida, animales, profesiones y más
- 🎲 **Sistema de Palabras**: Base de datos con cientos de palabras organizadas por categoría
- 🔄 **Múltiples Rondas**: Sistema de votación por rondas hasta encontrar al impostor
- 💡 **Ayudas Opcionales**: Revela la categoría o pistas al impostor
- 📱 **Diseño Responsive**: Optimizado para dispositivos móviles
- 🎨 **Interfaz Moderna**: Diseño glassmorphism con animaciones fluidas
- 💾 **Persistencia Local**: Guarda jugadores y palabras usadas

## 🎯 Cómo Jugar

### Objetivo

- **Inocentes**: Descubrir quién es el impostor antes de que pasen desapercibidos
- **Impostor**: Fingir que conoces la palabra secreta sin ser descubierto

### Mecánica del Juego

1. **Configuración Inicial**

   - Añade 3 o más jugadores
   - Selecciona las categorías de palabras
   - Configura el número de impostores (1-3)

2. **Revelación de Roles**

   - Cada jugador mira su carta de forma privada
   - Los inocentes ven la palabra secreta
   - El impostor NO conoce la palabra

3. **Rondas de Debate**

   - Por turnos, cada jugador dice una palabra relacionada
   - Los inocentes deben ser sutiles pero creíbles
   - El impostor debe deducir y fingir convincentemente

4. **Votación**

   - Después del debate, todos votan
   - El jugador más votado es expulsado
   - Si es el impostor, ganan los inocentes
   - Si es inocente, continúa el juego

5. **Condiciones de Victoria**
   - **Inocentes ganan**: Expulsan al impostor
   - **Impostor gana**: Sobrevive hasta ser minoría (1v1)

### Opciones Avanzadas

- **Revelar Categoría**: Hace visible al impostor de qué categoría es la palabra
- **Revelar Pista**: Da una pista muy clara al impostor (recomendado para grupos pequeños)

## 🚀 Instalación

### Requisitos Previos

- Node.js 18.0 o superior
- npm o yarn

### Pasos de Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tuusuario/blanco.git
cd blanco

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev

# Compilar para producción
npm run build
```

## 🛠️ Desarrollo

### Tecnologías Utilizadas

- **React 19** - Biblioteca principal de UI
- **Vite 7** - Build tool y dev server ultrarrápido
- **Tailwind CSS 4** - Framework de estilos utility-first
- **Lucide React** - Iconos modernos
- **LocalStorage** - Persistencia de datos del cliente

### Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo en http://localhost:5173
npm run build    # Compilar para producción
npm run preview  # Vista previa de la build de producción
npm run lint     # Ejecutar ESLint
```

### Estructura del Proyecto

```
blanco/
├── public/           # Archivos estáticos
├── src/
│   ├── assets/       # Imágenes y recursos
│   ├── components/   # Componentes React
│   │   ├── ui/       # Componentes UI reutilizables
│   │   └── screens/  # Pantallas principales
│   ├── data/         # Base de datos de palabras
│   │   └── es-es/    # Palabras en español
│   ├── hooks/        # Custom React hooks
│   ├── styles/       # Estilos globales
│   ├── utils/        # Utilidades y helpers
│   ├── App.jsx       # Componente principal
│   ├── main.jsx      # Entry point
│   └── index.css     # Estilos base
├── index.html        # HTML principal
├── package.json      # Dependencias y scripts
├── vite.config.js    # Configuración de Vite
└── eslint.config.js  # Configuración de ESLint
```

### Categorías Disponibles

El juego incluye 12 categorías con sus respectivas bases de datos:

- 🎬 Cine y Series
- 🍕 Comida y Bebida
- 📦 Objetos
- 🐕 Animales
- 💼 Profesiones
- 🌍 Países
- 🏙️ Ciudades
- ⚽ Deportes
- 🎵 Música
- 🎮 Videojuegos
- 🛍️ Marcas
- ⚽ Futbolistas

### Añadir Nuevas Palabras

Para añadir palabras a una categoría existente:

1. Navega a `src/data/es-es/`
2. Edita el archivo JSON correspondiente (ej: `peliculas.json`)
3. Añade las nuevas palabras al array siguiendo el formato:

```json
{
  "word": "Inception",
  "hint": "Leonardo DiCaprio"
}
```

## 🎨 Características Técnicas

- **Glassmorphism UI**: Efectos modernos de vidrio esmerilado
- **Animaciones Fluidas**: Transiciones suaves con CSS y React
- **3D Card Flip**: Cartas con efecto 3D para revelar roles
- **Gesture Support**: Control táctil optimizado para móviles
- **Persist State**: LocalStorage para guardar progreso
- **Smart Word Selection**: Sistema que evita repetir palabras
- **Responsive Design**: Adaptado a todos los tamaños de pantalla

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Roadmap

- [ ] Modo multijugador online
- [ ] Más idiomas (inglés, francés, etc.)
- [ ] Sistema de puntuación y estadísticas
- [ ] Temas personalizables
- [ ] PWA (Progressive Web App)
- [ ] Modo tutorial interactivo
- [ ] Integración con Discord

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Créditos

Desarrollado con ❤️ por [@rub3nnn](https://github.com/rub3nnn)

🌐 Portfolio: [rub3n.es](https://rub3n.es)

## 🐛 Reportar Bugs

Si encuentras algún bug, por favor abre un [issue](https://github.com/tuusuario/blanco/issues) con:

- Descripción del problema
- Pasos para reproducirlo
- Screenshots si es posible
- Información del navegador/dispositivo

---

<div align="center">

**¿Te gusta el proyecto? ¡Dale una ⭐ en GitHub!**

</div>
