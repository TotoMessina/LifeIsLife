import { RELACIONES, NOMBRES, APELLIDOS } from '../data/constants.js';
import { Personaje } from './Personaje.js';

export class Familia {
    constructor(personajePrincipal) {
        this.personajePrincipal = personajePrincipal;
        this.miembros = new Map();
        this.relaciones = new Map();
    }

    generarFamiliaInicial() {
        // Generar padres
        const padre = this._crearFamiliar(RELACIONES.PADRE);
        const madre = this._crearFamiliar(RELACIONES.MADRE);
        
        // Generar hermanos (0-2)
        const numHermanos = Math.floor(Math.random() * 3);
        for (let i = 0; i < numHermanos; i++) {
            const genero = Math.random() > 0.5 ? 'masculino' : 'femenino';
            const tipo = genero === 'masculino' ? RELACIONES.HERMANO : RELACIONES.HERMANA;
            this._crearFamiliar(tipo);
        }

        // Establecer relaciones
        this._establecerRelacion(this.personajePrincipal, padre, RELACIONES.PADRE);
        this._establecerRelacion(this.personajePrincipal, madre, RELACIONES.MADRE);
    }

    _crearFamiliar(tipo) {
        const genero = tipo === RELACIONES.PADRE || tipo === RELACIONES.HERMANO ? 'masculino' : 'femenino';
        const nombres = genero === 'masculino' ? NOMBRES.MASCULINOS : NOMBRES.FEMENINOS;
        const nombre = nombres[Math.floor(Math.random() * nombres.length)];
        const apellido = APELLIDOS[Math.floor(Math.random() * APELLIDOS.length)];
        
        const familiar = new Personaje(`${nombre} ${apellido}`, genero);
        this.miembros.set(familiar.nombre, familiar);
        return familiar;
    }

    _establecerRelacion(persona1, persona2, tipo) {
        if (!this.relaciones.has(persona1.nombre)) {
            this.relaciones.set(persona1.nombre, new Map());
        }
        if (!this.relaciones.has(persona2.nombre)) {
            this.relaciones.set(persona2.nombre, new Map());
        }

        this.relaciones.get(persona1.nombre).set(persona2.nombre, tipo);
        this.relaciones.get(persona2.nombre).set(persona1.nombre, this._getRelacionInversa(tipo));
    }

    _getRelacionInversa(tipo) {
        const inversas = {
            [RELACIONES.PADRE]: RELACIONES.HIJO,
            [RELACIONES.MADRE]: RELACIONES.HIJA,
            [RELACIONES.HERMANO]: RELACIONES.HERMANO,
            [RELACIONES.HERMANA]: RELACIONES.HERMANA,
            [RELACIONES.HIJO]: RELACIONES.PADRE,
            [RELACIONES.HIJA]: RELACIONES.MADRE,
            [RELACIONES.PAREJA]: RELACIONES.PAREJA
        };
        return inversas[tipo];
    }

    obtenerRelacion(persona1, persona2) {
        return this.relaciones.get(persona1.nombre)?.get(persona2.nombre);
    }

    obtenerFamiliares(tipo) {
        const familiares = [];
        for (const [nombre, relacion] of this.relaciones.get(this.personajePrincipal.nombre)) {
            if (relacion === tipo) {
                familiares.push(this.miembros.get(nombre));
            }
        }
        return familiares;
    }

    agregarPareja(pareja) {
        this.miembros.set(pareja.nombre, pareja);
        this._establecerRelacion(this.personajePrincipal, pareja, RELACIONES.PAREJA);
    }

    agregarHijo(hijo) {
        this.miembros.set(hijo.nombre, hijo);
        this._establecerRelacion(this.personajePrincipal, hijo, hijo.genero === 'masculino' ? RELACIONES.HIJO : RELACIONES.HIJA);
    }

    envejecerFamilia() {
        for (const miembro of this.miembros.values()) {
            miembro.envejecer();
        }
    }

    toJSON() {
        return {
            miembros: Array.from(this.miembros.entries()),
            relaciones: Array.from(this.relaciones.entries())
        };
    }

    static fromJSON(data, personajePrincipal) {
        const familia = new Familia(personajePrincipal);
        familia.miembros = new Map(data.miembros);
        familia.relaciones = new Map(data.relaciones);
        return familia;
    }
} 