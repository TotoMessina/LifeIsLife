import { ATRIBUTOS, EVENTOS, CONFIG, RELACIONES, EVENTOS_RELACION, ESTADOS_EMBARAZO, DURACION_EMBARAZO, REQUISITOS_RELACION, ARBOL_CARRERAS, GASTOS_FIJOS_ANUALES } from '../data/constants.js';
import { helpers } from '../utils/helpers.js';
import { Carrera } from './Carrera.js';
import { Finanzas } from './Finanzas.js';
import { Relacion } from './Relacion.js';

export class Personaje {
    constructor(nombre, genero) {
        this.nombre = nombre;
        this.genero = genero;
        this.edad = 0;
        this.estado = 'vivo';
        this.atributos = {
            [ATRIBUTOS.FELICIDAD]: CONFIG.ATRIBUTO_INICIAL,
            [ATRIBUTOS.SALUD]: CONFIG.ATRIBUTO_INICIAL,
            [ATRIBUTOS.INTELIGENCIA]: CONFIG.ATRIBUTO_INICIAL,
            [ATRIBUTOS.ASPECTO]: CONFIG.ATRIBUTO_INICIAL
        };
        this.carrera = new Carrera();
        this.carrera.educacion.rendimiento = 0;
        this.carrera.educacion.añosUniversidad = 0;
        this.carrera.educacion.universidadCompletada = false;
        this.finanzas = new Finanzas();
        this.relaciones = [];
        this._convertirRelaciones();
        this.embarazo = {
            estado: ESTADOS_EMBARAZO.NO_EMBARAZADA,
            meses: 0,
            pareja: null
        };
        this.historial = [];
        this.condiciones = new Map();
        this.propiedades = [];
        this.autos = [];
        this.tieneRegistro = false;
        // Generar familia inicial
        this.familia = this._generarFamiliaInicial();
        this.etapaEducativa = 'infancia'; // infancia, primaria, secundaria, universidad, tecnica, adulto
        this.rendimientoEscolar = [];
    }

    _convertirRelaciones() {
        if (Array.isArray(this.relaciones)) {
            this.relaciones = this.relaciones.map(rel => {
                if (rel instanceof Relacion) {
                    return rel;
                }
                return new Relacion(rel.persona, rel.tipo);
            });
        }
    }

