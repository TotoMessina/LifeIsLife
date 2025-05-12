export class Estadisticas {
    constructor() {
        this.estadisticas = {
            edadMuerte: 0,
            dineroAcumulado: 0,
            propiedadesCompradas: 0,
            propiedadesVendidas: 0,
            prestamosSolicitados: 0,
            prestamosPagados: 0,
            inversionesRealizadas: 0,
            relacionesIniciadas: 0,
            relacionesTerminadas: 0,
            matrimonios: 0,
            divorcios: 0,
            hijosTenidos: 0
        };
    }

    actualizarEstadistica(tipo, valor) {
        if (this.estadisticas.hasOwnProperty(tipo)) {
            this.estadisticas[tipo] += valor;
        }
    }

    obtenerEstadisticas() {
        return { ...this.estadisticas };
    }

    reiniciar() {
        Object.keys(this.estadisticas).forEach(key => {
            this.estadisticas[key] = 0;
        });
    }
} 