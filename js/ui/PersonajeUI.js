import { ATRIBUTOS, EVENTOS, EDUCACION, TRABAJO, PROPIEDADES, INVERSIONES, PRESTAMOS, CONFIG, RELACIONES, EVENTOS_RELACION, ESTADOS_EMBARAZO } from '../data/constants.js';
import { helpers } from '../utils/helpers.js';
import { EfectosVisuales } from './EfectosVisuales.js';

export class PersonajeUI {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.efectos = new EfectosVisuales();
        this.templates = {
            atributo: this._crearTemplateAtributo(),
            evento: this._crearTemplateEvento(),
            decision: this._crearTemplateDecision()
        };
    }

    actualizarPersonaje(personaje) {
        // Actualizar header
        document.getElementById('nombre-personaje').textContent = personaje.nombre;
        document.getElementById('edad-personaje').textContent = personaje.edad + ' años';
        document.getElementById('genero-personaje').textContent = personaje.genero;
        document.getElementById('estado-personaje').textContent = this._formatearEstado(personaje.estado);
        document.getElementById('saldo-personaje').textContent = '$' + (personaje.finanzas?.dinero ?? 0);

        // Actualizar resumen de vida (puedes personalizar esto)
        document.getElementById('resumen-vida').innerHTML = `
            <strong>${personaje.nombre}</strong> nació en algún lugar del mundo.<br>
            Edad actual: ${personaje.edad}<br>
            Estado: ${this._formatearEstado(personaje.estado)}<br>
            <br>
            <em>¡Haz click en +Edad para avanzar y vivir nuevas experiencias!</em>
        `;

        // Actualizar atributos
        document.getElementById('atributos-personaje').innerHTML = `
            <h3>Atributos</h3>
            ${this._mostrarAtributos(personaje.atributos)}
        `;

        // Agregar tooltips a los atributos
        this._agregarTooltips();

        // Hacer scroll al final del historial (si existiera)
        // (Ya no hay historial en el panel central, solo en modales)
    }

    mostrarEvento(evento) {
        const eventoContainer = document.createElement('div');
        eventoContainer.className = 'evento-container';
        
        eventoContainer.innerHTML = `
            <h3>${evento.titulo}</h3>
            <p>${evento.descripcion}</p>
        `;

        if (evento.tipo === EVENTOS.DECISION) {
            const opcionesContainer = document.createElement('div');
            opcionesContainer.className = 'opciones-container';
            
            evento.opciones.forEach(opcion => {
                const boton = document.createElement('button');
                boton.className = 'boton-opcion';
                boton.textContent = opcion.texto;
                boton.dataset.opcionId = opcion.id;
                if (opcion.impacto) {
                    boton.dataset.tooltip = this._formatearImpacto(opcion.impacto);
                }
                opcionesContainer.appendChild(boton);
            });
            
            eventoContainer.appendChild(opcionesContainer);
        }

        this.container.appendChild(eventoContainer);
    }

    _mostrarAtributos(atributos) {
        return Object.entries(atributos)
            .map(([atributo, valor]) => `
                <div class="atributo" data-tooltip="${this._obtenerTooltipAtributo(atributo, valor)}">
                    <span>${this._formatearAtributo(atributo)}:</span>
                    <div class="barra-progreso">
                        <div class="progreso" style="width: ${(valor / CONFIG.ATRIBUTO_MAXIMO) * 100}%"></div>
                    </div>
                    <span>${valor}</span>
                </div>
            `).join('');
    }

    _obtenerTooltipAtributo(atributo, valor) {
        const tooltips = {
            [ATRIBUTOS.FELICIDAD]: `Felicidad: ${valor}%\nAfecta las relaciones y eventos positivos`,
            [ATRIBUTOS.SALUD]: `Salud: ${valor}%\nAfecta la longevidad y resistencia a enfermedades`,
            [ATRIBUTOS.INTELIGENCIA]: `Inteligencia: ${valor}%\nAfecta el rendimiento académico y profesional`,
            [ATRIBUTOS.ASPECTO]: `Aspecto: ${valor}%\nAfecta las relaciones sociales y oportunidades`
        };
        return tooltips[atributo] || `${atributo}: ${valor}%`;
    }

    _formatearImpacto(impacto) {
        return Object.entries(impacto)
            .map(([atributo, valor]) => `${this._formatearAtributo(atributo)}: ${valor > 0 ? '+' : ''}${valor}`)
            .join('\n');
    }

    _agregarTooltips() {
        document.querySelectorAll('[data-tooltip]').forEach(elemento => {
            elemento.addEventListener('mouseenter', () => {
                const tooltip = elemento.getAttribute('data-tooltip');
                if (tooltip) {
                    const impactos = this._parsearImpacto(tooltip);
                    if (impactos) {
                        this.efectos.mostrarBarraImpacto(impactos);
                    }
                }
            });
        });
    }

    _parsearImpacto(texto) {
        try {
            const lineas = texto.split('\n');
            const impactos = {};
            lineas.forEach(linea => {
                const [atributo, valor] = linea.split(': ');
                if (atributo && valor) {
                    impactos[atributo.toLowerCase()] = parseInt(valor);
                }
            });
            return Object.keys(impactos).length > 0 ? impactos : null;
        } catch (error) {
            return null;
        }
    }

    mostrarEstadisticasMuerte(personaje) {
        this.efectos.mostrarEstadisticasMuerte(personaje);
    }

    limpiar() {
        this.efectos.limpiar();
    }

    _mostrarEducacion(carrera) {
        const { nivel, añosCompletados, promedio } = carrera.educacion;
        if (!nivel) {
            return '<p>No está estudiando actualmente</p>';
        }

        return `
            <div class="educacion-info">
                <h4>Educación</h4>
                <p>Nivel: ${nivel}</p>
                <p>Años completados: ${añosCompletados}</p>
                <p>Promedio: ${promedio}</p>
            </div>
        `;
    }

    _mostrarTrabajo(carrera) {
        const { estado, empresa, rol, tipo, salario, añosExperiencia } = carrera.trabajo;
        if (estado !== 'activo') {
            return '<p>No está trabajando actualmente</p>';
        }

        return `
            <div class="trabajo-info">
                <h4>Trabajo</h4>
                <p>Empresa: ${empresa}</p>
                <p>Rol: ${rol}</p>
                <p>Tipo: ${tipo}</p>
                <p>Salario: ${salario}</p>
                <p>Años de experiencia: ${añosExperiencia}</p>
            </div>
        `;
    }

    _mostrarCondiciones(condiciones) {
        if (condiciones.size === 0) {
            return '<p>No tiene condiciones activas</p>';
        }

        return Array.from(condiciones.entries())
            .map(([condicion, duracion]) => `
                <div class="condicion">
                    <p>${condicion} (${duracion} meses)</p>
                </div>
            `).join('');
    }

    _mostrarGastosMensuales(finanzas) {
        const gastos = finanzas.gastosMensuales;
        const total = Object.values(gastos).reduce((sum, gasto) => sum + gasto, 0);

        return `
            <div class="gastos-info">
                <h4>Gastos Mensuales</h4>
                ${Object.entries(gastos).map(([tipo, monto]) => `
                    <p>${tipo}: ${monto}</p>
                `).join('')}
                <p><strong>Total: ${total}</strong></p>
            </div>
        `;
    }

    _mostrarPropiedades(finanzas) {
        if (finanzas.propiedades.length === 0) {
            return '<p>No tiene propiedades</p>';
        }

        return `
            <div class="propiedades-info">
                <h4>Propiedades</h4>
                ${finanzas.propiedades.map(prop => `
                    <div class="propiedad">
                        <p>Tipo: ${prop.tipo}</p>
                        <p>Valor: ${prop.valor}</p>
                        <p>Fecha de compra: ${prop.fechaCompra}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    _mostrarPrestamos(finanzas) {
        if (finanzas.prestamos.length === 0) {
            return '<p>No tiene préstamos activos</p>';
        }

        return `
            <div class="prestamos-info">
                <h4>Préstamos</h4>
                ${finanzas.prestamos.map(prestamo => `
                    <div class="prestamo">
                        <p>Tipo: ${prestamo.tipo}</p>
                        <p>Monto: ${prestamo.monto}</p>
                        <p>Cuota mensual: ${prestamo.cuotaMensual}</p>
                        <p>Estado: ${prestamo.estado}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    _mostrarInversiones(finanzas) {
        if (finanzas.inversiones.length === 0) {
            return '<p>No tiene inversiones activas</p>';
        }

        return `
            <div class="inversiones-info">
                <h4>Inversiones</h4>
                ${finanzas.inversiones.map(inversion => `
                    <div class="inversion">
                        <p>Tipo: ${inversion.tipo}</p>
                        <p>Monto: ${inversion.monto}</p>
                        <p>Retorno esperado: ${inversion.retornoEsperado}%</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    _mostrarRelaciones(personaje) {
        if (personaje.relaciones.length === 0) {
            return '<p>No tiene relaciones activas</p>';
        }

        return `
            <div class="relaciones-info">
                <h4>Relaciones</h4>
                ${personaje.relaciones.map(relacion => `
                    <div class="relacion">
                        <p>Pareja: ${relacion.persona.nombre}</p>
                        <p>Tipo: ${relacion.tipo}</p>
                        <p>Estado: ${relacion.estado}</p>
                        <p>Duración: ${relacion.obtenerDuracion()} meses</p>
                        ${this._mostrarHijos(relacion)}
                    </div>
                `).join('')}
            </div>
        `;
    }

    _mostrarHijos(relacion) {
        if (relacion.hijos.length === 0) {
            return '';
        }

        return `
            <div class="hijos-info">
                <h5>Hijos</h5>
                ${relacion.hijos.map(hijo => `
                    <div class="hijo">
                        <p>Nombre: ${hijo.nombre}</p>
                        <p>Edad: ${hijo.edad}</p>
                        <p>Género: ${hijo.genero}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    _mostrarEmbarazo(personaje) {
        if (personaje.embarazo.estado === ESTADOS_EMBARAZO.NO_EMBARAZADA) {
            return '';
        }

        return `
            <div class="embarazo-info">
                <h4>Embarazo</h4>
                <p>Meses: ${personaje.embarazo.meses}</p>
                <p>Pareja: ${personaje.embarazo.pareja.nombre}</p>
            </div>
        `;
    }

    _mostrarHistorial(historial) {
        if (!historial || historial.length === 0) {
            return '<p>No hay eventos en el historial</p>';
        }
        // Agrupar eventos por edad
        const eventosPorEdad = {};
        historial.forEach(evento => {
            const edad = evento.edad !== undefined && evento.edad !== null ? evento.edad : 'Sin edad';
            if (!eventosPorEdad[edad]) {
                eventosPorEdad[edad] = [];
            }
            eventosPorEdad[edad].push(evento);
        });
        // Ordenar por edad ascendente (ignorando 'Sin edad')
        const edades = Object.keys(eventosPorEdad).sort((a, b) => {
            if (a === 'Sin edad') return 1;
            if (b === 'Sin edad') return -1;
            return parseInt(a) - parseInt(b);
        });
        return `
            <div class="historial-lista">
                ${edades.map(edad => `
                    <div class="evento-por-edad">
                        <div class="evento-edad"><strong>Edad ${edad}</strong></div>
                        <ul class="eventos-del-ano">
                            ${eventosPorEdad[edad].map(ev => `
                                <li class="evento-descripcion">${ev.descripcion ? ev.descripcion : ''}</li>
                            `).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        `;
    }

    _formatearGastoTipo(tipo) {
        const tipos = {
            alquiler: 'Alquiler',
            servicios: 'Servicios',
            comida: 'Comida',
            salud: 'Salud',
            entretenimiento: 'Entretenimiento'
        };
        return tipos[tipo] || tipo;
    }

    _crearElementoAtributo(atributo, valor) {
        const elemento = document.createElement('div');
        elemento.className = 'atributo';
        elemento.innerHTML = `
            <span class="atributo-nombre">${this._formatearAtributo(atributo)}</span>
            <div class="atributo-bar">
                <div class="atributo-valor" style="width: ${valor}%"></div>
            </div>
            <span class="atributo-numero">${valor}%</span>
        `;
        return elemento;
    }

    _crearElementoEvento(evento) {
        const elemento = document.createElement('li');
        elemento.className = `evento evento-${evento.tipo}`;
        elemento.innerHTML = `
            <span class="evento-edad">Edad ${evento.edad}:</span>
            <span class="evento-titulo">${evento.titulo}</span>
            <p class="evento-descripcion">${evento.descripcion}</p>
        `;
        return elemento;
    }

    _formatearAtributo(atributo) {
        const nombres = {
            [ATRIBUTOS.FELICIDAD]: 'Felicidad',
            [ATRIBUTOS.SALUD]: 'Salud',
            [ATRIBUTOS.INTELIGENCIA]: 'Inteligencia',
            [ATRIBUTOS.ASPECTO]: 'Aspecto'
        };
        return nombres[atributo] || atributo;
    }

    _formatearEstado(estado) {
        const estados = {
            'vivo': 'Vivo',
            'muerto': 'Fallecido',
            'enfermo': 'Enfermo'
        };
        return estados[estado] || estado;
    }

    _crearTemplateAtributo() {
        const template = document.createElement('template');
        template.innerHTML = `
            <div class="atributo">
                <span class="atributo-nombre"></span>
                <div class="atributo-bar">
                    <div class="atributo-valor"></div>
                </div>
                <span class="atributo-numero"></span>
            </div>
        `;
        return template;
    }

    _crearTemplateEvento() {
        const template = document.createElement('template');
        template.innerHTML = `
            <li class="evento">
                <span class="evento-edad"></span>
                <span class="evento-titulo"></span>
                <p class="evento-descripcion"></p>
            </li>
        `;
        return template;
    }

    _crearTemplateDecision() {
        const template = document.createElement('template');
        template.innerHTML = `
            <div class="decision">
                <h3 class="decision-titulo"></h3>
                <p class="decision-descripcion"></p>
                <div class="decision-opciones"></div>
            </div>
        `;
        return template;
    }
} 