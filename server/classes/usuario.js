class Usuarios {

    // Iniciar clase con constructor
    constructor() {

        // array de personas conectadas
        this.personas = [];

    }

    // agresar personas al listado
    addPersona(id, username, sala) {
        let persona = { id, username, sala };

        // adicionar al array o lista
        this.personas.push(persona);

        // retornar el listado || ARRAY
        return this.personas;
    }

    getPersona(id) {

        // buscar persona || retornar el primer
        let persona = this.personas.filter(p => p.id === id)[0];

        // retornar la persona
        return persona;

    }

    getPersonaPorSala(sala) {
        let pSala = this.personas.filter(p => p.sala === sala);
        return pSala

    }

    delPersona(id) {

        // buscar persona a eliminar
        let personaDel = this.getPersona(id);

        // borrar del array
        this.personas = this.personas.filter(p => p.id != id);

        // Retornar la persona que se elimina del array
        return personaDel;
    }

}

module.exports = { Usuarios }