    _generarFamiliaInicial() {
        // Configuración de probabilidades
        const probPadre = 0.9; // 90% de tener padre
        const probMadre = 0.95; // 95% de tener madre
        const probDosPadres = 0.05;
        const probDosMadres = 0.05;
        const probHermano = 0.5; // 50% de tener al menos un hermano
        const probGemelo = 0.15; // 15% de tener gemelo
        const maxHermanos = 3;
        const nombresMasc = ['Juan', 'Carlos', 'Miguel', 'Pedro', 'Luis', 'Antonio', 'Javier', 'Francisco'];
        const nombresFem = ['María', 'Ana', 'Laura', 'Carmen', 'Isabel', 'Sofía', 'Lucía', 'Elena'];
        const apellidos = ['García', 'Rodríguez', 'López', 'Martínez', 'González', 'Pérez', 'Sánchez', 'Ramírez'];
        const ocupaciones = ['Médico', 'Bombero', 'Maestro', 'Ingeniero', 'Artista', 'Abogado', 'Policía', 'Piloto'];
        const familia = [];
        // Padres
        let padres = [];
        const tipoPadres = Math.random() < probDosPadres ? 'dosPadres' : Math.random() < probDosMadres ? 'dosMadres' : 'mixto';
        if (tipoPadres === 'dosPadres') {
            for (let i = 0; i < 2; i++) {
                padres.push({
                    nombre: nombresMasc[Math.floor(Math.random() * nombresMasc.length)] + ' ' + apellidos[Math.floor(Math.random() * apellidos.length)],
                    genero: 'masculino',
                    edad: Math.floor(Math.random() * 25) + 25,
                    ocupacion: ocupaciones[Math.floor(Math.random() * ocupaciones.length)]
                });
            }
        } else if (tipoPadres === 'dosMadres') {
            for (let i = 0; i < 2; i++) {
                padres.push({
                    nombre: nombresFem[Math.floor(Math.random() * nombresFem.length)] + ' ' + apellidos[Math.floor(Math.random() * apellidos.length)],
                    genero: 'femenino',
                    edad: Math.floor(Math.random() * 25) + 25,
                    ocupacion: ocupaciones[Math.floor(Math.random() * ocupaciones.length)]
                });
            }
        } else {
            if (Math.random() < probPadre) {
                padres.push({
                    nombre: nombresMasc[Math.floor(Math.random() * nombresMasc.length)] + ' ' + apellidos[Math.floor(Math.random() * apellidos.length)],
                    genero: 'masculino',
                    edad: Math.floor(Math.random() * 25) + 25,
                    ocupacion: ocupaciones[Math.floor(Math.random() * ocupaciones.length)]
                });
            }
            if (Math.random() < probMadre) {
                padres.push({
                    nombre: nombresFem[Math.floor(Math.random() * nombresFem.length)] + ' ' + apellidos[Math.floor(Math.random() * apellidos.length)],
                    genero: 'femenino',
                    edad: Math.floor(Math.random() * 25) + 25,
                    ocupacion: ocupaciones[Math.floor(Math.random() * ocupaciones.length)]
                });
            }
        }
        padres.forEach(padre => {
            const relacion = new Relacion(padre, padre.genero === 'masculino' ? 'padre' : 'madre');
            this.relaciones.push(relacion);
            familia.push(padre);
        });
        // Hermanos
        if (Math.random() < probHermano) {
            const cantidad = 1 + Math.floor(Math.random() * maxHermanos);
            for (let i = 0; i < cantidad; i++) {
                let esGemelo = Math.random() < probGemelo;
                let edadHermano = esGemelo ? this.edad : Math.floor(Math.random() * 18);
                let generoHermano = Math.random() < 0.5 ? 'masculino' : 'femenino';
                let nombreHermano = (generoHermano === 'masculino' ? nombresMasc : nombresFem)[Math.floor(Math.random() * nombresMasc.length)] + ' ' + apellidos[Math.floor(Math.random() * apellidos.length)];
                let hermano = {
                    nombre: nombreHermano,
                    genero: generoHermano,
                    edad: edadHermano
                };
                const relacion = new Relacion(hermano, esGemelo ? 'hermano gemelo' : 'hermano');
                this.relaciones.push(relacion);
                familia.push(hermano);
            }
        }
        return familia;
    }

    modificarAtributo(atributo, cantidad) {
        if (this.atributos.hasOwnProperty(atributo)) {
            this.atributos[atributo] = Math.max(
                CONFIG.ATRIBUTO_MINIMO,
                Math.min(CONFIG.ATRIBUTO_MAXIMO, this.atributos[atributo] + cantidad)
            );

            // Verificar muerte por salud
            if (atributo === ATRIBUTOS.SALUD && this.atributos[atributo] <= 0) {
                this.morir();
            }
        }
    }

