// Importation du module HTTP intégré dans Node.js
const http = require('http');

// Importation du module 'app', qui représente l'application Express
const app = require('./app');

// Fonction pour normaliser le port (renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne)
const normalizePort = val => {
// Conversion du port en un entier
  const port = parseInt(val, 10);
// Si le port n'est pas un nombre, il est renvoyé tel quel
  if (isNaN(port)) {
    return val;
  }
// Si le port est un nombre positif, il est renvoyé
  if (port >= 0) {
    return port;
  }
// Sinon, le port est considéré comme invalide et faux est renvoyé
  return false;
};

// Obtention du port à partir des variables d'environnement ou utilisation du port 3000 par défaut
const port = normalizePort(process.env.PORT || '4000');
// Configuration de l'application pour utiliser le port spécifié
app.set('port', port);

// Gestionnaire d'erreur pour le serveur
const errorHandler = error => {
// Si l'erreur ne concerne pas une écoute (listen), elle est envoyée
  if (error.syscall !== 'listen') {
    throw error;
  }

// Récupération des informations sur l'adresse et le port
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;

  // Gestion des différents codes d'erreur
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Création du serveur HTTP avec l'application Express
const server = http.createServer(app);

// Gestion des événements d'erreur et d'écoute du serveur
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
