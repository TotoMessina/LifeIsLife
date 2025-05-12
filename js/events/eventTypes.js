import { EVENTOS, ATRIBUTOS } from '../data/constants.js';

export const EVENTOS_POR_EDAD = {
    // Eventos de la infancia (0-12)
    INFANCIA: [
        {
            tipo: EVENTOS.LOGRO,
            titulo: 'Primer día de escuela',
            descripcion: '¡Es tu primer día de escuela!',
            edadMinima: 5,
            edadMaxima: 6,
            probabilidad: 1,
            efectos: {
                felicidad: 10,
                inteligencia: 5
            }
        },
        {
            tipo: EVENTOS.ENFERMEDAD,
            titulo: 'Varicela',
            descripcion: 'Has contraído varicela, una enfermedad común en la infancia.',
            edadMinima: 3,
            edadMaxima: 10,
            probabilidad: 0.3,
            efectos: {
                salud: -15,
                duracion: 7
            }
        }
    ],

    // Eventos de la adolescencia (13-17)
    ADOLESCENCIA: [
        {
            tipo: EVENTOS.DECISION,
            titulo: 'Elección de estudios',
            descripcion: '¿Qué tipo de estudios quieres seguir?',
            edadMinima: 15,
            edadMaxima: 16,
            probabilidad: 1,
            opciones: [
                {
                    texto: 'Ciencias',
                    efectos: {
                        inteligencia: 15,
                        felicidad: 5
                    }
                },
                {
                    texto: 'Letras',
                    efectos: {
                        inteligencia: 10,
                        felicidad: 10
                    }
                },
                {
                    texto: 'Artes',
                    efectos: {
                        aspecto: 15,
                        felicidad: 15
                    }
                }
            ]
        },
        {
            tipo: EVENTOS.ACCIDENTE,
            titulo: 'Accidente deportivo',
            descripcion: 'Te has lesionado practicando deporte.',
            edadMinima: 13,
            edadMaxima: 17,
            probabilidad: 0.2,
            efectos: {
                salud: -20,
                felicidad: -10
            }
        }
    ],

    // Eventos de la juventud (18-30)
    JUVENTUD: [
        {
            tipo: EVENTOS.DECISION,
            titulo: 'Oportunidad de trabajo',
            descripcion: 'Te ofrecen un trabajo en otra ciudad. ¿Lo aceptas?',
            edadMinima: 18,
            edadMaxima: 30,
            probabilidad: 0.4,
            requisitos: {
                educacion: true
            },
            opciones: [
                {
                    texto: 'Sí, me mudo',
                    efectos: {
                        dinero: 2000,
                        felicidad: 15,
                        salud: -5
                    }
                },
                {
                    texto: 'No, me quedo',
                    efectos: {
                        felicidad: -5
                    }
                }
            ]
        },
        {
            tipo: EVENTOS.LOGRO,
            titulo: 'Graduación universitaria',
            descripcion: '¡Te has graduado de la universidad!',
            edadMinima: 22,
            edadMaxima: 25,
            probabilidad: 0.8,
            requisitos: {
                educacion: 'universitaria'
            },
            efectos: {
                felicidad: 25,
                inteligencia: 20,
                dinero: 5000
            }
        },
        {
            tipo: EVENTOS.LOGRO,
            titulo: '¡Ganaste la lotería!',
            descripcion: '¡Has ganado la lotería y tu vida cambia para siempre!',
            edadMinima: 18,
            edadMaxima: 80,
            probabilidad: 0.01,
            efectos: {
                dinero: 1000000,
                felicidad: 50
            }
        }
    ],

    // Eventos de la adultez (31-50)
    ADULTEZ: [
        {
            tipo: EVENTOS.DECISION,
            titulo: 'Oportunidad de negocio',
            descripcion: 'Tienes la oportunidad de iniciar tu propio negocio.',
            edadMinima: 31,
            edadMaxima: 50,
            probabilidad: 0.3,
            requisitos: {
                dinero: 10000
            },
            opciones: [
                {
                    texto: 'Invertir en el negocio',
                    efectos: {
                        dinero: -10000,
                        felicidad: 20
                    },
                    consecuencias: {
                        probabilidadExito: 0.6,
                        exito: {
                            dinero: 50000,
                            felicidad: 30
                        },
                        fracaso: {
                            dinero: -5000,
                            felicidad: -20
                        }
                    }
                },
                {
                    texto: 'Mantener el dinero',
                    efectos: {
                        felicidad: -5
                    }
                }
            ]
        },
        {
            tipo: EVENTOS.ENFERMEDAD,
            titulo: 'Problemas de salud',
            descripcion: 'Has desarrollado problemas de salud relacionados con el estrés.',
            edadMinima: 31,
            edadMaxima: 50,
            probabilidad: 0.2,
            requisitos: {
                trabajo: true
            },
            efectos: {
                salud: -25,
                felicidad: -15
            }
        }
    ],

    // Eventos de la madurez (51-70)
    MADUREZ: [
        {
            tipo: EVENTOS.DECISION,
            titulo: 'Jubilación anticipada',
            descripcion: 'Tienes la opción de jubilarte anticipadamente.',
            edadMinima: 51,
            edadMaxima: 65,
            probabilidad: 0.4,
            requisitos: {
                trabajo: true,
                dinero: 50000
            },
            opciones: [
                {
                    texto: 'Jubilarme ahora',
                    efectos: {
                        felicidad: 20,
                        salud: 10,
                        dinero: -10000
                    }
                },
                {
                    texto: 'Seguir trabajando',
                    efectos: {
                        dinero: 5000,
                        salud: -5
                    }
                }
            ]
        },
        {
            tipo: EVENTOS.ENFERMEDAD,
            titulo: 'Problemas cardíacos',
            descripcion: 'Has desarrollado problemas cardíacos.',
            edadMinima: 51,
            edadMaxima: 70,
            probabilidad: 0.3,
            efectos: {
                salud: -30,
                felicidad: -20
            }
        }
    ],

    // Eventos de la vejez (71+)
    VEJEZ: [
        {
            tipo: EVENTOS.ENFERMEDAD,
            titulo: 'Problemas de movilidad',
            descripcion: 'Has desarrollado problemas de movilidad.',
            edadMinima: 71,
            edadMaxima: 100,
            probabilidad: 0.4,
            efectos: {
                salud: -20,
                felicidad: -15
            }
        },
        {
            tipo: EVENTOS.DECISION,
            titulo: 'Mudarse a residencia',
            descripcion: '¿Quieres mudarte a una residencia para mayores?',
            edadMinima: 75,
            edadMaxima: 100,
            probabilidad: 0.3,
            opciones: [
                {
                    texto: 'Sí, mudarme',
                    efectos: {
                        salud: 10,
                        felicidad: 5,
                        dinero: -2000
                    }
                },
                {
                    texto: 'No, quedarme en casa',
                    efectos: {
                        felicidad: -10,
                        salud: -5
                    }
                }
            ]
        },
        {
            tipo: EVENTOS.FAMILIAR,
            titulo: 'Ayuda económica de un familiar',
            descripcion: 'Un familiar te ayuda económicamente en un momento difícil.',
            edadMinima: 10,
            edadMaxima: 80,
            probabilidad: 0.15,
            requisitos: {
                nivelRelacion: 70
            },
            efectos: {
                dinero: 2000,
                felicidad: 10
            }
        },
        {
            tipo: EVENTOS.FAMILIAR,
            titulo: 'Conflicto familiar',
            descripcion: 'Has tenido una fuerte discusión con un familiar.',
            edadMinima: 10,
            edadMaxima: 80,
            probabilidad: 0.12,
            requisitos: {
                nivelRelacion: 30
            },
            efectos: {
                felicidad: -15
            },
            decision: true,
            opciones: [
                {
                    texto: 'Intentar reconciliarte',
                    efectos: { felicidad: 5, nivelRelacion: 10 }
                },
                {
                    texto: 'Ignorar el conflicto',
                    efectos: { felicidad: -5, nivelRelacion: -10 }
                }
            ]
        },
        {
            tipo: EVENTOS.FAMILIAR,
            titulo: 'Reconciliación familiar',
            descripcion: 'Te has reconciliado con un familiar.',
            edadMinima: 10,
            edadMaxima: 80,
            probabilidad: 0.08,
            requisitos: {
                nivelRelacion: 40
            },
            efectos: {
                felicidad: 20,
                nivelRelacion: 20
            }
        },
        {
            tipo: EVENTOS.FAMILIAR,
            titulo: 'Familiar enfermo',
            descripcion: 'Un familiar cercano ha enfermado y necesita tu apoyo.',
            edadMinima: 10,
            edadMaxima: 80,
            probabilidad: 0.10,
            decision: true,
            opciones: [
                {
                    texto: 'Ayudarlo',
                    efectos: { felicidad: 10, dinero: -500, nivelRelacion: 15 }
                },
                {
                    texto: 'No ayudar',
                    efectos: { felicidad: -10, nivelRelacion: -20 }
                }
            ]
        },
        {
            tipo: EVENTOS.FAMILIAR,
            titulo: 'Herencia inesperada',
            descripcion: 'Has recibido una herencia de un familiar.',
            edadMinima: 18,
            edadMaxima: 80,
            probabilidad: 0.03,
            requisitos: {
                nivelRelacion: 60
            },
            efectos: {
                dinero: 10000,
                felicidad: 15
            }
        },
        {
            tipo: EVENTOS.FAMILIAR,
            titulo: 'Invitación a evento familiar',
            descripcion: 'Te han invitado a una reunión familiar importante.',
            edadMinima: 10,
            edadMaxima: 80,
            probabilidad: 0.10,
            decision: true,
            opciones: [
                {
                    texto: 'Asistir',
                    efectos: { felicidad: 10, nivelRelacion: 10 }
                },
                {
                    texto: 'No asistir',
                    efectos: { felicidad: -5, nivelRelacion: -10 }
                }
            ]
        },
        {
            tipo: EVENTOS.FAMILIAR,
            titulo: 'Mudanza familiar',
            descripcion: 'Un familiar cercano se muda a otra ciudad.',
            edadMinima: 10,
            edadMaxima: 80,
            probabilidad: 0.07,
            efectos: {
                felicidad: -5,
                nivelRelacion: -10
            }
        }
    ]
};

// Función para obtener los eventos disponibles según la edad
export function obtenerEventosDisponibles(edad, personaje) {
    let eventosDisponibles = [];

    // Determinar la etapa de vida
    let etapa;
    if (edad <= 12) etapa = 'INFANCIA';
    else if (edad <= 17) etapa = 'ADOLESCENCIA';
    else if (edad <= 30) etapa = 'JUVENTUD';
    else if (edad <= 50) etapa = 'ADULTEZ';
    else if (edad <= 70) etapa = 'MADUREZ';
    else etapa = 'VEJEZ';

    // Filtrar eventos por edad y requisitos
    eventosDisponibles = EVENTOS_POR_EDAD[etapa].filter(evento => {
        // Verificar rango de edad
        if (edad < evento.edadMinima || edad > evento.edadMaxima) {
            return false;
        }

        // Verificar requisitos
        if (evento.requisitos) {
            for (const [requisito, valor] of Object.entries(evento.requisitos)) {
                if (typeof valor === 'boolean') {
                    if (valor && !personaje[requisito]) return false;
                } else if (personaje[requisito] !== valor) {
                    return false;
                }
            }
        }

        return true;
    });

    return eventosDisponibles;
} 