    envejecer() {
        this.edad++;

        // Envejecer a las personas de las relaciones activas
        this.relaciones.forEach(rel => {
            if (rel.estado === 'activa' && rel.persona && typeof rel.persona.edad === 'number') {
                rel.persona.edad++;
            }
        });
        
        // Actualizar etapa educativa
        this._actualizarEtapaEducativa();

        // Calcular rendimiento escolar si está en etapa educativa
        if (['primaria', 'secundaria', 'universidad', 'tecnica'].includes(this.etapaEducativa)) {
            // Base: inteligencia (60%), felicidad (20%), sociabilidad (20%)
            const inteligencia = this.atributos?.inteligencia ?? 50;
            const felicidad = this.atributos?.felicidad ?? 50;
            const sociabilidad = this.atributos?.sociabilidad ?? 50;
            let rendimiento = Math.round(
                inteligencia * 0.6 + felicidad * 0.2 + sociabilidad * 0.2
            );
            // Variación aleatoria +/- 10 puntos
            rendimiento += Math.floor(Math.random() * 21) - 10;
            rendimiento = Math.max(1, Math.min(100, rendimiento));
            this.rendimientoEscolar.push({
                edad: this.edad,
                etapa: this.etapaEducativa,
                rendimiento
            });
        }

        // Efectos del envejecimiento
        if (this.edad > 50) {
            this.modificarAtributo(ATRIBUTOS.SALUD, -1);
        }
        if (this.edad > 70) {
            this.modificarAtributo(ATRIBUTOS.SALUD, -2);
        }

        // Envejecer relaciones
        this.relaciones.forEach(relacion => {
            const eventoMuerte = relacion.envejecer();
            if (eventoMuerte) {
                this.agregarEvento(eventoMuerte);
                this.modificarAtributo(ATRIBUTOS.FELICIDAD, eventoMuerte.impacto.felicidad);
            }
        });

        // Actualizar condiciones temporales
        this._actualizarCondiciones();

        // --- PROMOCIÓN Y DESPIDO ---
        // Si tiene carrera universitaria y trabajo activo
        if (this.carrera.educacion.universidadCompletada && this.carrera.educacion.carrera) {
            const rama = this.carrera.educacion.carrera.toUpperCase();
            const arbol = ARBOL_CARRERAS[rama];
            if (arbol) {
                // Si no tiene trabajo, asignar primer puesto
                if (!this.carrera.trabajo.puesto) {
                    this.carrera.trabajo.puesto = arbol[0].puesto;
                    this.carrera.trabajo.nivel = 0;
                    this.carrera.trabajo.salario = arbol[0].salario;
                    this.carrera.trabajo.estado = 'activo';
                    this.carrera.trabajo.aniosEnPuesto = 0;
                    this.agregarEvento({
                        titulo: 'Nuevo empleo',
                        descripcion: `Comenzaste como ${arbol[0].puesto} en ${rama}.`,
                        tipo: 'trabajo',
                        edad: this.edad
                    });
                } else if (this.carrera.trabajo.estado === 'activo') {
                    // Ascenso cada 4 años si el rendimiento es bueno
                    this.carrera.trabajo.aniosEnPuesto = (this.carrera.trabajo.aniosEnPuesto || 0) + 1;
                    if (this.carrera.trabajo.aniosEnPuesto >= 4 && this.carrera.educacion.rendimiento >= 60 && this.carrera.trabajo.nivel < arbol.length - 1) {
                        this.carrera.trabajo.nivel++;
                        this.carrera.trabajo.puesto = arbol[this.carrera.trabajo.nivel].puesto;
                        this.carrera.trabajo.salario = arbol[this.carrera.trabajo.nivel].salario;
                        this.carrera.trabajo.aniosEnPuesto = 0;
                        this.agregarEvento({
                            titulo: 'Ascenso',
                            descripcion: `Has sido ascendido a ${this.carrera.trabajo.puesto}.`,
                            tipo: 'trabajo',
                            edad: this.edad
                        });
                    }
                    // Despido por bajo rendimiento (10% de probabilidad si rendimiento < 40)
                    if (this.carrera.educacion.rendimiento < 40 && Math.random() < 0.1) {
                        this.carrera.trabajo.estado = 'despedido';
                        this.carrera.trabajo.puesto = null;
                        this.carrera.trabajo.salario = 0;
                        this.carrera.trabajo.nivel = null;
                        this.carrera.trabajo.aniosEnPuesto = 0;
                        this.agregarEvento({
                            titulo: 'Despido',
                            descripcion: 'Has sido despedido por bajo rendimiento.',
                            tipo: 'trabajo',
                            edad: this.edad
                        });
                    }
                }
            }
        }

        // --- COBRO DE SALARIO Y GASTOS ---
        if (this.carrera.trabajo.estado === 'activo' && this.carrera.trabajo.salario) {
            this.finanzas.modificarDinero(this.carrera.trabajo.salario * 12);
            this.agregarEvento({
                titulo: 'Salario anual',
                descripcion: `Has cobrado $${this.carrera.trabajo.salario * 12} de salario anual como ${this.carrera.trabajo.puesto}.`,
                tipo: 'finanzas',
                edad: this.edad
            });
        }
        // Gastos fijos SOLO si es independiente
        let gastos = 0;
        if (this.edad >= 18) {
            gastos += GASTOS_FIJOS_ANUALES.comida + GASTOS_FIJOS_ANUALES.servicios;
        }
        // Gastos de vivienda SOLO si tiene propiedad
        if (Array.isArray(this.propiedades) && this.propiedades.length > 0) {
            gastos += GASTOS_FIJOS_ANUALES.vivienda;
        }
        // Impuestos: 10% del salario anual si tiene trabajo
        if (this.carrera.trabajo.estado === 'activo' && this.carrera.trabajo.salario) {
            const impuestos = Math.round(this.carrera.trabajo.salario * 12 * 0.1);
            gastos += impuestos;
            this.agregarEvento({
                titulo: 'Pago de impuestos',
                descripcion: `Pagaste $${impuestos} en impuestos anuales.`,
                tipo: 'finanzas',
                edad: this.edad
            });
        }
        if (gastos > 0) {
            this.finanzas.modificarDinero(-gastos);
            this.agregarEvento({
                titulo: 'Gastos anuales',
                descripcion: `Pagaste $${gastos} en comida, servicios${(Array.isArray(this.propiedades) && this.propiedades.length > 0) ? ', vivienda' : ''}.`,
                tipo: 'finanzas',
                edad: this.edad
            });
        }

        // Avanzar en la educación si está estudiando
        if (this.carrera.educacion.nivel === 'Universidad' && !this.carrera.educacion.universidadCompletada) {
            this.carrera.educacion.añosUniversidad++;
            const duracionCarrera = this._obtenerDuracionCarrera(this.carrera.educacion.carrera);
            
            if (this.carrera.educacion.añosUniversidad >= duracionCarrera) {
                this.carrera.educacion.universidadCompletada = true;
                this.agregarEvento({
                    titulo: 'Graduación Universitaria',
                    descripcion: `¡Te has graduado de ${this.carrera.educacion.carrera}!`,
                    tipo: 'logro',
                    edad: this.edad
                });
            } else {
                this.agregarEvento({
                    titulo: 'Avance Universitario',
                    descripcion: `Has completado el año ${this.carrera.educacion.añosUniversidad} de ${this.carrera.educacion.carrera}.`,
                    tipo: 'educacion',
                    edad: this.edad
                });
            }
        }

        // Actualizar gastos mensuales
        const gastoTotal = this.finanzas.actualizarGastosMensuales();
        if (gastoTotal > 0) {
            this.agregarEvento({
                titulo: 'Gastos Mensuales',
                descripcion: `Has gastado ${gastoTotal} en gastos mensuales`,
                tipo: 'gasto',
                edad: this.edad
            });
        }

        // Actualizar embarazo
        this._actualizarEmbarazo();
    }

