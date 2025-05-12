import { PersonajeUI } from '../ui/PersonajeUI.js';
import { Personaje } from './Personaje.js';
import { Finanzas } from './Finanzas.js';
import { Eventos } from './Eventos.js';
import { Estadisticas } from './Estadisticas.js';

export class Juego {
    constructor() {
        this.personaje = null;
        this.ui = new PersonajeUI('personaje-container');
        this.eventos = new Eventos();
        this.estadisticas = new Estadisticas();
    }

    crearNuevoPersonaje(nombre, genero) {
        try {
            this.personaje = new Personaje(nombre, genero);
            // Asegurarnos de que finanzas está inicializado correctamente
            if (!this.personaje.finanzas) {
                this.personaje.finanzas = new Finanzas();
            }
            this.actualizarUI();
            if (typeof actualizarPanelEventosPrincipal === 'function') {
                actualizarPanelEventosPrincipal(this.personaje);
            }
        } catch (error) {
            console.error('Error al crear personaje:', error);
            throw error;
        }
    }

    avanzarAnio() {
        if (!this.personaje) return;
        try {
            // Envejecer al personaje
            this.personaje.envejecer();
            // Generar y aplicar evento aleatorio
            const evento = this._generarEventoAleatorio();
            if (evento && evento.decision && Array.isArray(evento.opciones)) {
                // Mostrar modal de decisión y pausar el flujo
                if (typeof window.mostrarModalDecision === 'function') {
                    window.mostrarModalDecision(evento, () => {
                        // Continuar flujo normal después de la decisión
                        this._postAvanceAnio();
                    });
                    return; // Pausar aquí hasta que el usuario decida
                }
            }
            if (evento) {
                if (typeof evento.efecto === 'function') {
                    evento.descripcion = evento.efecto();
                }
                this.aplicarEvento(evento);
            } else {
                // Registrar año aunque no haya evento aleatorio
                this.personaje.agregarEvento({
                    titulo: 'Año transcurrido',
                    descripcion: 'No ocurrió ningún evento especial este año.',
                    tipo: 'info',
                    edad: this.personaje.edad
                });
            }
            this._postAvanceAnio();
        } catch (error) {
            console.error('Error al avanzar año:', error);
        }
    }

    _postAvanceAnio() {
        // Actualizar la interfaz
        this.actualizarUI();
        // Actualizar el panel de eventos principal
        if (typeof window.actualizarPanelEventosPrincipal === 'function') {
            window.actualizarPanelEventosPrincipal(this.personaje);
        }
        // Verificar si el personaje ha muerto
        if (this.personaje.estado === 'muerto') {
            this.mostrarEstadisticasFinales();
        }
    }

    aplicarEvento(evento) {
        if (!this.personaje) return;

        try {
            // Aplicar efectos del evento
            if (evento.efectos) {
                for (const [atributo, valor] of Object.entries(evento.efectos)) {
                    if (this.personaje.atributos.hasOwnProperty(atributo)) {
                        this.personaje.modificarAtributo(atributo, valor);
                    } else if (atributo === 'dinero') {
                        this.personaje.modificarDinero(valor);
                    }
                }
            }

            // Agregar evento al historial con todos los campos necesarios
            this.personaje.agregarEvento({
                titulo: evento.titulo || '',
                descripcion: evento.descripcion || '',
                tipo: evento.tipo || '',
                edad: this.personaje.edad
            });
            
            // Mostrar notificación
            this.mostrarNotificacion(evento.descripcion, 'info');
            
            // Actualizar estadísticas si es necesario
            if (evento.tipo === 'RELACION') {
                this.estadisticas.actualizarEstadistica('relacionesIniciadas', 1);
            } else if (evento.tipo === 'MATRIMONIO') {
                this.estadisticas.actualizarEstadistica('matrimonios', 1);
            } else if (evento.tipo === 'DIVORCIO') {
                this.estadisticas.actualizarEstadistica('divorcios', 1);
            }
        } catch (error) {
            console.error('Error al aplicar evento:', error);
        }
    }

