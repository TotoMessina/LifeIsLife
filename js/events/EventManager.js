import { EVENTOS, CONFIG } from '../data/constants.js';
import { obtenerEventosDisponibles } from './eventTypes.js';
import { helpers } from '../utils/helpers.js';

export class EventManager {
    constructor() {
        this.eventos = [];
        this.probabilidadBase = CONFIG.PROBABILIDAD_EVENTO;
    }

    generarEventoAleatorio(personaje) {
        // Obtener eventos disponibles según la edad
        const eventosDisponibles = obtenerEventosDisponibles(personaje.edad, personaje);
        
        if (eventosDisponibles.length === 0) {
            return null;
        }

        // Filtrar eventos por probabilidad
        const eventosProbables = eventosDisponibles.filter(evento => 
            Math.random() <= evento.probabilidad
        );

        if (eventosProbables.length === 0) {
            return null;
        }

        // Seleccionar un evento aleatorio
        const evento = eventosProbables[Math.floor(Math.random() * eventosProbables.length)];
        
        // Si es un evento de decisión, preparar las opciones
        if (evento.tipo === EVENTOS.DECISION) {
            return {
                ...evento,
                opciones: evento.opciones.map(opcion => ({
                    ...opcion,
                    id: helpers.generarId()
                }))
            };
        }

        return evento;
    }

    aplicarEvento(evento, personaje, opcionSeleccionada = null) {
        let efectos = {};

        if (evento.tipo === EVENTOS.DECISION && opcionSeleccionada) {
            efectos = opcionSeleccionada.efectos;

            // Si hay consecuencias, calcular el resultado
            if (opcionSeleccionada.consecuencias) {
                const exito = Math.random() <= opcionSeleccionada.consecuencias.probabilidadExito;
                efectos = {
                    ...efectos,
                    ...(exito ? opcionSeleccionada.consecuencias.exito : opcionSeleccionada.consecuencias.fracaso)
                };
            }
        } else {
            efectos = evento.efectos;
        }

        // Aplicar efectos
        for (const [atributo, valor] of Object.entries(efectos)) {
            if (personaje.atributos.hasOwnProperty(atributo)) {
                personaje.modificarAtributo(atributo, valor);
            } else if (atributo === 'dinero') {
                personaje.modificarDinero(valor);
            }
        }

        // Registrar el evento en el historial
        personaje.agregarEvento({
            edad: personaje.edad,
            titulo: evento.titulo,
            descripcion: evento.descripcion,
            tipo: evento.tipo,
            efectos: efectos
        });

        return efectos;
    }

    obtenerEventos() {
        return this.eventos;
    }

    limpiarEventos() {
        this.eventos = [];
    }
} 