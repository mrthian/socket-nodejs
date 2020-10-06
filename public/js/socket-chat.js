// variable de socket
var socket = io();

// leer parametros por GET
var params = new URLSearchParams(window.location.search);

var usuario = params.get('username');
var sala = params.get('sala');

// validar parametros de entrada
if ((!params.has('username')) || (!params.has('sala'))) {
    window.location = 'index.html';
    throw new Error('El usuario/sala no puede ser vacia');
};

if (usuario === '' || sala === '') {
    window.location = 'index.html';
    throw new Error('El usuario/sala no puede ser vacio');
}

var login = {
    username: '@' + params.get('username'),
    sala: params.get('sala')
};

// conectar con el server
socket.on('connect', function() {
    console.log('Conectado al servidor');

    // Eventos personalizados || Enviando parametros 
    socket.emit('entrarChat', { login }, function(res) {
        console.log('Usuarios conectados:', res);
    });
});

// Escuchar cambios del server | Usuarios
//socket.on('listaPersona', (usuarios) => { console.log(usuarios) });

// escuchar
socket.on('disconnect', function() {
    console.log('Perdimos la conexión con el servidor');
});

socket.on('mensajePrivate', function(mensaje) {
    console.log('Mensaje privado: ', mensaje);
});

socket.on('crearMensaje', function(mensaje) {
    console.log('Mensaje: ', mensaje);
});