    mostrarNotificacion(mensaje, tipo) {
        const notificacion = document.createElement('div');
        notificacion.className = `mensaje mensaje-${tipo}`;
        notificacion.textContent = mensaje;
        
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            notificacion.remove();
        }, 3000);
    }

    actualizarUI() {
        if (!this.personaje) return;
        
        try {
            this.ui.actualizarPersonaje(this.personaje);
            this.actualizarPanelPropiedades();
            this.actualizarPanelFinanzas();
            this.actualizarPanelRelaciones();
            if (typeof actualizarPanelEventosPrincipal === 'function') {
                actualizarPanelEventosPrincipal(this.personaje);
            }
        } catch (error) {
            console.error('Error al actualizar UI:', error);
        }
    }

    actualizarPanelPropiedades() {
        const propiedadesContainer = document.getElementById('propiedades-container');
        if (!propiedadesContainer || !this.personaje) return;

        try {
            // Asegurarnos de que finanzas y propiedades existen
            if (!this.personaje.finanzas) {
                this.personaje.finanzas = new Finanzas();
            }
            if (!Array.isArray(this.personaje.finanzas.propiedades)) {
                this.personaje.finanzas.propiedades = [];
            }

            const propiedades = this.personaje.finanzas.propiedades;
            propiedadesContainer.innerHTML = `
                <h3>Propiedades</h3>
                ${propiedades.length === 0 ? 
                    '<p>No tienes propiedades</p>' :
                    propiedades.map(prop => `
                        <div class="propiedad-item">
                            <p>Tipo: ${prop.tipo}</p>
                            <p>Valor: ${prop.valor}</p>
                            <p>Fecha de compra: ${prop.fechaCompra}</p>
                        </div>
                    `).join('')
                }
            `;
        } catch (error) {
            console.error('Error al actualizar panel de propiedades:', error);
            propiedadesContainer.innerHTML = '<p>Error al cargar propiedades</p>';
        }
    }

    actualizarPanelFinanzas() {
        const finanzasContainer = document.getElementById('finanzas-container');
        if (!finanzasContainer || !this.personaje) return;

        try {
            // Asegurarnos de que finanzas existe
            if (!this.personaje.finanzas) {
                this.personaje.finanzas = new Finanzas();
            }

            const { dinero, gastosMensuales, prestamos, inversiones } = this.personaje.finanzas;
            finanzasContainer.innerHTML = `
                <h3>Finanzas</h3>
                <p>Dinero: ${dinero}</p>
                <h4>Gastos Mensuales</h4>
                ${Object.entries(gastosMensuales || {}).map(([tipo, monto]) => 
                    `<p>${tipo}: ${monto}</p>`
                ).join('')}
                <h4>Préstamos</h4>
                ${(prestamos || []).length === 0 ? 
                    '<p>No tienes préstamos activos</p>' :
                    prestamos.map(prestamo => `
                        <div class="prestamo-item">
                            <p>Tipo: ${prestamo.tipo}</p>
                            <p>Monto: ${prestamo.monto}</p>
                            <p>Cuota mensual: ${prestamo.cuotaMensual}</p>
                        </div>
                    `).join('')
                }
                <h4>Inversiones</h4>
                ${(inversiones || []).length === 0 ? 
                    '<p>No tienes inversiones activas</p>' :
                    inversiones.map(inversion => `
                        <div class="inversion-item">
                            <p>Tipo: ${inversion.tipo}</p>
                            <p>Monto: ${inversion.monto}</p>
                            <p>Retorno esperado: ${inversion.retornoEsperado}%</p>
                        </div>
                    `).join('')
                }
            `;
        } catch (error) {
            console.error('Error al actualizar panel de finanzas:', error);
            finanzasContainer.innerHTML = '<p>Error al cargar finanzas</p>';
        }
    }

    actualizarPanelRelaciones() {
        const relacionesContainer = document.getElementById('relaciones-container');
        if (!relacionesContainer || !this.personaje) return;

        try {
            const relaciones = this.personaje.relaciones || [];
            relacionesContainer.innerHTML = `
                <h3>Relaciones</h3>
                ${relaciones.length === 0 ? 
                    '<p>No tienes relaciones activas</p>' :
                    relaciones.map(relacion => `
                        <div class="relacion-item">
                            <p>Pareja: ${relacion.persona.nombre}</p>
                            <p>Tipo: ${relacion.tipo}</p>
                            <p>Estado: ${relacion.estado}</p>
                            ${relacion.hijos.length > 0 ? `
                                <h4>Hijos</h4>
                                ${relacion.hijos.map(hijo => `
                                    <div class="hijo-item">
                                        <p>Nombre: ${hijo.nombre}</p>
                                        <p>Edad: ${hijo.edad}</p>
                                    </div>
                                `).join('')}
                            ` : ''}
                        </div>
                    `).join('')
                }
            `;
        } catch (error) {
            console.error('Error al actualizar panel de relaciones:', error);
            relacionesContainer.innerHTML = '<p>Error al cargar relaciones</p>';
        }
    }

    mostrarEstadisticasFinales() {
        if (!this.personaje) return;
        
        try {
            const estadisticas = this.personaje.morir();
            this.ui.mostrarEstadisticasMuerte(this.personaje);
        } catch (error) {
            console.error('Error al mostrar estadísticas finales:', error);
        }
    }

    _generarEventoAleatorio() {
        // Reducir la probabilidad de eventos aleatorios a 30%
        if (Math.random() > 0.3) return null;

        const edad = this.personaje.edad;
        // INFANCIA (0-12)
        if (edad <= 12) {
            const eventosInfancia = [
                {
                    titulo: 'Día de juegos',
                    descripcion: 'Te invitan a jugar con amigos en la plaza.',
                    efecto: () => {
                        this.personaje.modificarAtributo('felicidad', 8);
                        return 'Te divertiste mucho y tu felicidad aumentó.';
                    }
                },
                {
                    titulo: 'Resfriado',
                    descripcion: 'Te resfriaste y faltaste a la escuela.',
                    efecto: () => {
                        this.personaje.modificarAtributo('salud', -5);
                        return 'Tu salud disminuyó un poco.';
                    }
                },
                {
                    titulo: 'Nuevo amigo',
                    descripcion: 'Conociste a un nuevo amigo en la escuela.',
                    efecto: () => {
                        this.personaje.modificarAtributo('felicidad', 5);
                        return 'Tu felicidad aumentó por la nueva amistad.';
                    }
                },
                {
                    titulo: 'Decisión: Estudiar o Jugar',
                    descripcion: '¿Prefieres estudiar para el examen o salir a jugar?',
                    decision: true,
                    opciones: [
                        {
                            texto: 'Estudiar',
                            efecto: () => {
                                this.personaje.modificarAtributo('inteligencia', 6);
                                this.personaje.modificarAtributo('felicidad', -2);
                                return 'Mejoraste tu inteligencia pero te divertiste menos.';
                            }
                        },
                        {
                            texto: 'Jugar',
                            efecto: () => {
                                this.personaje.modificarAtributo('felicidad', 6);
                                return 'Te divertiste mucho pero no estudiaste.';
                            }
                        }
                    ]
                }
            ];
            return eventosInfancia[Math.floor(Math.random() * eventosInfancia.length)];
        }
        // ADOLESCENCIA (13-17)
        if (edad <= 17) {
            const eventosAdolescencia = [
                {
                    titulo: 'Examen importante',
                    descripcion: 'Tienes un examen clave en la escuela.',
                    efecto: () => {
                        this.personaje.modificarAtributo('inteligencia', 4);
                        return 'Tu inteligencia aumentó por el esfuerzo.';
                    }
                },
                {
                    titulo: 'Discusión con amigo',
                    descripcion: 'Tuviste una discusión con un amigo cercano.',
                    efecto: () => {
                        this.personaje.modificarAtributo('felicidad', -5);
                        return 'Tu felicidad disminuyó por la pelea.';
                    }
                },
                {
                    titulo: 'Decisión: Deporte o Estudio',
                    descripcion: '¿Prefieres entrenar para el equipo o estudiar para el examen?',
                    decision: true,
                    opciones: [
                        {
                            texto: 'Entrenar',
                            efecto: () => {
                                this.personaje.modificarAtributo('salud', 5);
                                this.personaje.modificarAtributo('felicidad', 2);
                                return 'Mejoraste tu salud y te sentiste bien.';
                            }
                        },
                        {
                            texto: 'Estudiar',
                            efecto: () => {
                                this.personaje.modificarAtributo('inteligencia', 7);
                                this.personaje.modificarAtributo('felicidad', -2);
                                return 'Mejoraste tu inteligencia pero te divertiste menos.';
                            }
                        }
                    ]
                }
            ];
            return eventosAdolescencia[Math.floor(Math.random() * eventosAdolescencia.length)];
        }
        // ADULTEZ (18+)
        // (Mantener eventos previos, más algunos de decisión)
        const esPositivo = Math.random() < 0.6;
        if (esPositivo) {
            const eventosPositivos = [
                {
                    titulo: 'Día Productivo',
                    descripcion: 'Has tenido un día muy productivo.',
                    efecto: () => {
                        this.personaje.modificarAtributo('felicidad', 5);
                        return 'Tu felicidad ha aumentado.';
                    }
                },
                {
                    titulo: 'Decisión: Mudarse o Quedarse',
                    descripcion: 'Te ofrecen mudarte a otra ciudad por trabajo. ¿Qué decides?',
                    decision: true,
                    opciones: [
                        {
                            texto: 'Mudarse',
                            efecto: () => {
                                this.personaje.modificarAtributo('felicidad', -3);
                                this.personaje.modificarAtributo('inteligencia', 2);
                                return 'Te mudaste, ganaste experiencia pero extrañas tu ciudad.';
                            }
                        },
                        {
                            texto: 'Quedarse',
                            efecto: () => {
                                this.personaje.modificarAtributo('felicidad', 2);
                                return 'Te quedaste y mantuviste tus amistades.';
                            }
                        }
                    ]
                }
            ];
            return eventosPositivos[Math.floor(Math.random() * eventosPositivos.length)];
        } else {
            const eventosNegativos = [
                {
                    titulo: 'Día Difícil',
                    descripcion: 'Has tenido un día complicado.',
                    efecto: () => {
                        this.personaje.modificarAtributo('felicidad', -3);
                        return 'Tu felicidad ha disminuido ligeramente.';
                    }
                },
                {
                    titulo: 'Enfermedad leve',
                    descripcion: 'Te enfermaste y faltaste al trabajo.',
                    efecto: () => {
                        this.personaje.modificarAtributo('salud', -6);
                        return 'Tu salud disminuyó.';
                    }
                }
            ];
            return eventosNegativos[Math.floor(Math.random() * eventosNegativos.length)];
        }
    }
} 