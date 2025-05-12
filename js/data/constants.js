// Constantes del juego
export const ATRIBUTOS = {
    FELICIDAD: 'felicidad',
    SALUD: 'salud',
    INTELIGENCIA: 'inteligencia',
    ASPECTO: 'aspecto'
};

export const RELACIONES = {
    PADRE: 'padre',
    MADRE: 'madre',
    HERMANO: 'hermano',
    HERMANA: 'hermana',
    PAREJA: 'pareja',
    HIJO: 'hijo',
    HIJA: 'hija',
    CASADO: 'casado',
    DIVORCIADO: 'divorciado'
};

export const EVENTOS = {
    ENFERMEDAD: 'enfermedad',
    ACCIDENTE: 'accidente',
    LOGRO: 'logro',
    DECISION: 'decision'
};

export const ESTADOS = {
    VIVO: 'vivo',
    MUERTO: 'muerto',
    ENFERMO: 'enfermo',
    SANO: 'sano'
};

// Datos para generación aleatoria
export const NOMBRES = {
    MASCULINOS: ['Juan', 'Carlos', 'Miguel', 'Pedro', 'Luis', 'Antonio', 'Javier', 'Francisco'],
    FEMENINOS: ['María', 'Ana', 'Laura', 'Carmen', 'Isabel', 'Sofía', 'Lucía', 'Elena']
};

export const APELLIDOS = [
    'García', 'Rodríguez', 'López', 'Martínez', 'González', 'Pérez', 'Sánchez', 'Ramírez'
];

export const PAISES = [
    'España', 'México', 'Argentina', 'Colombia', 'Chile', 'Perú', 'Venezuela', 'Ecuador'
];

// Configuración del juego
export const CONFIG = {
    EDAD_INICIAL: 0,
    EDAD_MAXIMA: 100,
    ATRIBUTO_MAXIMO: 100,
    ATRIBUTO_MINIMO: 0,
    ATRIBUTO_INICIAL: 60,
    PROBABILIDAD_EVENTO: 0.3
};

// Sistema de Educación
export const EDUCACION = {
    NIVELES: {
        JARDIN: 'Jardín de Infantes',
        PRIMARIA: 'Escuela Primaria',
        SECUNDARIA: 'Escuela Secundaria',
        UNIVERSIDAD: 'Universidad'
    },
    CARRERAS: {
        MEDICINA: {
            nombre: 'Medicina',
            duracion: 6,
            requisitos: {
                inteligencia: 80,
                salud: 70
            },
            habilidades: ['salud', 'inteligencia'],
            oportunidades: ['hospital', 'clinica', 'investigacion']
        },
        DERECHO: {
            nombre: 'Derecho',
            duracion: 5,
            requisitos: {
                inteligencia: 75,
                aspecto: 60
            },
            habilidades: ['inteligencia', 'aspecto'],
            oportunidades: ['bufete', 'juzgado', 'empresa']
        },
        INGENIERIA: {
            nombre: 'Ingeniería',
            duracion: 5,
            requisitos: {
                inteligencia: 80
            },
            habilidades: ['inteligencia'],
            oportunidades: ['empresa', 'investigacion', 'construccion']
        },
        ARTE: {
            nombre: 'Arte',
            duracion: 4,
            requisitos: {
                aspecto: 70,
                felicidad: 60
            },
            habilidades: ['aspecto', 'felicidad'],
            oportunidades: ['galeria', 'museo', 'freelance']
        },
        EMPRESARIAL: {
            nombre: 'Administración de Empresas',
            duracion: 4,
            requisitos: {
                inteligencia: 65,
                aspecto: 65
            },
            habilidades: ['inteligencia', 'aspecto'],
            oportunidades: ['empresa', 'emprendimiento']
        }
    }
};

// Sistema de Trabajo
export const TRABAJO = {
    TIPOS: {
        TIEMPO_COMPLETO: 'Tiempo Completo',
        MEDIO_TIEMPO: 'Medio Tiempo',
        FREELANCE: 'Freelance'
    },
    ESTADOS: {
        ACTIVO: 'Activo',
        DESEMPLEADO: 'Desempleado',
        JUBILADO: 'Jubilado'
    },
    ROLES: {
        JUNIOR: 'Junior',
        SEMI_SENIOR: 'Semi-Senior',
        SENIOR: 'Senior',
        GERENTE: 'Gerente',
        DIRECTOR: 'Director'
    },
    EVENTOS: {
        PROMOCION: 'Promoción',
        DESPIDO: 'Despido',
        RENUNCIA: 'Renuncia',
        AUMENTO: 'Aumento de Sueldo',
        PROYECTO: 'Nuevo Proyecto'
    }
};

