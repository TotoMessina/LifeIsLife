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
        this.nivelRelacion = 50;
        this.personalidad = this._asignarPersonalidadAleatoria();
        this.atributos = {
            [ATRIBUTOS.FELICIDAD]: CONFIG.ATRIBUTO_MAXIMO,
            [ATRIBUTOS.SALUD]: CONFIG.ATRIBUTO_MAXIMO,
            [ATRIBUTOS.INTELIGENCIA]: CONFIG.ATRIBUTO_MAXIMO,
            [ATRIBUTOS.ASPECTO]: CONFIG.ATRIBUTO_MAXIMO
        };
        this.fechaFallecimiento = null;
    }

    _asignarPersonalidadAleatoria() {
        const personalidades = ['amable', 'frío', 'explosivo', 'neutral'];
        return personalidades[Math.floor(Math.random() * personalidades.length)];
    }

    // Método para generar un número aleatorio basado en la semilla
    _generarAleatorio() {
        this.semillaAleatoria = (this.semillaAleatoria * 9301 + 49297) % 233280;
        return this.semillaAleatoria / 233280;
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

    envejecer() {
        if (this.estado === 'activa' && this.persona) {
            // Solo calcular la probabilidad de muerte y chequear si muere
            let probabilidadMuerte = 0;
            
            // Probabilidades realistas
            if (this.persona.edad < 30) {
                probabilidadMuerte = 0.0001; // 0.01% anual para jóvenes
            } else if (this.persona.edad < 40) {
                probabilidadMuerte = 0.0002; // 0.02% anual
            } else if (this.persona.edad < 50) {
                probabilidadMuerte = 0.0005; // 0.05% anual
            } else if (this.persona.edad < 60) {
                probabilidadMuerte = 0.002; // 0.2% anual
            } else if (this.persona.edad < 70) {
                probabilidadMuerte = 0.01; // 1% anual
            } else if (this.persona.edad < 80) {
                probabilidadMuerte = 0.05; // 5% anual
            } else if (this.persona.edad < 90) {
                probabilidadMuerte = 0.15; // 15% anual
            } else {
                probabilidadMuerte = 0.35; // 35% anual después de los 90
            }

            // Ajuste por salud (si el personaje tiene atributos)
            if (this.persona.atributos && this.persona.atributos.salud) {
                if (this.persona.atributos.salud < 20) {
                    probabilidadMuerte *= 1.5; // 50% más de probabilidad si la salud es muy baja
                } else if (this.persona.atributos.salud < 40) {
                    probabilidadMuerte *= 1.2; // 20% más de probabilidad si la salud es baja
                }
            }

            // Eventos aleatorios (accidentes, enfermedades graves)
            if (this.persona.edad < 70) {
                if (Math.random() < 0.0001) { // 0.01% de probabilidad anual
                    probabilidadMuerte = 0.05; // 5% de probabilidad de muerte en caso de evento
                }
            }

            if (Math.random() < probabilidadMuerte) {
                return this.morir();
            }
        }
        return null;
    }

    morir() {
        if (this.estado === 'activa') {
            this.estado = 'fallecida';
            this.fechaFallecimiento = new Date();
            
            // Determinar causa de muerte basada en la edad
            let causaMuerte = '';
            if (this.persona.edad > 90) {
                causaMuerte = 'vejez';
            } else if (this.persona.edad > 80) {
                causaMuerte = 'causas naturales';
            } else if (this.persona.edad > 70) {
                causaMuerte = 'enfermedad relacionada con la edad';
            } else if (this.persona.edad > 50) {
                causaMuerte = 'enfermedad';
            } else {
                causaMuerte = 'accidente';
            }

            return {
                titulo: 'Fallecimiento',
                descripcion: `${this.persona.nombre} ha fallecido a la edad de ${this.persona.edad} años por ${causaMuerte}.`,
                tipo: 'MUERTE',
                impacto: {
                    felicidad: -30
                }
            };
        }
        return null;
    }

    interactuar(accion) {
        if (this.estado !== 'activa') {
            return {
                delta: 0,
                feedback: 'No puedes interactuar con una persona fallecida.',
                nivel: this.nivelRelacion,
                personalidad: this.personalidad
            };
        }

        // Efectos base
        let delta = 0;
        let feedback = '';
        switch (accion) {
            case 'charlar':
                if (this.personalidad === 'amable') { delta = 10; feedback = 'Le encantó charlar contigo.'; }
                else if (this.personalidad === 'frío') { delta = 3; feedback = 'Fue una charla cordial, pero distante.'; }
                else if (this.personalidad === 'explosivo') { delta = 5; feedback = 'La charla fue intensa, pero positiva.'; }
                else { delta = 6; feedback = 'La charla fue agradable.'; }
                break;
            case 'salir':
                if (this.personalidad === 'amable') { delta = 12; feedback = 'Disfrutó mucho la salida.'; }
                else if (this.personalidad === 'frío') { delta = 5; feedback = 'Aceptó salir, pero no mostró mucho entusiasmo.'; }
                else if (this.personalidad === 'explosivo') { delta = 15; feedback = '¡La salida fue una montaña rusa de emociones!'; }
                else { delta = 8; feedback = 'La salida fue divertida.'; }
                break;
            case 'discutir':
                if (this.personalidad === 'amable') { delta = -5; feedback = 'No le gustó discutir, pero te perdona rápido.'; }
                else if (this.personalidad === 'frío') { delta = -3; feedback = 'La discusión fue fría y distante.'; }
                else if (this.personalidad === 'explosivo') { delta = -15; feedback = '¡La discusión fue muy fuerte!'; }
                else { delta = -8; feedback = 'La discusión fue incómoda.'; }
                break;
            default:
                feedback = 'No pasó nada especial.';
        }
        // Aplicar y limitar nivel de relación
        this.nivelRelacion = Math.max(0, Math.min(100, this.nivelRelacion + delta));
        return { delta, feedback, nivel: this.nivelRelacion, personalidad: this.personalidad };
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
            atributos: this.atributos,
            nivelRelacion: this.nivelRelacion,
            personalidad: this.personalidad,
            fechaFallecimiento: this.fechaFallecimiento
        };
    }

    static fromJSON(data) {
        const relacion = new Relacion(data.persona, data.tipo);
        Object.assign(relacion, data);
        return relacion;
    }
} 