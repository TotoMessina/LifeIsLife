import { LISTA_EVENTOS } from '../data/constants.js';

export class Eventos {
    constructor() {
        this.eventos = [];
    }

    generarEventoAleatorio(personaje) {
        const eventosPosibles = LISTA_EVENTOS.filter(evento => 
            this._cumpleRequisitos(evento, personaje)
        );

        if (eventosPosibles.length === 0) return null;

        const eventoAleatorio = eventosPosibles[Math.floor(Math.random() * eventosPosibles.length)];
        return {
            ...eventoAleatorio,
            fecha: new Date().toISOString()
        };
    }

    _cumpleRequisitos(evento, personaje) {
        if (!evento.requisitos) return true;

        return Object.entries(evento.requisitos).every(([atributo, valor]) => {
            if (typeof valor === 'number') {
                return personaje.atributos[atributo] >= valor;
            }
            return personaje[atributo] === valor;
        });
    }

    agregarEvento(evento) {
        this.eventos.push(evento);
    }

    obtenerEventos() {
        return [...this.eventos];
    }

    limpiarEventos() {
        this.eventos = [];
    }
} 