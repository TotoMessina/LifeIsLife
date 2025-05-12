import { CONFIG } from './constants.js';

class StorageManager {
    static KEYS = {
        PERSONAJE: 'personaje',
        FAMILIA: 'familia',
        EVENTOS: 'eventos',
        PARTIDA: 'partida'
    };

    static guardarPersonaje(personaje) {
        localStorage.setItem(this.KEYS.PERSONAJE, JSON.stringify(personaje));
    }

    static obtenerPersonaje() {
        const personaje = localStorage.getItem(this.KEYS.PERSONAJE);
        return personaje ? JSON.parse(personaje) : null;
    }

    static guardarFamilia(familia) {
        localStorage.setItem(this.KEYS.FAMILIA, JSON.stringify(familia));
    }

    static obtenerFamilia() {
        const familia = localStorage.getItem(this.KEYS.FAMILIA);
        return familia ? JSON.parse(familia) : null;
    }

    static guardarEventos(eventos) {
        localStorage.setItem(this.KEYS.EVENTOS, JSON.stringify(eventos));
    }

    static obtenerEventos() {
        const eventos = localStorage.getItem(this.KEYS.EVENTOS);
        return eventos ? JSON.parse(eventos) : [];
    }

    static guardarPartida(datos) {
        localStorage.setItem(this.KEYS.PARTIDA, JSON.stringify(datos));
    }

    static obtenerPartida() {
        const partida = localStorage.getItem(this.KEYS.PARTIDA);
        return partida ? JSON.parse(partida) : null;
    }

    static limpiarPartida() {
        localStorage.removeItem(this.KEYS.PERSONAJE);
        localStorage.removeItem(this.KEYS.FAMILIA);
        localStorage.removeItem(this.KEYS.EVENTOS);
        localStorage.removeItem(this.KEYS.PARTIDA);
    }

    static existePartidaGuardada() {
        return localStorage.getItem(this.KEYS.PARTIDA) !== null;
    }
}

export default StorageManager; 