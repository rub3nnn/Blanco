// Configuration file for BLANCO client
// Change the SERVER_URL to your deployed server URL in production

const CONFIG = {
  // For local development
  SERVER_URL: "https://blanco-bhqw.onrender.com/",

  // For production, uncomment and set your server URL:
  // SERVER_URL: "https://your-server-domain.com",

  // Connection options
  SOCKET_OPTIONS: {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  },
};