    _actualizarCondiciones() {
        for (const [id, condicion] of this.condiciones) {
            condicion.duracion--;
            
            if (condicion.duracion <= 0) {
                // Revertir efectos de la condición
                for (const [atributo, valor] of Object.entries(condicion.efectos)) {
                    this.modificarAtributo(atributo, -valor);
                }
                this.condiciones.delete(id);
            }
        }
    }

    agregarCondicion(efectos, duracion) {
        const id = Date.now().toString();
        this.condiciones.set(id, { efectos, duracion });
        
        // Aplicar efectos inmediatamente
        for (const [atributo, valor] of Object.entries(efectos)) {
            this.modificarAtributo(atributo, valor);
        }
    }

    agregarEvento(evento) {
        this.historial.push({
            ...evento,
            fecha: new Date().toISOString()
        });
    }

    modificarDinero(cantidad) {
        return this.finanzas.modificarDinero(cantidad);
    }

    comprarPropiedad(propiedad) {
        try {
            const resultado = this.finanzas.comprarPropiedad(propiedad);
            this.agregarEvento({
                titulo: 'Compra de Propiedad',
                descripcion: `Has comprado una ${propiedad.tipo} por ${propiedad.precio}`,
                tipo: 'compra',
                edad: this.edad
            });
            return resultado;
        } catch (error) {
            this.agregarEvento({
                titulo: 'Error en Compra',
                descripcion: error.message,
                tipo: 'error',
                edad: this.edad
            });
            throw error;
        }
    }

    venderPropiedad(idPropiedad) {
        try {
            const valorVenta = this.finanzas.venderPropiedad(idPropiedad);
            this.agregarEvento({
                titulo: 'Venta de Propiedad',
                descripcion: `Has vendido una propiedad por ${valorVenta}`,
                tipo: 'venta',
                edad: this.edad
            });
            return valorVenta;
        } catch (error) {
            this.agregarEvento({
                titulo: 'Error en Venta',
                descripcion: error.message,
                tipo: 'error',
                edad: this.edad
            });
            throw error;
        }
    }

