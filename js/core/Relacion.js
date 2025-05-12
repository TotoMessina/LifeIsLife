import { ATRIBUTOS, RELACIONES, CONFIG } from '../data/constants.js';

export class Relacion {
    constructor(persona, tipo) {
        this.id = Date.now().toString();
        this.persona = persona;
        this.tipo = tipo;
        this.estado = 'activa';
        this.fechaInicio = new Date().toISOString();
        this.fechaFin = null;
        this.hijos = [];
        this.atributos = {
            [ATRIBUTOS.FELICIDAD]: CONFIG.ATRIBUTO_MAXIMO,
            [ATRIBUTOS.SALUD]: CONFIG.ATRIBUTO_MAXIMO,
            [ATRIBUTOS.INTELIGENCIA]: CONFIG.ATRIBUTO_MAXIMO,
            [ATRIBUTOS.ASPECTO]: CONFIG.ATRIBUTO_MAXIMO
        };
    }

    // Métodos para manejar el estado de la relación
    terminarRelacion() {
        this.estado = 'terminada';
        this.fechaFin = new Date().toISOString();
    }

    casarse() {
        if (this.tipo === RELACIONES.PAREJA) {
            this.estado = 'casada';
            return true;
        }
        return false;
    }

    divorciarse() {
        if (this.estado === 'casada') {
            this.estado = 'divorciada';
            this.fechaFin = new Date().toISOString();
            return true;
        }
        return false;
    }

    // Métodos para manejar hijos
    agregarHijo(hijo) {
        this.hijos.push(hijo);
    }

    removerHijo(idHijo) {
        const index = this.hijos.findIndex(h => h.id === idHijo);
        if (index !== -1) {
            this.hijos.splice(index, 1);
            return true;
        }
        return false;
    }

    // Métodos para modificar atributos
    modificarAtributo(atributo, cantidad) {
        if (this.atributos.hasOwnProperty(atributo)) {
            this.atributos[atributo] = Math.max(
                CONFIG.ATRIBUTO_MINIMO,
                Math.min(CONFIG.ATRIBUTO_MAXIMO, this.atributos[atributo] + cantidad)
            );
        }
    }

    // Métodos para obtener información
    obtenerDuracion() {
        const inicio = new Date(this.fechaInicio);
        const fin = this.fechaFin ? new Date(this.fechaFin) : new Date();
        return Math.floor((fin - inicio) / (1000 * 60 * 60 * 24 * 365));
    }

    esActiva() {
        return ['activa', 'casada'].includes(this.estado);
    }

    toJSON() {
        return {
            id: this.id,
            persona: this.persona,
            tipo: this.tipo,
            estado: this.estado,
            fechaInicio: this.fechaInicio,
            fechaFin: this.fechaFin,
            hijos: this.hijos,
            atributos: this.atributos
        };
    }

    static fromJSON(data) {
        const relacion = new Relacion(data.persona, data.tipo);
        Object.assign(relacion, data);
        return relacion;
    }
} 