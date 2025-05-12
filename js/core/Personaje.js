import { ATRIBUTOS, EVENTOS, CONFIG, RELACIONES, EVENTOS_RELACION, ESTADOS_EMBARAZO, DURACION_EMBARAZO, REQUISITOS_RELACION } from '../data/constants.js';
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
        this.finanzas = new Finanzas();
        this.relaciones = [];
        this.embarazo = {
            estado: ESTADOS_EMBARAZO.NO_EMBARAZADA,
            meses: 0,
            pareja: null
        };
        this.historial = [];
        this.condiciones = new Map();
        // Generar familia inicial
        this.familia = this._generarFamiliaInicial();
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
            this.relaciones.push({
                persona: padre,
                tipo: padre.genero === 'masculino' ? 'padre' : 'madre',
                estado: 'activa',
                hijos: [this],
                fechaInicio: null,
                fechaFin: null,
                nivelRelacion: 50
            });
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
                this.relaciones.push({
                    persona: hermano,
                    tipo: esGemelo ? 'hermano gemelo' : 'hermano',
                    estado: 'activa',
                    fechaInicio: null,
                    fechaFin: null,
                    nivelRelacion: 50
                });
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
        
        // Efectos del envejecimiento
        if (this.edad > 50) {
            this.modificarAtributo(ATRIBUTOS.SALUD, -1);
        }
        if (this.edad > 70) {
            this.modificarAtributo(ATRIBUTOS.SALUD, -2);
        }

        // Actualizar condiciones temporales
        this._actualizarCondiciones();

        // Avanzar en la educación si está estudiando
        if (this.carrera.educacion.nivel) {
            const nivelCompletado = this.carrera.avanzarEducacion();
            if (nivelCompletado) {
                this.agregarEvento({
                    titulo: 'Graduación',
                    descripcion: `Has completado ${nivelCompletado}`,
                    tipo: 'logro',
                    edad: this.edad
                });
            }
        }

        // Recibir salario y aplicar desgaste si está trabajando
        if (this.carrera.trabajo.estado === 'activo') {
            this.finanzas.modificarDinero(this.carrera.trabajo.salario);
            this.carrera.trabajo.añosExperiencia++;
            // Desgaste laboral afecta salud y felicidad
            const desgaste = this.carrera.trabajo.desgaste || 0;
            if (desgaste > 0) {
                this.modificarAtributo(ATRIBUTOS.SALUD, -desgaste);
                this.modificarAtributo(ATRIBUTOS.FELICIDAD, -Math.round(desgaste/3));
                this.agregarEvento({
                    titulo: 'Desgaste laboral',
                    descripcion: `El trabajo te ha causado un desgaste de ${desgaste} en salud y ${Math.round(desgaste/3)} en felicidad este año.`,
                    tipo: 'trabajo',
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

        // Verificar si se quedó sin dinero
        if (this.finanzas.dinero < 0) {
            this.agregarEvento({
                titulo: 'Crisis Financiera',
                descripcion: 'Te has quedado sin dinero',
                tipo: 'crisis',
                edad: this.edad
            });
            this.modificarAtributo(ATRIBUTOS.FELICIDAD, -10);
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
        this.estado = 'muerto';
        this.agregarEvento({
            titulo: 'Fallecimiento',
            descripcion: 'Has fallecido.',
            tipo: 'muerte',
            edad: this.edad
        });

        // Calcular estadísticas finales
        const estadisticas = {
            edad: this.edad,
            patrimonio: this.finanzas.dinero,
            propiedades: this.finanzas.propiedades.length,
            hijos: this.relaciones.reduce((total, r) => total + r.hijos.length, 0),
            logros: this.historial.filter(e => e.tipo === 'logro').length,
            educacion: this.carrera.educacion.nivel || 'Sin estudios',
            trabajo: this.carrera.trabajo.estado === 'activo' ? this.carrera.trabajo.rol : 'Desempleado',
            relaciones: this.relaciones.filter(r => r.esActiva()).length,
            eventos: this.historial.length
        };

        this.agregarEvento({
            titulo: 'Estadísticas Finales',
            descripcion: `Edad: ${estadisticas.edad}\nPatrimonio: ${estadisticas.patrimonio}\nPropiedades: ${estadisticas.propiedades}\nHijos: ${estadisticas.hijos}\nLogros: ${estadisticas.logros}`,
            tipo: 'estadisticas',
            edad: this.edad
        });

        return estadisticas;
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
} 