    solicitarPrestamo(monto, plazoMeses, tasaInteres) {
        try {
            const prestamo = this.finanzas.solicitarPrestamo(monto, plazoMeses, tasaInteres);
            this.agregarEvento({
                titulo: 'Nuevo Préstamo',
                descripcion: `Has solicitado un préstamo de ${monto}`,
                tipo: 'prestamo',
                edad: this.edad
            });
            return prestamo;
        } catch (error) {
            this.agregarEvento({
                titulo: 'Error en Préstamo',
                descripcion: error.message,
                tipo: 'error',
                edad: this.edad
            });
            throw error;
        }
    }

    realizarInversion(monto, tipo, plazoMeses, tasaRetorno) {
        try {
            const inversion = this.finanzas.realizarInversion(monto, tipo, plazoMeses, tasaRetorno);
            this.agregarEvento({
                titulo: 'Nueva Inversión',
                descripcion: `Has invertido ${monto} en ${tipo}`,
                tipo: 'inversion',
                edad: this.edad
            });
            return inversion;
        } catch (error) {
            this.agregarEvento({
                titulo: 'Error en Inversión',
                descripcion: error.message,
                tipo: 'error',
                edad: this.edad
            });
            throw error;
        }
    }

    morir() {
        // Notificar a familiares y pareja
        const relacionesActivas = this.relaciones.filter(r => 
            r.tipo === 'PAREJA' || 
            (r.tipo === 'FAMILIAR' && r.nivelRelacion >= 70)
        );

        // Crear evento de muerte
        const evento = {
            titulo: 'Fallecimiento',
            descripcion: `${this.nombre} ha fallecido a la edad de ${this.edad} años.`,
            tipo: 'MUERTE',
            fecha: new Date(),
            impacto: {
                felicidad: -50,
                salud: 0
            }
        };

        // Aplicar impacto a familiares cercanos
        relacionesActivas.forEach(relacion => {
            if (relacion.persona) {
                relacion.persona.modificarAtributo('felicidad', -30);
                relacion.persona.agregarEvento(evento);
            }
        });

        // Marcar como fallecido
        this.estado = 'FALLECIDO';
        this.fechaFallecimiento = new Date();
    }

    // Métodos para relaciones
    iniciarRelacion(pareja) {
        if (this.edad < REQUISITOS_RELACION.EDAD_MINIMA_PAREJA) {
            throw new Error('Eres demasiado joven para tener una relación');
        }

        const relacion = new Relacion(pareja, RELACIONES.PAREJA);
        this.relaciones.push(relacion);
        
        this.agregarEvento({
            titulo: 'Nueva Relación',
            descripcion: `Has comenzado una relación con ${pareja.nombre}`,
            tipo: EVENTOS_RELACION.INICIO_RELACION,
            edad: this.edad
        });

        return relacion;
    }

    terminarRelacion(idRelacion) {
        const relacion = this.relaciones.find(r => r.id === idRelacion);
        if (!relacion) {
            throw new Error('Relación no encontrada');
        }

        relacion.terminarRelacion();
        this.agregarEvento({
            titulo: 'Ruptura',
            descripcion: `Has terminado tu relación con ${relacion.persona.nombre}`,
            tipo: EVENTOS_RELACION.RUPTURA,
            edad: this.edad
        });

        return relacion;
    }

    casarse(idRelacion) {
        const relacion = this.relaciones.find(r => r.id === idRelacion);
        if (!relacion) {
            throw new Error('Relación no encontrada');
        }

        if (this.edad < REQUISITOS_RELACION.EDAD_MINIMA_MATRIMONIO) {
            throw new Error('Eres demasiado joven para casarte');
        }

        if (relacion.casarse()) {
            this.agregarEvento({
                titulo: 'Boda',
                descripcion: `Te has casado con ${relacion.persona.nombre}`,
                tipo: EVENTOS_RELACION.BODA,
                edad: this.edad
            });
            return true;
        }
        return false;
    }

    divorciarse(idRelacion) {
        const relacion = this.relaciones.find(r => r.id === idRelacion);
        if (!relacion) {
            throw new Error('Relación no encontrada');
        }

        if (relacion.divorciarse()) {
            this.agregarEvento({
                titulo: 'Divorcio',
                descripcion: `Te has divorciado de ${relacion.persona.nombre}`,
                tipo: EVENTOS_RELACION.DIVORCIO,
                edad: this.edad
            });
            return true;
        }
        return false;
    }

