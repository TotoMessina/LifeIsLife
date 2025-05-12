export const helpers = {
    // Genera un número aleatorio entre min y max (inclusive)
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Formatea un número como moneda
    formatearMoneda(cantidad) {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(cantidad);
    },

    // Formatea una fecha
    formatearFecha(fecha) {
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(fecha);
    },

    // Calcula la probabilidad de un evento basado en atributos
    calcularProbabilidad(base, modificadores) {
        let probabilidad = base;
        for (const [atributo, valor] of Object.entries(modificadores)) {
            probabilidad += (valor / 100) * 0.1; // Cada punto de atributo modifica un 0.1%
        }
        return Math.max(0, Math.min(1, probabilidad));
    },

    // Genera un ID único
    generarId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Verifica si un objeto está vacío
    esObjetoVacio(obj) {
        return Object.keys(obj).length === 0;
    },

    // Clona un objeto profundamente
    clonarProfundo(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    // Calcula la edad basada en la fecha de nacimiento
    calcularEdad(fechaNacimiento) {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        
        return edad;
    },

    // Formatea un número como porcentaje
    formatearPorcentaje(valor) {
        return `${Math.round(valor)}%`;
    },

    // Genera un nombre aleatorio
    generarNombre(genero) {
        const nombres = {
            masculino: ['Juan', 'Carlos', 'Miguel', 'Pedro', 'Luis'],
            femenino: ['María', 'Ana', 'Laura', 'Carmen', 'Isabel']
        };
        return nombres[genero][Math.floor(Math.random() * nombres[genero].length)];
    },

    // Verifica si un valor está dentro de un rango
    estaEnRango(valor, min, max) {
        return valor >= min && valor <= max;
    }
}; 