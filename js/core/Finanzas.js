import { CONFIG } from '../data/constants.js';

export class Finanzas {
    constructor() {
        this.dinero = 0;
        this.propiedades = [];
        this.prestamos = [];
        this.inversiones = [];
        this.gastosMensuales = {
            alquiler: 0,
            servicios: 0,
            comida: 0,
            salud: 0,
            entretenimiento: 0
        };
    }

    // Métodos para manejar dinero
    modificarDinero(cantidad) {
        this.dinero += cantidad;
        return this.dinero;
    }

    // Métodos para propiedades
    comprarPropiedad(propiedad) {
        if (this.dinero < propiedad.precio) {
            throw new Error('No tienes suficiente dinero para comprar esta propiedad');
        }

        this.dinero -= propiedad.precio;
        this.propiedades.push({
            ...propiedad,
            fechaCompra: new Date().toISOString()
        });

        return true;
    }

    venderPropiedad(idPropiedad) {
        const index = this.propiedades.findIndex(p => p.id === idPropiedad);
        if (index === -1) {
            throw new Error('Propiedad no encontrada');
        }

        const propiedad = this.propiedades[index];
        const tiempoPosesion = (new Date() - new Date(propiedad.fechaCompra)) / (1000 * 60 * 60 * 24 * 30); // en meses
        const valorVenta = propiedad.precio * (1 + (tiempoPosesion * 0.01)); // 1% de apreciación por mes

        this.dinero += valorVenta;
        this.propiedades.splice(index, 1);

        return valorVenta;
    }

    // Métodos para préstamos
    solicitarPrestamo(monto, plazoMeses, tasaInteres) {
        const cuotaMensual = (monto * (1 + tasaInteres)) / plazoMeses;
        
        this.prestamos.push({
            id: Date.now().toString(),
            monto,
            plazoMeses,
            tasaInteres,
            cuotaMensual,
            fechaInicio: new Date().toISOString()
        });

        this.dinero += monto;
        return this.prestamos[this.prestamos.length - 1];
    }

    pagarCuotaPrestamo() {
        const prestamoActivo = this.prestamos.find(p => p.estado === 'activo');
        if (!prestamoActivo) return false;

        if (this.dinero < prestamoActivo.cuotaMensual) {
            throw new Error('No tienes suficiente dinero para pagar la cuota');
        }

        this.dinero -= prestamoActivo.cuotaMensual;
        prestamoActivo.mesesRestantes--;

        if (prestamoActivo.mesesRestantes <= 0) {
            prestamoActivo.estado = 'completado';
        }

        return true;
    }

    _calcularCuotaMensual(monto, plazoMeses, tasaInteres) {
        const tasaMensual = tasaInteres / 12 / 100;
        return Math.round(monto * (tasaMensual * Math.pow(1 + tasaMensual, plazoMeses)) / (Math.pow(1 + tasaMensual, plazoMeses) - 1));
    }

    // Métodos para inversiones
    realizarInversion(monto, tipo, plazoMeses, tasaRetorno) {
        if (this.dinero < monto) {
            throw new Error('No tienes suficiente dinero para realizar esta inversión');
        }

        this.dinero -= monto;
        this.inversiones.push({
            id: Date.now().toString(),
            monto,
            tipo,
            plazoMeses,
            tasaRetorno,
            fechaInicio: new Date().toISOString()
        });

        return this.inversiones[this.inversiones.length - 1];
    }

    cobrarInversion(idInversion) {
        const index = this.inversiones.findIndex(i => i.id === idInversion);
        if (index === -1) {
            throw new Error('Inversión no encontrada');
        }

        const inversion = this.inversiones[index];
        const ganancia = this._calcularGananciaInversion(inversion);
        
        this.dinero += inversion.monto + ganancia;
        this.inversiones.splice(index, 1);

        return ganancia;
    }

    _calcularGananciaInversion(inversion) {
        const añosInversion = (new Date() - new Date(inversion.fechaInicio)) / (1000 * 60 * 60 * 24 * 365);
        return Math.round(inversion.monto * (inversion.tasaRetorno / 100) * añosInversion);
    }

    // Métodos para gastos mensuales
    actualizarGastosMensuales() {
        const gastoTotal = Object.values(this.gastosMensuales).reduce((total, monto) => total + monto, 0);
        this.dinero -= gastoTotal;
        return gastoTotal;
    }

    modificarGastoMensual(tipo, monto) {
        if (this.gastosMensuales.hasOwnProperty(tipo)) {
            this.gastosMensuales[tipo] = monto;
            return true;
        }
        return false;
    }

    toJSON() {
        return {
            dinero: this.dinero,
            propiedades: this.propiedades,
            prestamos: this.prestamos,
            inversiones: this.inversiones,
            gastosMensuales: this.gastosMensuales
        };
    }

    static fromJSON(data) {
        const finanzas = new Finanzas();
        Object.assign(finanzas, data);
        return finanzas;
    }
} 