// Salarios base por carrera y rol
export const SALARIOS = {
    MEDICINA: {
        JUNIOR: 3000,
        SEMI_SENIOR: 5000,
        SENIOR: 8000,
        GERENTE: 12000,
        DIRECTOR: 20000
    },
    DERECHO: {
        JUNIOR: 2500,
        SEMI_SENIOR: 4500,
        SENIOR: 7000,
        GERENTE: 10000,
        DIRECTOR: 18000
    },
    INGENIERIA: {
        JUNIOR: 2800,
        SEMI_SENIOR: 4800,
        SENIOR: 7500,
        GERENTE: 11000,
        DIRECTOR: 19000
    },
    ARTE: {
        JUNIOR: 2000,
        SEMI_SENIOR: 3500,
        SENIOR: 6000,
        GERENTE: 9000,
        DIRECTOR: 15000
    },
    EMPRESARIAL: {
        JUNIOR: 2200,
        SEMI_SENIOR: 4000,
        SENIOR: 6500,
        GERENTE: 9500,
        DIRECTOR: 16000
    }
};

// Sistema de Propiedades
export const PROPIEDADES = {
    TIPOS: {
        CASA: 'Casa',
        DEPARTAMENTO: 'Departamento',
        AUTO: 'Auto',
        NEGOCIO: 'Negocio'
    },
    ESTADOS: {
        DISPONIBLE: 'Disponible',
        VENDIDA: 'Vendida',
        ALQUILADA: 'Alquilada'
    }
};

// Sistema de Inversiones
export const INVERSIONES = {
    TIPOS: {
        ACCIONES: 'Acciones',
        BONOS: 'Bonos',
        FONDO_COMUN: 'Fondo Común',
        CRIPTOMONEDA: 'Criptomoneda',
        NEGOCIO: 'Negocio'
    },
    RIESGO: {
        BAJO: 'Bajo',
        MEDIO: 'Medio',
        ALTO: 'Alto'
    }
};

// Sistema de Préstamos
export const PRESTAMOS = {
    TIPOS: {
        PERSONAL: 'Personal',
        HIPOTECARIO: 'Hipotecario',
        AUTOMOTRIZ: 'Automotriz',
        NEGOCIO: 'Negocio'
    },
    ESTADOS: {
        ACTIVO: 'Activo',
        COMPLETADO: 'Completado',
        MOROSO: 'Moroso'
    }
};

// Gastos Mensuales Base
export const GASTOS_BASE = {
    alquiler: 500,
    servicios: 200,
    comida: 300,
    salud: 150,
    entretenimiento: 100
};

// Precios Base de Propiedades
export const PRECIOS_BASE = {
    CASA: {
        ECONOMICA: 50000,
        MEDIA: 150000,
        LUJO: 500000
    },
    DEPARTAMENTO: {
        ECONOMICO: 30000,
        MEDIO: 100000,
        LUJO: 300000
    },
    AUTO: {
        ECONOMICO: 10000,
        MEDIO: 30000,
        LUJO: 100000
    },
    NEGOCIO: {
        PEQUEÑO: 50000,
        MEDIANO: 200000,
        GRANDE: 500000
    }
};

// Tasas de Interés Base
export const TASAS_INTERES = {
    PRESTAMO_PERSONAL: 15,
    PRESTAMO_HIPOTECARIO: 8,
    PRESTAMO_AUTOMOTRIZ: 12,
    PRESTAMO_NEGOCIO: 10
};

// Tasas de Retorno de Inversiones
export const TASAS_RETORNO = {
    ACCIONES: {
        BAJO: 5,
        MEDIO: 10,
        ALTO: 20
    },
    BONOS: {
        BAJO: 3,
        MEDIO: 6,
        ALTO: 9
    },
    FONDO_COMUN: {
        BAJO: 4,
        MEDIO: 8,
        ALTO: 15
    },
    CRIPTOMONEDA: {
        BAJO: 10,
        MEDIO: 30,
        ALTO: 100
    },
    NEGOCIO: {
        BAJO: 8,
        MEDIO: 15,
        ALTO: 25
    }
};

// Sistema de Relaciones
export const ESTADOS_RELACION = {
    ACTIVA: 'activa',
    TERMINADA: 'terminada',
    CASADA: 'casada',
    DIVORCIADA: 'divorciada'
};

// Probabilidades para eventos de relación
export const PROBABILIDADES_RELACION = {
    CONOCER_PAREJA: 0.3,
    PROPUESTA_MATRIMONIO: 0.2,
    DIVORCIO: 0.1,
    EMBARAZO: 0.15
};

