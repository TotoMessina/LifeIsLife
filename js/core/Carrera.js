import { EDUCACION, TRABAJO, SALARIOS } from '../data/constants.js';

export class Carrera {
    constructor() {
        this.educacion = {
            nivel: null,
            carrera: null,
            añosCompletados: 0,
            promedio: 0
        };
        this.trabajo = {
            carrera: null,
            rol: null,
            tipo: null,
            estado: TRABAJO.ESTADOS.DESEMPLEADO,
            añosExperiencia: 0,
            salario: 0,
            empresa: null
        };
    }

    // Métodos de Educación
    iniciarEducacion(nivel) {
        if (this.educacion.nivel) {
            throw new Error('Ya estás estudiando');
        }
        this.educacion.nivel = nivel;
        this.educacion.añosCompletados = 0;
        this.educacion.promedio = 0;
    }

    avanzarEducacion() {
        if (!this.educacion.nivel) {
            throw new Error('No estás estudiando');
        }

        this.educacion.añosCompletados++;
        
        // Calcular nuevo promedio (simulado)
        const nuevoPromedio = Math.min(10, Math.max(1, 
            this.educacion.promedio + (Math.random() * 2 - 1)
        ));
        this.educacion.promedio = nuevoPromedio;

        // Verificar si se completó el nivel
        const añosRequeridos = this._obtenerAñosRequeridos(this.educacion.nivel);
        if (this.educacion.añosCompletados >= añosRequeridos) {
            return this._completarNivel();
        }

        return false;
    }

    iniciarCarrera(carrera) {
        if (this.educacion.nivel !== EDUCACION.NIVELES.UNIVERSIDAD) {
            throw new Error('Necesitas estar en la universidad para iniciar una carrera');
        }

        const carreraInfo = EDUCACION.CARRERAS[carrera];
        if (!carreraInfo) {
            throw new Error('Carrera no válida');
        }

        // Verificar requisitos
        for (const [atributo, valor] of Object.entries(carreraInfo.requisitos)) {
            if (this.personaje.atributos[atributo] < valor) {
                throw new Error(`No cumples con los requisitos de ${atributo}`);
            }
        }

        this.educacion.carrera = carrera;
        this.educacion.añosCompletados = 0;
    }

    _obtenerAñosRequeridos(nivel) {
        switch (nivel) {
            case EDUCACION.NIVELES.JARDIN: return 2;
            case EDUCACION.NIVELES.PRIMARIA: return 6;
            case EDUCACION.NIVELES.SECUNDARIA: return 6;
            case EDUCACION.NIVELES.UNIVERSIDAD: return 4;
            default: return 0;
        }
    }

    _completarNivel() {
        const nivelCompletado = this.educacion.nivel;
        this.educacion.nivel = null;
        this.educacion.añosCompletados = 0;
        return nivelCompletado;
    }

    // Métodos de Trabajo
    buscarTrabajo(carrera, rol = TRABAJO.ROL.JUNIOR) {
        if (this.trabajo.estado === TRABAJO.ESTADOS.ACTIVO) {
            throw new Error('Ya tienes un trabajo');
        }

        if (!this.educacion.carrera) {
            throw new Error('Necesitas una carrera para trabajar');
        }

        const salario = SALARIOS[carrera][rol];
        if (!salario) {
            throw new Error('Combinación de carrera y rol no válida');
        }

        this.trabajo = {
            carrera,
            rol,
            tipo: TRABAJO.TIPOS.TIEMPO_COMPLETO,
            estado: TRABAJO.ESTADOS.ACTIVO,
            añosExperiencia: 0,
            salario,
            empresa: this._generarEmpresa(carrera)
        };

        return this.trabajo;
    }

    renunciar() {
        if (this.trabajo.estado !== TRABAJO.ESTADOS.ACTIVO) {
            throw new Error('No tienes un trabajo activo');
        }

        const trabajoAnterior = { ...this.trabajo };
        this.trabajo.estado = TRABAJO.ESTADOS.DESEMPLEADO;
        this.trabajo.empresa = null;
        this.trabajo.salario = 0;

        return trabajoAnterior;
    }

    serDespedido() {
        if (this.trabajo.estado !== TRABAJO.ESTADOS.ACTIVO) {
            throw new Error('No tienes un trabajo activo');
        }

        const trabajoAnterior = { ...this.trabajo };
        this.trabajo.estado = TRABAJO.ESTADOS.DESEMPLEADO;
        this.trabajo.empresa = null;
        this.trabajo.salario = 0;

        return trabajoAnterior;
    }

    recibirPromocion() {
        if (this.trabajo.estado !== TRABAJO.ESTADOS.ACTIVO) {
            throw new Error('No tienes un trabajo activo');
        }

        const roles = Object.values(TRABAJO.ROLES);
        const rolActual = roles.indexOf(this.trabajo.rol);
        
        if (rolActual === roles.length - 1) {
            throw new Error('Ya estás en el nivel más alto');
        }

        const nuevoRol = roles[rolActual + 1];
        const nuevoSalario = SALARIOS[this.trabajo.carrera][nuevoRol];

        this.trabajo.rol = nuevoRol;
        this.trabajo.salario = nuevoSalario;

        return {
            rolAnterior: roles[rolActual],
            nuevoRol,
            aumento: nuevoSalario - this.trabajo.salario
        };
    }

    recibirAumento(porcentaje) {
        if (this.trabajo.estado !== TRABAJO.ESTADOS.ACTIVO) {
            throw new Error('No tienes un trabajo activo');
        }

        const aumento = this.trabajo.salario * (porcentaje / 100);
        this.trabajo.salario += aumento;

        return {
            aumento,
            nuevoSalario: this.trabajo.salario
        };
    }

    _generarEmpresa(carrera) {
        const empresas = {
            MEDICINA: ['Hospital Central', 'Clínica Privada', 'Centro de Investigación'],
            DERECHO: ['Bufete Legal', 'Juzgado', 'Empresa Corporativa'],
            INGENIERIA: ['Tech Corp', 'Constructora XYZ', 'Laboratorio de Investigación'],
            ARTE: ['Galería de Arte', 'Museo Nacional', 'Estudio Creativo'],
            EMPRESARIAL: ['Corporación Global', 'Startup Innovadora', 'Consultora Empresarial']
        };

        const listaEmpresas = empresas[carrera] || ['Empresa General'];
        return listaEmpresas[Math.floor(Math.random() * listaEmpresas.length)];
    }

    toJSON() {
        return {
            educacion: this.educacion,
            trabajo: this.trabajo
        };
    }

    static fromJSON(data) {
        const carrera = new Carrera();
        Object.assign(carrera, data);
        return carrera;
    }
} 