    // Métodos para embarazo y nacimiento
    quedarEmbarazada(pareja) {
        if (this.genero !== 'femenino') {
            throw new Error('Solo los personajes femeninos pueden quedar embarazados');
        }

        if (this.edad > REQUISITOS_RELACION.EDAD_MAXIMA_EMBARAZO) {
            throw new Error('Eres demasiado mayor para quedar embarazada');
        }

        if (this.embarazo.estado !== ESTADOS_EMBARAZO.NO_EMBARAZADA) {
            throw new Error('Ya estás embarazada');
        }

        this.embarazo = {
            estado: ESTADOS_EMBARAZO.EMBARAZADA,
            meses: 0,
            pareja: pareja
        };

        this.agregarEvento({
            titulo: 'Embarazo',
            descripcion: '¡Estás embarazada!',
            tipo: EVENTOS_RELACION.EMBARAZO,
            edad: this.edad
        });

        return true;
    }

    _actualizarEmbarazo() {
        if (this.embarazo.estado === ESTADOS_EMBARAZO.EMBARAZADA) {
            this.embarazo.meses++;
            
            if (this.embarazo.meses >= DURACION_EMBARAZO) {
                this._darALuz();
            }
        }
    }

    _darALuz() {
        const genero = Math.random() < 0.5 ? 'masculino' : 'femenino';
        const nombre = this._generarNombreHijo(genero);
        
        const hijo = new Personaje(nombre, genero, 0);
        const relacion = this.relaciones.find(r => r.persona.id === this.embarazo.pareja.id);
        
        if (relacion) {
            relacion.agregarHijo(hijo);
        }

        this.embarazo = {
            estado: ESTADOS_EMBARAZO.NO_EMBARAZADA,
            meses: 0,
            pareja: null
        };

        this.agregarEvento({
            titulo: 'Nacimiento',
            descripcion: `¡Ha nacido tu ${genero === 'masculino' ? 'hijo' : 'hija'} ${nombre}!`,
            tipo: EVENTOS_RELACION.NACIMIENTO,
            edad: this.edad
        });

        return hijo;
    }

    _generarNombreHijo(genero) {
        // Implementar lógica para generar nombres según el género
        return genero === 'masculino' ? 'Juan' : 'María';
    }

    toJSON() {
        return {
            nombre: this.nombre,
            genero: this.genero,
            edad: this.edad,
            atributos: this.atributos,
            estado: this.estado,
            carrera: this.carrera.toJSON(),
            finanzas: this.finanzas.toJSON(),
            historial: this.historial,
            condiciones: Array.from(this.condiciones.entries()),
            relaciones: this.relaciones.map(r => r.toJSON()),
            embarazo: this.embarazo,
            familia: this.familia.map(p => p.toJSON())
        };
    }

    static fromJSON(data) {
        const personaje = new Personaje(data.nombre, data.genero, data.edad);
        Object.assign(personaje, data);
        personaje.carrera = Carrera.fromJSON(data.carrera);
        personaje.finanzas = Finanzas.fromJSON(data.finanzas);
        personaje.condiciones = new Map(data.condiciones);
        personaje.relaciones = data.relaciones.map(r => Relacion.fromJSON(r));
        personaje.familia = data.familia.map(p => Personaje.fromJSON(p));
        return personaje;
    }

    modificarRelacion(persona, delta) {
        const rel = this.relaciones.find(r => r.persona === persona);
        if (rel) {
            rel.nivelRelacion = Math.max(0, Math.min(100, (rel.nivelRelacion || 50) + delta));
        }
    }

    modificarEducacion(tipo, valor) {
        if (tipo === 'rendimiento') {
            this.carrera.educacion.rendimiento = Math.max(0, Math.min(100, this.carrera.educacion.rendimiento + valor));
        } else if (tipo === 'inclinacion') {
            this.carrera.educacion.inclinacion = valor;
        } else if (tipo === 'tipo') {
            this.carrera.educacion.tipo = valor;
        } else if (tipo === 'añosUniversidad') {
            this.carrera.educacion.añosUniversidad = valor;
            // Verificar si se completó la universidad
            const duracionCarrera = this._obtenerDuracionCarrera(this.carrera.educacion.carrera);
            if (this.carrera.educacion.añosUniversidad >= duracionCarrera) {
                this.carrera.educacion.universidadCompletada = true;
                this.agregarEvento({
                    titulo: 'Graduación Universitaria',
                    descripcion: `¡Te has graduado de ${this.carrera.educacion.carrera}!`,
                    tipo: 'logro',
                    edad: this.edad
                });
            }
        }
    }

