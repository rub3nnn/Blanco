# BLANCO - Cliente

Este es el cliente web para el juego BLANCO. Una aplicación frontend completamente estática construida con HTML, CSS y JavaScript vanilla.

## 📁 Estructura

```
client/
├── index.html          # Página principal
├── config.js           # Configuración de conexión al servidor
├── assets/
│   ├── css/
│   │   └── styles.css  # Estilos de la aplicación
│   ├── js/
│   │   └── index.js    # Lógica del cliente
│   └── img/            # Recursos gráficos
└── api/                # Librerías de terceros
    ├── jquery.min.js
    ├── qrcode.js
    └── qrcode.min.js
```

## 🚀 Despliegue

El cliente es una aplicación estática pura, por lo que puede ser desplegada en cualquier servidor de archivos estáticos:

### Opciones de Despliegue

1. **Vercel**

   - Arrastra la carpeta `client` a [vercel.com](https://vercel.com)
   - O usa el CLI de Vercel

2. **Netlify**

   - Arrastra la carpeta `client` a [netlify.com](https://netlify.com)
   - O conecta tu repositorio de GitHub

3. **GitHub Pages**

   - Sube el contenido de `client` a tu repositorio
   - Habilita GitHub Pages en la configuración

4. **Servidor Web Tradicional**

   - Apache, Nginx, etc.
   - Simplemente copia los archivos a la carpeta pública

5. **CDN / Object Storage**
   - AWS S3 + CloudFront
   - Google Cloud Storage
   - Azure Blob Storage

## ⚙️ Configuración

### Antes de Desplegar

**IMPORTANTE**: Edita el archivo `config.js` con la URL de tu servidor API:

```javascript
const CONFIG = {
  // Cambia esto a la URL de tu servidor desplegado
  SERVER_URL: "https://your-server-domain.com",

  SOCKET_OPTIONS: {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  },
};
```

### Desarrollo Local

Si quieres probar localmente sin servidor:

```bash
# Usando Python
python -m http.server 3000

# O usando Node.js http-server
npx http-server -p 3000

# O usando PHP
php -S localhost:3000
```

Luego abre `http://localhost:3000` en tu navegador.

## 🔧 Personalización

### Cambiar el Logo

Reemplaza `assets/img/logo.png` con tu propio logo.

### Modificar Estilos

Edita `assets/css/styles.css` para personalizar colores, fuentes, etc.

### Cambiar Fuentes

Las fuentes se cargan desde Google Fonts. Modifica en `index.html`:

```html
<link
  href="https://fonts.googleapis.com/css2?family=TU-FUENTE&display=swap"
  rel="stylesheet"
/>
```

## 📱 Características

- ✅ 100% Responsive
- ✅ PWA Ready (puede convertirse en Progressive Web App)
- ✅ Sin dependencias de build
- ✅ Funciona offline (excepto conexión al servidor)
- ✅ Optimizado para móviles

## 🌐 Compatibilidad

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## 🔒 Consideraciones de Seguridad

1. **HTTPS**: Despliega siempre con HTTPS en producción
2. **CSP**: Considera agregar Content Security Policy headers
3. **CORS**: Asegúrate de que el servidor permita tu dominio
4. **Validación**: El cliente valida entradas, pero confía en el servidor para la seguridad real

## 📦 Sin Build Process

Este cliente NO requiere:

- ❌ npm install
- ❌ webpack/rollup/vite
- ❌ babel/typescript transpilation
- ❌ node_modules

## 🚫 No Incluye

El cliente NO incluye el servidor. Debes desplegar el servidor por separado (ver `/server/README.md`).

## 🔗 Conexión al Servidor

El cliente se conecta al servidor mediante:

1. **WebSocket (Socket.IO)** - Para comunicación en tiempo real
2. **REST API** - Para consultas de datos (opcional)

Asegúrate de que:

- El servidor esté corriendo
- La URL en `config.js` sea correcta
- El servidor tenga CORS configurado para aceptar tu dominio

## 📝 Notas Importantes

1. **Primero el Servidor**: Despliega el servidor primero y obtén su URL
2. **Actualiza config.js**: Cambia `SERVER_URL` a la URL real del servidor
3. **Prueba la Conexión**: Verifica que el cliente pueda conectarse al servidor
4. **HTTPS Requerido**: Si el cliente usa HTTPS, el servidor también debe usar HTTPS (WSS)

## 🐛 Solución de Problemas

### "No se puede conectar al servidor"

- Verifica que `config.js` tenga la URL correcta
- Asegúrate de que el servidor esté corriendo
- Revisa la consola del navegador para errores de CORS

### "Mixed Content" error

- Si el cliente usa HTTPS, el servidor debe usar HTTPS/WSS
- No puedes mezclar HTTP y HTTPS

### El QR no se genera

- Verifica que `api/qrcode.js` esté cargado correctamente
- Revisa la consola para errores de JavaScript

## 📞 Soporte

Para problemas o preguntas, abre un issue en el repositorio de GitHub.
