const express = require('express');

// improtar librearias de socket
const sockerIO = require('socket.io');

// importar HTTP
const http = require('http');

// Importar para realizar rutas absolutas.
const path = require('path');

// Iniciar el express
const app = express();

// Iniciar el server 
let server = http.createServer(app);

// middlerware publico | Acceso a la carpeta pubic.
const publicPath = path.resolve(__dirname, '../public');

// iniciar con la pagina static
app.use(express.static(publicPath));

// Buscar el puerto que asigne el server o un port por default
const port = process.env.PORT || 3000;

// exportar server || Socket
module.exports.io = sockerIO(server);

// Importar servidor de socket configurado
require('./socket/socket');

// Iniciar server para escucha
server.listen(port, (err) => {
    if (err) throw new Error(err);
    console.log(`Servidor Iniciado Port: ${ port }`);
});