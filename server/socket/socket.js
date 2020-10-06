// Importar server || Inicio
const { io } = require('../server');


// Importar class personalizadas
const { Usuarios } = require('../classes/usuario');
const usuarios = new Usuarios();
const { crearMensaje } = require('../utilidades/utilidades');


// iniciar servidor socket || Listen 
io.on('connection', (client) => {

    // Identificar usuario
    let userId = client.id;

    // Identificar usuario que ingresa | escuchar cuando entre al chat
    client.on('entrarChat', (data, callback) => {

        // validar parametros de etntrada
        if (!data) {
            return callback({ error: true, mensaje: 'No se encontraron parametros de entrada' });
        };

        if (!data.login.username || !data.login.sala) {
            return callback({ error: true, mensaje: 'El dato usuario/sala no puede ser vacio' });
        };

        let username = data.login.username;
        let sala = data.login.sala;

        // Adicionar la conexión a una sala
        client.join(sala);

        // Adicionar al listado de personas
        usuarios.addPersona(userId, username, sala);
        let personas = usuarios.getPersonaPorSala(sala);

        // notificar quien ingreso
        //client.broadcast.emit('listaPersona', usuarios.getPersona());

        // conectar a una sala
        client.broadcast.to(sala).emit('listaPersona', usuarios.getPersonaPorSala(sala));

        // Informar la persona que se conecta
        client.broadcast.to(sala).emit('crearMensaje', crearMensaje('admin', `Usuario ${ username } ingreso a la sala`))

        callback({ personas })
    });

    // MIRAR SI SE DESCONECTA
    client.on('disconnect', () => {

        // borro el usuario del listado
        let pDel = usuarios.delPersona(userId);

        // Enviar mensaje el grupo de persona eliminada
        if (pDel) {
            client.broadcast.to(pDel.sala).emit('crearMensaje', crearMensaje('admin', `Persona ${pDel.username} salió de la sala`))
        };

        // listar usuarios nuevo
        client.broadcast.to(pDel.sala).emit('listaPersona', usuarios.getPersonaPorSala(pDel.sala))
    });

    // Enviar mensajes a todos
    client.on('enviarMensaje', (data) => {

        let persona = usuarios.getPersona(userId);

        let mensaje = crearMensaje(persona.username, data.mensaje);

        // Enviar mensaje a todos 
        client.broadcast.emit('crearMensaje', mensaje);
    });

    client.on('mensajePrivado', (data) => {

        let toPersona = usuarios.getPersona(userId);
        let fromPersona = usuarios.getPersona(data.para);

        if (!toPersona && !fromPersona) {
            let msjPrivate = {
                to: toPersona.username,
                from: fromPersona.username,
                mensaje: data.mensaje
            };

            console.log(msjPrivate);

            client.broadcast.to(fromPersona.id).emit('mensajePrivate', crearMensaje(toPersona.id, msjPrivate));
        };
    })


});