    _obtenerDuracionCarrera(carrera) {
        switch(carrera) {
            case 'MEDICINA': return 6;
            case 'DERECHO': return 5;
            case 'INGENIERIA': return 5;
            case 'ARTE': return 4;
            case 'EMPRESARIAL': return 4;
            default: return 4;
        }
    }

    puedeAccederPosgrado() {
        return this.carrera.educacion.universidadCompletada;
    }

    calcularCostoEducacion() {
        if (this.carrera.educacion.tipo === 'privada') {
            switch(this.carrera.educacion.nivel) {
                case 'Escuela Primaria': return 5000;
                case 'Escuela Secundaria': return 8000;
                case 'Universidad': return 15000;
                case 'Posgrado': return 25000; // Aumentado el costo del posgrado
                default: return 0;
            }
        }
        return 0; // Educación pública es gratuita
    }

    agregarCurso(curso) {
        if (!this.carrera.educacion.cursos) {
            this.carrera.educacion.cursos = [];
        }
        this.carrera.educacion.cursos.push(curso);
        
        // Aumentar rendimiento según el tipo de curso
        let aumentoRendimiento = 0;
        switch(curso) {
            case 'PROGRAMACION':
            case 'DISEÑO':
                aumentoRendimiento = 15; // Cursos técnicos aumentan más el rendimiento
                break;
            case 'IDIOMAS':
                aumentoRendimiento = 10;
                break;
            case 'OFICIOS':
                aumentoRendimiento = 8;
                break;
            default:
                aumentoRendimiento = 5;
        }
        
        // Aumentar rendimiento y asegurar que no exceda 100
        this.modificarEducacion('rendimiento', aumentoRendimiento);
        
        // Si el rendimiento supera 70, actualizar el nivel a Secundaria si no lo tiene
        if (this.carrera.educacion.rendimiento >= 70 && !this.carrera.educacion.nivel) {
            this.carrera.educacion.nivel = 'Escuela Secundaria';
        }
    }

    puedeAccederUniversidad() {
        // Puede acceder si tiene rendimiento suficiente o ha completado cursos relevantes
        const tieneRendimientoSuficiente = this.carrera.educacion.rendimiento >= 70;
        const tieneCursosRelevantes = this.carrera.educacion.cursos && 
            this.carrera.educacion.cursos.some(curso => 
                ['PROGRAMACION', 'DISEÑO', 'IDIOMAS'].includes(curso)
            );
        
        return tieneRendimientoSuficiente || tieneCursosRelevantes;
    }

    obtenerCarrerasDisponibles() {
        const carreras = {
            'PROGRAMACION': ['INGENIERIA', 'EMPRESARIAL'],
            'DISEÑO': ['ARTE', 'EMPRESARIAL'],
            'IDIOMAS': ['DERECHO', 'EMPRESARIAL'],
            'OFICIOS': ['INGENIERIA']
        };

        if (!this.carrera.educacion.cursos || this.carrera.educacion.cursos.length === 0) {
            return ['EMPRESARIAL']; // Carrera por defecto si no hay cursos
        }

        const carrerasDisponibles = new Set();
        this.carrera.educacion.cursos.forEach(curso => {
            if (carreras[curso]) {
                carreras[curso].forEach(carrera => carrerasDisponibles.add(carrera));
            }
        });

        return Array.from(carrerasDisponibles);
    }

    _actualizarEtapaEducativa() {
        if (this.edad >= 5 && this.edad <= 11) {
            this.etapaEducativa = 'primaria';
        } else if (this.edad >= 12 && this.edad <= 17) {
            this.etapaEducativa = 'secundaria';
        } else if (this.edad >= 18 && this.edad <= 22) {
            // La elección entre universidad/técnica se hará más adelante según atributos y decisiones
            if (this.carrera && this.carrera.educacion && this.carrera.educacion.tipo === 'universidad') {
                this.etapaEducativa = 'universidad';
            } else if (this.carrera && this.carrera.educacion && this.carrera.educacion.tipo === 'tecnica') {
                this.etapaEducativa = 'tecnica';
            } else {
                this.etapaEducativa = 'adulto';
            }
        } else if (this.edad > 22) {
            this.etapaEducativa = 'adulto';
        } else {
            this.etapaEducativa = 'infancia';
        }
    }
} 