// Requisitos para relaciones
export const REQUISITOS_RELACION = {
    EDAD_MINIMA_PAREJA: 18,
    EDAD_MINIMA_MATRIMONIO: 18,
    EDAD_MAXIMA_EMBARAZO: 45,
    ATRIBUTO_MINIMO_FELICIDAD: 60
};

// Eventos de relación
export const EVENTOS_RELACION = {
    CONOCER_PAREJA: 'conocer_pareja',
    INICIO_RELACION: 'inicio_relacion',
    PROPUESTA_MATRIMONIO: 'propuesta_matrimonio',
    BODA: 'boda',
    DIVORCIO: 'divorcio',
    EMBARAZO: 'embarazo',
    NACIMIENTO: 'nacimiento',
    RUPTURA: 'ruptura'
};

// Estados de embarazo
export const ESTADOS_EMBARAZO = {
    NO_EMBARAZADA: 'no_embarazada',
    EMBARAZADA: 'embarazada',
    PARTO: 'parto'
};

// Duración del embarazo en meses
export const DURACION_EMBARAZO = 9;

// Lista de eventos del juego
export const LISTA_EVENTOS = [
    {
        tipo: 'SALUD',
        descripcion: 'Has contraído una gripe leve',
        efectos: {
            salud: -5,
            felicidad: -2
        },
        requisitos: {
            salud: 50
        }
    },
    {
        tipo: 'TRABAJO',
        descripcion: 'Has recibido un aumento de sueldo',
        efectos: {
            dinero: 1000,
            felicidad: 10
        },
        requisitos: {
            trabajo: 'Activo'
        }
    },
    {
        tipo: 'RELACION',
        descripcion: 'Has conocido a alguien especial',
        efectos: {
            felicidad: 15
        },
        requisitos: {
            edad: 18
        }
    },
    {
        tipo: 'EDUCACION',
        descripcion: 'Has aprobado un examen importante',
        efectos: {
            inteligencia: 5,
            felicidad: 10
        },
        requisitos: {
            educacion: true
        }
    },
    {
        tipo: 'FORTUNA',
        descripcion: 'Has ganado la lotería',
        efectos: {
            dinero: 10000,
            felicidad: 20
        }
    },
    {
        tipo: 'DESGRACIA',
        descripcion: 'Has perdido algo de dinero',
        efectos: {
            dinero: -500,
            felicidad: -5
        }
    },
    {
        tipo: 'SALUD',
        descripcion: 'Has mejorado tu condición física',
        efectos: {
            salud: 10,
            felicidad: 5
        }
    },
    {
        tipo: 'TRABAJO',
        descripcion: 'Has sido promovido en tu trabajo',
        efectos: {
            dinero: 2000,
            felicidad: 15
        },
        requisitos: {
            trabajo: 'Activo'
        }
    }
];

export const ARBOL_CARRERAS = {
  MEDICINA: [
    { puesto: "Residente", salario: 1200 },
    { puesto: "Médico General", salario: 2500 },
    { puesto: "Especialista", salario: 4000 },
    { puesto: "Jefe de Servicio", salario: 6000 },
    { puesto: "Director Médico", salario: 9000 }
  ],
  INGENIERIA: [
    { puesto: "Asistente Técnico", salario: 1100 },
    { puesto: "Ingeniero Junior", salario: 2200 },
    { puesto: "Ingeniero Senior", salario: 3500 },
    { puesto: "Jefe de Proyecto", salario: 5500 },
    { puesto: "Director de Ingeniería", salario: 8000 }
  ],
  DERECHO: [
    { puesto: "Pasante", salario: 1000 },
    { puesto: "Abogado Junior", salario: 2000 },
    { puesto: "Abogado Senior", salario: 3500 },
    { puesto: "Socio", salario: 6000 },
    { puesto: "Juez/Director Legal", salario: 8500 }
  ],
  ARTE: [
    { puesto: "Asistente de Taller", salario: 900 },
    { puesto: "Artista Junior", salario: 1800 },
    { puesto: "Artista Senior", salario: 3000 },
    { puesto: "Curador", salario: 4500 },
    { puesto: "Director de Galería", salario: 7000 }
  ],
  EMPRESARIAL: [
    { puesto: "Auxiliar Administrativo", salario: 1000 },
    { puesto: "Analista", salario: 2000 },
    { puesto: "Gerente", salario: 4000 },
    { puesto: "Director", salario: 7000 },
    { puesto: "CEO", salario: 12000 }
  ]
};

export const GASTOS_FIJOS_ANUALES = {
  comida: 2400,
  vivienda: 3600,
  servicios: 1200
}; 