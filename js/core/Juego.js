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
            const evento = this.eventos.generarEventoAleatorio(this.personaje);
            if (evento) {
                this.aplicarEvento(evento);
            }
            
            // Actualizar la interfaz
            this.actualizarUI();
            
            // Verificar si el personaje ha muerto
            if (this.personaje.estado === 'muerto') {
                this.mostrarEstadisticasFinales();
            }
        } catch (error) {
            console.error('Error al avanzar año:', error);
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
} 