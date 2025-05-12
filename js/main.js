import { Personaje } from './core/Personaje.js';
import { Familia } from './core/Familia.js';
import { EventManager } from './events/EventManager.js';
import { PersonajeUI } from './ui/PersonajeUI.js';
import StorageManager from './data/storage.js';
import { helpers } from './utils/helpers.js';
import { Juego } from './core/Juego.js';

// Inicializar el juego cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const juego = new Juego();
    
    // Formulario de creación de personaje
    const formPersonaje = document.getElementById('form-personaje');
    if (formPersonaje) {
        formPersonaje.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value;
            const genero = document.getElementById('genero').value;
            
            try {
                juego.crearNuevoPersonaje(nombre, genero);
                document.getElementById('form-container').style.display = 'none';
                document.getElementById('juego-container').style.display = 'block';
                document.getElementById('menu-inferior').style.display = 'flex';
            } catch (error) {
                console.error('Error al crear personaje:', error);
                alert('Error al crear el personaje. Por favor, inténtalo de nuevo.');
            }
        });
    }

    // Botón de avanzar año
    const btnAvanzar = document.getElementById('btn-edad');
    if (btnAvanzar) {
        btnAvanzar.addEventListener('click', () => {
            try {
                juego.avanzarAnio();
            } catch (error) {
                console.error('Error al avanzar año:', error);
                alert('Error al avanzar el año. Por favor, inténtalo de nuevo.');
            }
        });
    }

    // Fondo de partículas animadas (celestes y violetas)
    const canvas = document.getElementById('particles-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resizeCanvas);

    // Configuración de partículas
    const PARTICLE_COLORS = ['#00eaff', '#7f5cff'];
    const PARTICLE_COUNT = Math.floor((width * height) / 3500);
    const particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 2.2 + 1.2,
            color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
            dx: (Math.random() - 0.5) * 0.3,
            dy: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.5 + 0.3
        });
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        for (let p of particles) {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 12;
            ctx.fill();
            ctx.restore();
            // Movimiento
            p.x += p.dx;
            p.y += p.dy;
            // Rebote en bordes
            if (p.x < 0 || p.x > width) p.dx *= -1;
            if (p.y < 0 || p.y > height) p.dy *= -1;
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // Referencias a los paneles de contenido
    const contenidoEstudios = document.getElementById('contenido-estudios');
    const contenidoPropiedades = document.getElementById('contenido-propiedades');
    const contenidoRelaciones = document.getElementById('contenido-relaciones');
    const contenidoActividades = document.getElementById('contenido-actividades');

    // Helper para obtener el personaje actual
    function getPersonajeActual(juego) {
        return juego && juego.personaje ? juego.personaje : null;
    }

    // --- ACTIVIDADES INTERACTIVAS ---
    const actividades = [
        { nombre: 'Ir al cine', efecto: { felicidad: 8 }, descripcion: 'Fuiste al cine y te divertiste.' },
        { nombre: 'Leer un libro', efecto: { inteligencia: 6 }, descripcion: 'Leíste un libro interesante.' },
        { nombre: 'Hacer ejercicio', efecto: { salud: 7, felicidad: 2 }, descripcion: 'Hiciste ejercicio y te sientes mejor.' },
        { nombre: 'Viajar', efecto: { felicidad: 10, dinero: -100 }, descripcion: 'Viajaste y viviste una aventura.' },
        { nombre: 'Ir al médico', efecto: { salud: 12, dinero: -50 }, descripcion: 'Fuiste al médico y mejoraste tu salud.' },
        { nombre: 'Salir con amigos', efecto: { felicidad: 9 }, descripcion: 'Saliste con amigos y la pasaste bien.' },
        { nombre: 'Rendir registro de conducir', efecto: {}, descripcion: 'Intentas obtener el registro de conducir.', especial: 'registro' },
        { nombre: 'Conocer pareja', efecto: {}, descripcion: 'Intentas conocer a alguien especial.', especial: 'pareja' }
    ];

    const preguntasRegistro = [
        {
            pregunta: '¿Cuál es la velocidad máxima permitida en zona urbana?',
            opciones: ['40 km/h', '60 km/h', '80 km/h'],
            correcta: 1
        },
        {
            pregunta: '¿Qué debe hacer si ve una luz roja en el semáforo?',
            opciones: ['Acelerar', 'Detenerse', 'Tocar bocina'],
            correcta: 1
        },
        {
            pregunta: '¿Qué significa una señal de "PARE"?',
            opciones: ['Reducir la velocidad', 'Detenerse completamente', 'Seguir'],
            correcta: 1
        },
        {
            pregunta: '¿Quién tiene prioridad en una rotonda?',
            opciones: ['El que entra', 'El que ya circula', 'El más grande'],
            correcta: 1
        }
    ];

    function mostrarActividades(juego) {
        const personaje = getPersonajeActual(juego);
        contenidoActividades.innerHTML = `
            <h2>Actividades</h2>
            <ul>
                ${actividades.map((a, i) => `<li><button class="boton-menu" data-actividad="${i}">${a.nombre}</button></li>`).join('')}
            </ul>
            <p style="color:var(--color-text-light);font-size:0.95em;">Haz click en una actividad para realizarla y ver su efecto.</p>
            <div id="actividad-feedback"></div>
        `;
        actividades.forEach((a, i) => {
            const btn = contenidoActividades.querySelector(`[data-actividad="${i}"]`);
            if (btn) {
                btn.onclick = () => {
                    if (a.especial === 'registro') {
                        // Modal de examen de conducir
                        let modal = document.getElementById('modal-examen-registro');
                        if (!modal) {
                            modal = document.createElement('div');
                            modal.id = 'modal-examen-registro';
                            modal.className = 'modal-flotante';
                            document.body.appendChild(modal);
                        }
                        modal.style.display = 'flex';
                        modal.style.position = 'fixed';
                        modal.style.top = '0';
                        modal.style.left = '0';
                        modal.style.width = '100vw';
                        modal.style.height = '100vh';
                        modal.style.alignItems = 'center';
                        modal.style.justifyContent = 'center';
                        modal.style.background = 'rgba(0,0,0,0.4)';
                        modal.style.zIndex = '9999';
                        // Elegir pregunta aleatoria
                        const preguntaIdx = Math.floor(Math.random() * preguntasRegistro.length);
                        const pregunta = preguntasRegistro[preguntaIdx];
                        modal.innerHTML = `
                            <div class='modal-contenido' style='background:white;padding:30px 20px;border-radius:12px;min-width:320px;max-width:90vw;'>
                                <h3>Examen de conducir</h3>
                                <p>${pregunta.pregunta}</p>
                                <ul style='list-style:none;padding:0;'>
                                    ${pregunta.opciones.map((op, j) => `
                                        <li style='margin-bottom:8px;'>
                                            <button class='boton-menu' data-respuesta='${j}'>${op}</button>
                                        </li>
                                    `).join('')}
                                </ul>
                                <div id='registro-feedback'></div>
                                <button class='boton-menu' id='cerrar-modal-registro'>Cancelar</button>
                            </div>
                        `;
                        // Listener para respuestas
                        modal.querySelectorAll('[data-respuesta]').forEach(btnOpcion => {
                            btnOpcion.onclick = () => {
                                const respuesta = parseInt(btnOpcion.getAttribute('data-respuesta'));
                                if (respuesta === pregunta.correcta) {
                                    personaje.tieneRegistro = true;
                                    document.getElementById('registro-feedback').innerHTML = `<span style='color:var(--color-exito)'>¡Aprobaste el examen! Ahora puedes comprar un auto.</span>`;
                                } else {
                                    personaje.tieneRegistro = false;
                                    document.getElementById('registro-feedback').innerHTML = `<span style='color:var(--color-error)'>Respuesta incorrecta. Debes pagar $100 para volver a intentarlo.</span>`;
                                    personaje.finanzas.modificarDinero(-100);
                                }
                                window.juego.ui.actualizarPersonaje(personaje);
                            };
                        });
                        // Cerrar modal
                        modal.querySelector('#cerrar-modal-registro').onclick = () => {
                            modal.style.display = 'none';
                        };
                        return;
                    }
                    if (a.especial === 'pareja') {
                        // Modal para conocer pareja
                        let modal = document.getElementById('modal-pareja');
                        if (!modal) {
                            modal = document.createElement('div');
                            modal.id = 'modal-pareja';
                            modal.className = 'modal-flotante';
                            document.body.appendChild(modal);
                        }
                        modal.style.display = 'flex';
                        modal.style.position = 'fixed';
                        modal.style.top = '0';
                        modal.style.left = '0';
                        modal.style.width = '100vw';
                        modal.style.height = '100vh';
                        modal.style.alignItems = 'center';
                        modal.style.justifyContent = 'center';
                        modal.style.background = 'rgba(0,0,0,0.4)';
                        modal.style.zIndex = '9999';
                        modal.innerHTML = `
                            <div class='modal-contenido' style='background:white;padding:30px 20px;border-radius:12px;min-width:320px;max-width:90vw;'>
                                <h3>Conocer pareja</h3>
                                <p>¿Quieres intentar conocer a alguien especial?</p>
                                <button class='boton-menu' id='btn-intentar-pareja'>Intentar</button>
                                <div id='pareja-feedback'></div>
                                <button class='boton-menu' id='cerrar-modal-pareja'>Cancelar</button>
                            </div>
                        `;
                        modal.querySelector('#btn-intentar-pareja').onclick = () => {
                            // Lógica de éxito: depende de aspecto, felicidad y azar
                            const aspecto = personaje.atributos?.aspecto || 50;
                            const felicidad = personaje.atributos?.felicidad || 50;
                            const prob = Math.min(0.85, 0.2 + aspecto/200 + felicidad/200 + Math.random()*0.3);
                            if (Math.random() < prob) {
                                // Crear pareja con estructura correcta y hijos: []
                                const nombres = ['Alex', 'Sofía', 'Martín', 'Valentina', 'Lucas', 'Camila', 'Mateo', 'Julieta'];
                                const nombrePareja = nombres[Math.floor(Math.random()*nombres.length)];
                                const edadPareja = personaje.edad + Math.floor(Math.random()*5-2);
                                const generoPareja = Math.random() < 0.5 ? 'Femenino' : 'Masculino';
                                const personaPareja = { nombre: nombrePareja, edad: edadPareja, genero: generoPareja };
                                if (!Array.isArray(personaje.relaciones)) personaje.relaciones = [];
                                personaje.relaciones.push({ tipo: 'pareja', persona: personaPareja, nivelRelacion: 60, hijos: [] });
                                personaje.agregarEvento({
                                    titulo: 'Nueva pareja',
                                    descripcion: `¡Has conocido a ${nombrePareja}!`,
                                    tipo: 'pareja',
                                    edad: personaje.edad
                                });
                                const feedback = modal.querySelector('#pareja-feedback');
                                if (feedback) feedback.innerHTML = `<span style='color:var(--color-exito)'>¡Has conocido a ${nombrePareja}!</span>`;
                                window.juego.ui.actualizarPersonaje(personaje);
                            } else {
                                const feedback = modal.querySelector('#pareja-feedback');
                                if (feedback) feedback.innerHTML = `<span style='color:var(--color-error)'>No tuviste suerte esta vez. ¡Intenta de nuevo más tarde!</span>`;
                            }
                        };
                        modal.querySelector('#cerrar-modal-pareja').onclick = () => {
                            modal.style.display = 'none';
                        };
                        return;
                    }
                    // Actividades normales
                    Object.entries(a.efecto).forEach(([atrib, val]) => {
                        if (atrib === 'dinero') personaje.modificarDinero(val);
                        else personaje.modificarAtributo(atrib, val);
                    });
                    personaje.agregarEvento({
                        titulo: 'Actividad',
                        descripcion: a.descripcion,
                        tipo: 'actividad',
                        edad: personaje.edad
                    });
                    document.getElementById('actividad-feedback').innerHTML = `<span style='color:var(--color-primary)'>${a.descripcion}</span>`;
                    window.juego.ui.actualizarPersonaje(personaje);
                };
            }
        });
    }

    // --- RELACIONES INTERACTIVAS ---
    function mostrarRelaciones(juego) {
        const personaje = getPersonajeActual(juego);
        if (!personaje) {
            contenidoRelaciones.innerHTML = '<p>No hay personaje cargado.</p>';
            return;
        }
        const relaciones = personaje.relaciones || [];
        if (relaciones.length === 0) {
            contenidoRelaciones.innerHTML = '<p>No tienes relaciones activas ni pasadas.</p>';
            return;
        }
        // Agrupar por tipo
        const padres = relaciones.filter(r => r.tipo === 'padre' || r.tipo === 'madre');
        const hermanos = relaciones.filter(r => r.tipo === 'hermano' || r.tipo === 'hermano gemelo');
        const parejas = relaciones.filter(r => r.tipo === 'pareja' || r.tipo === 'casada');
        const otros = relaciones.filter(r => !['padre', 'madre', 'hermano', 'hermano gemelo', 'pareja', 'casada'].includes(r.tipo));

        function crearBotonDetalles(r, i, grupo) {
            return `<button class='boton-menu' data-ver='${grupo}-${i}'>Ver detalles</button>`;
        }
        function crearBotonEliminar(r, i, grupo) {
            return `<button class='boton-menu peligro' data-eliminar='${grupo}-${i}'>Eliminar</button>`;
        }
        contenidoRelaciones.innerHTML = `
            <h2>Padres</h2>
            ${padres.length === 0 ? '<p>No tienes padres registrados.</p>' : `<ul>${padres.map((r, i) => `
                <li>
                    <strong>${r.persona.nombre}</strong> (${r.tipo}, ${r.persona.edad || '-'} años, ${r.persona.ocupacion || 'sin ocupación'})
                    ${crearBotonDetalles(r, i, 'padre')}
                    ${crearBotonEliminar(r, i, 'padre')}
                </li>
            `).join('')}</ul>`}
            <h2>Hermanos</h2>
            ${hermanos.length === 0 ? '<p>No tienes hermanos.</p>' : `<ul>${hermanos.map((r, i) => `
                <li>
                    <strong>${r.persona.nombre}</strong> (${r.tipo}, ${r.persona.edad || '-'} años)
                    ${crearBotonDetalles(r, i, 'hermano')}
                    ${crearBotonEliminar(r, i, 'hermano')}
                </li>
            `).join('')}</ul>`}
            <h2>Parejas</h2>
            ${parejas.length === 0 ? '<p>No tienes pareja.</p>' : `<ul>${parejas.map((r, i) => `
                <li>
                    <strong>${r.persona.nombre}</strong> (${r.tipo})
                    ${crearBotonDetalles(r, i, 'pareja')}
                    ${crearBotonEliminar(r, i, 'pareja')}
                </li>
            `).join('')}</ul>`}
            <h2>Otras relaciones</h2>
            ${otros.length === 0 ? '<p>No tienes otras relaciones.</p>' : `<ul>${otros.map((r, i) => `
                <li>
                    <strong>${r.persona.nombre}</strong> (${r.tipo})
                    ${crearBotonDetalles(r, i, 'otro')}
                    ${crearBotonEliminar(r, i, 'otro')}
                </li>
            `).join('')}</ul>`}
            <div id='relacion-modal' class='modal-flotante' style='display:none;'></div>
        `;
        // Listeners para detalles y eliminar
        contenidoRelaciones.querySelectorAll('[data-ver]').forEach(btn => {
            btn.onclick = e => {
                const [grupo, idx] = btn.getAttribute('data-ver').split('-');
                let rel;
                if (grupo === 'padre') rel = padres[idx];
                if (grupo === 'hermano') rel = hermanos[idx];
                if (grupo === 'pareja') rel = parejas[idx];
                if (grupo === 'otro') rel = otros[idx];
                if (!rel) return;
                const modal = document.getElementById('relacion-modal');
                modal.innerHTML = `
                    <div class='modal-contenido'>
                        <h3>${rel.persona.nombre}</h3>
                        <p><strong>Tipo:</strong> ${rel.tipo}</p>
                        <p><strong>Edad:</strong> ${rel.persona.edad || '-'}</p>
                        <p><strong>Ocupación:</strong> ${rel.persona.ocupacion || '-'}</p>
                        <p><strong>Nivel de relación:</strong> <span id='nivel-relacion'>${rel.nivelRelacion ?? 50}/100</span></p>
                        <div style='margin:10px 0;'>
                            <button class='boton-menu' id='btn-charlar'>Charlar</button>
                            <button class='boton-menu' id='btn-discutir'>Discutir</button>
                            <button class='boton-menu' id='btn-salir-juntos'>Salir juntos</button>
                        </div>
                        <button class='boton-menu' id='cerrar-detalle-relacion'>Cerrar</button>
                    </div>
                `;
                modal.style.display = 'block';
                document.getElementById('cerrar-detalle-relacion').onclick = () => {
                    modal.style.display = 'none';
                };
                // Actividades familiares
                document.getElementById('btn-charlar').onclick = () => {
                    window.juego.personaje.modificarRelacion(rel.persona, 10);
                    window.juego.personaje.modificarAtributo('felicidad', 2);
                    document.getElementById('nivel-relacion').textContent = `${rel.nivelRelacion}/100`;
                };
                document.getElementById('btn-discutir').onclick = () => {
                    window.juego.personaje.modificarRelacion(rel.persona, -15);
                    window.juego.personaje.modificarAtributo('felicidad', -3);
                    document.getElementById('nivel-relacion').textContent = `${rel.nivelRelacion}/100`;
                };
                document.getElementById('btn-salir-juntos').onclick = () => {
                    window.juego.personaje.modificarRelacion(rel.persona, 20);
                    window.juego.personaje.modificarAtributo('felicidad', 5);
                    document.getElementById('nivel-relacion').textContent = `${rel.nivelRelacion}/100`;
                };
            };
        });
        contenidoRelaciones.querySelectorAll('[data-eliminar]').forEach(btn => {
            btn.onclick = e => {
                const [grupo, idx] = btn.getAttribute('data-eliminar').split('-');
                let rel;
                if (grupo === 'padre') rel = padres[idx];
                if (grupo === 'hermano') rel = hermanos[idx];
                if (grupo === 'pareja') rel = parejas[idx];
                if (grupo === 'otro') rel = otros[idx];
                if (!rel) return;
                if (confirm(`¿Seguro que quieres eliminar la relación con ${rel.persona.nombre}?`)) {
                    const index = personaje.relaciones.indexOf(rel);
                    if (index !== -1) {
                        personaje.relaciones.splice(index, 1);
                        mostrarRelaciones(juego);
                    }
                }
            };
        });
    }

    // --- PROPIEDADES INTERACTIVAS ---
    function mostrarPropiedades(juego) {
        const personaje = getPersonajeActual(juego);
        if (!personaje) {
            contenidoPropiedades.innerHTML = '<p>No hay personaje cargado.</p>';
            return;
        }
        const propiedades = personaje.propiedades || [];
        const autos = personaje.autos || [];
        contenidoPropiedades.innerHTML = `
            <h2>Propiedades</h2>
            <ul>
                ${propiedades.length === 0 ? '<li>No tienes propiedades.</li>' : propiedades.map(p => `<li>${p.nombre} (${p.ubicacion}) - $${p.precio}</li>`).join('')}
            </ul>
            <button class='boton-menu' id='btn-comprar-propiedad'>Comprar propiedad</button>
            <hr>
            <h2>Autos</h2>
            <ul>
                ${autos.length === 0 ? '<li>No tienes autos.</li>' : autos.map(a => `<li>${a.nombre} (${a.concesionario}) - $${a.precio}</li>`).join('')}
            </ul>
            <button class='boton-menu' id='btn-comprar-auto'>Comprar auto</button>
            <div id='propiedades-feedback'></div>
        `;
        // Comprar propiedad
        const btnComprarProp = document.getElementById('btn-comprar-propiedad');
        if (btnComprarProp) {
            btnComprarProp.onclick = () => {
                const inmobiliarias = [
                    {
                        nombre: 'Premium Inmobiliaria',
                        propiedades: [
                            { nombre: 'Casa de lujo', ubicacion: 'Barrio Norte', precio: 120000 },
                            { nombre: 'Departamento premium', ubicacion: 'Centro', precio: 90000 }
                        ]
                    },
                    {
                        nombre: 'Econohogar',
                        propiedades: [
                            { nombre: 'Casa simple', ubicacion: 'Barrio Sur', precio: 50000 },
                            { nombre: 'Departamento chico', ubicacion: 'Suburbios', precio: 35000 }
                        ]
                    }
                ];
                let modal = document.getElementById('modal-propiedades');
                if (!modal) {
                    modal = document.createElement('div');
                    modal.id = 'modal-propiedades';
                    modal.className = 'modal-flotante';
                    document.body.appendChild(modal);
                }
                modal.style.display = 'flex';
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100vw';
                modal.style.height = '100vh';
                modal.style.alignItems = 'center';
                modal.style.justifyContent = 'center';
                modal.style.background = 'rgba(0,0,0,0.4)';
                modal.style.zIndex = '9999';
                modal.innerHTML = `
                    <div class='modal-contenido' style='background:white;padding:30px 20px;border-radius:12px;min-width:320px;max-width:90vw;'>
                        <h3>Elige una inmobiliaria</h3>
                        <ul style='list-style:none;padding:0;'>
                            ${inmobiliarias.map((inmo, i) => `
                                <li style='margin-bottom:10px;'>
                                    <strong>${inmo.nombre}</strong>
                                    <ul style='list-style:none;padding:0;'>
                                        ${inmo.propiedades.map((p, j) => `
                                            <li style='margin-bottom:6px;'>
                                                <button class='boton-menu' data-inmo='${i}' data-prop='${j}'>${p.nombre} - ${p.ubicacion} ($${p.precio})</button>
                                            </li>
                                        `).join('')}
                                    </ul>
                                </li>
                            `).join('')}
                        </ul>
                        <button class='boton-menu' id='cerrar-modal-prop'>Cancelar</button>
                    </div>
                `;
                inmobiliarias.forEach((inmo, i) => {
                    inmo.propiedades.forEach((p, j) => {
                        const btnProp = modal.querySelector(`[data-inmo='${i}'][data-prop='${j}']`);
                        if (btnProp) {
                            btnProp.onclick = () => {
                                if (personaje.finanzas.dinero < p.precio) {
                                    const feedback = document.getElementById('propiedades-feedback');
                                    if (feedback) feedback.innerHTML = `<span style='color:var(--color-error)'>No tienes suficiente dinero.</span>`;
                                    return;
                                }
                                personaje.finanzas.modificarDinero(-p.precio);
                                if (!personaje.propiedades) personaje.propiedades = [];
                                personaje.propiedades.push({ ...p });
                                personaje.agregarEvento({
                                    titulo: 'Compra de propiedad',
                                    descripcion: `Compraste ${p.nombre} en ${p.ubicacion} por $${p.precio}.`,
                                    tipo: 'propiedad',
                                    edad: personaje.edad
                                });
                                const feedback = document.getElementById('propiedades-feedback');
                                if (feedback) feedback.innerHTML = `<span style='color:var(--color-exito)'>¡Propiedad comprada!</span>`;
                                window.juego.ui.actualizarPersonaje(personaje);
                                modal.style.display = 'none';
                                mostrarPropiedades(juego);
                            };
                        }
                    });
                });
                modal.querySelector('#cerrar-modal-prop').onclick = () => {
                    modal.style.display = 'none';
                };
            };
        }
        // Comprar auto
        const btnComprarAuto = document.getElementById('btn-comprar-auto');
        if (btnComprarAuto) {
            btnComprarAuto.onclick = () => {
                if (!personaje.tieneRegistro) {
                    const feedback = document.getElementById('propiedades-feedback');
                    if (feedback) feedback.innerHTML = `<span style='color:var(--color-error)'>Necesitas el registro de conducir para comprar un auto.</span>`;
                    return;
                }
                const concesionarios = [
                    {
                        nombre: 'AutoElite',
                        autos: [
                            { nombre: 'Deportivo X', concesionario: 'AutoElite', precio: 60000 },
                            { nombre: 'SUV Premium', concesionario: 'AutoElite', precio: 45000 }
                        ]
                    },
                    {
                        nombre: 'AhorroCar',
                        autos: [
                            { nombre: 'Económico 1', concesionario: 'AhorroCar', precio: 18000 },
                            { nombre: 'Compacto 2', concesionario: 'AhorroCar', precio: 12000 }
                        ]
                    }
                ];
                let modal = document.getElementById('modal-autos');
                if (!modal) {
                    modal = document.createElement('div');
                    modal.id = 'modal-autos';
                    modal.className = 'modal-flotante';
                    document.body.appendChild(modal);
                }
                modal.style.display = 'flex';
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100vw';
                modal.style.height = '100vh';
                modal.style.alignItems = 'center';
                modal.style.justifyContent = 'center';
                modal.style.background = 'rgba(0,0,0,0.4)';
                modal.style.zIndex = '9999';
                modal.innerHTML = `
                    <div class='modal-contenido' style='background:white;padding:30px 20px;border-radius:12px;min-width:320px;max-width:90vw;'>
                        <h3>Elige un concesionario</h3>
                        <ul style='list-style:none;padding:0;'>
                            ${concesionarios.map((conc, i) => `
                                <li style='margin-bottom:10px;'>
                                    <strong>${conc.nombre}</strong>
                                    <ul style='list-style:none;padding:0;'>
                                        ${conc.autos.map((a, j) => `
                                            <li style='margin-bottom:6px;'>
                                                <button class='boton-menu' data-conc='${i}' data-auto='${j}'>${a.nombre} ($${a.precio})</button>
                                            </li>
                                        `).join('')}
                                    </ul>
                                </li>
                            `).join('')}
                        </ul>
                        <button class='boton-menu' id='cerrar-modal-auto'>Cancelar</button>
                    </div>
                `;
                concesionarios.forEach((conc, i) => {
                    conc.autos.forEach((a, j) => {
                        const btnAuto = modal.querySelector(`[data-conc='${i}'][data-auto='${j}']`);
                        if (btnAuto) {
                            btnAuto.onclick = () => {
                                if (personaje.finanzas.dinero < a.precio) {
                                    const feedback = document.getElementById('propiedades-feedback');
                                    if (feedback) feedback.innerHTML = `<span style='color:var(--color-error)'>No tienes suficiente dinero.</span>`;
                                    return;
                                }
                                personaje.finanzas.modificarDinero(-a.precio);
                                if (!personaje.autos) personaje.autos = [];
                                personaje.autos.push({ ...a });
                                personaje.agregarEvento({
                                    titulo: 'Compra de auto',
                                    descripcion: `Compraste ${a.nombre} en ${a.concesionario} por $${a.precio}.`,
                                    tipo: 'auto',
                                    edad: personaje.edad
                                });
                                const feedback = document.getElementById('propiedades-feedback');
                                if (feedback) feedback.innerHTML = `<span style='color:var(--color-exito)'>¡Auto comprado!</span>`;
                                window.juego.ui.actualizarPersonaje(personaje);
                                modal.style.display = 'none';
                                mostrarPropiedades(juego);
                            };
                        }
                    });
                });
                modal.querySelector('#cerrar-modal-auto').onclick = () => {
                    modal.style.display = 'none';
                };
            };
        }
    }

    // --- ESTUDIOS/TRABAJO INTERACTIVO ---
    function mostrarEstudiosTrabajo(juego) {
        const personaje = getPersonajeActual(juego);
        if (!personaje) {
            contenidoEstudios.innerHTML = '<p>No hay personaje cargado.</p>';
            return;
        }
        const educacion = personaje.carrera.educacion;
        const trabajo = personaje.carrera.trabajo;
        let puedeTrabajar = personaje.edad >= 18;
        let puedeEstudiar = true;
        let mensajeRestriccion = '';
        if (!puedeTrabajar) {
            mensajeRestriccion = '<p class="mensaje-advertencia">Hasta los 18 años solo puedes estudiar.</p>';
        }
        // Opciones de carrera universitaria
        let opcionesCarrera = '';
        if (personaje.edad >= 18 && !educacion.carrera && educacion.nivel === null) {
            opcionesCarrera = `
                <label for='select-carrera'>Elige una carrera universitaria:</label>
                <select id='select-carrera'>
                    <option value=''>Selecciona...</option>
                    <option value='MEDICINA'>Medicina</option>
                    <option value='DERECHO'>Derecho</option>
                    <option value='INGENIERIA'>Ingeniería</option>
                    <option value='ARTE'>Arte</option>
                    <option value='EMPRESARIAL'>Administración de Empresas</option>
                </select>
                <button class='boton-menu' id='btn-elegir-carrera'>Elegir carrera</button>
            `;
        }
        // Opciones de posgrado/cursos
        let opcionesPosgrado = '';
        if (educacion.carrera && personaje.edad >= 23) {
            opcionesPosgrado = `
                <label for='select-posgrado'>Posgrados/cursos:</label>
                <select id='select-posgrado'>
                    <option value=''>Selecciona...</option>
                    <option value='POSGRADO'>Posgrado</option>
                    <option value='CURSO'>Curso de especialización</option>
                </select>
                <button class='boton-menu' id='btn-hacer-posgrado'>Realizar</button>
            `;
        }
        // Trabajos desbloqueados
        let trabajosDisponibles = '';
        if (personaje.edad >= 18) {
            trabajosDisponibles = `<h3>Trabajos disponibles según tu educación:</h3><ul>`;
            if (educacion.carrera) {
                trabajosDisponibles += `<li>Profesional en ${educacion.carrera}</li>`;
            } else if (educacion.nivel === 'Escuela Secundaria') {
                trabajosDisponibles += `<li>Empleos básicos (vendedor, administrativo, etc.)</li>`;
            } else {
                trabajosDisponibles += `<li>Trabajos no calificados</li>`;
            }
            trabajosDisponibles += `</ul>`;
        }
        contenidoEstudios.innerHTML = `
            <h2>Estudios</h2>
            <p><strong>Nivel:</strong> ${educacion.nivel || 'Ninguno'}</p>
            <p><strong>Carrera:</strong> ${educacion.carrera || 'Ninguna'}</p>
            <p><strong>Años completados:</strong> ${educacion.añosCompletados || 0}</p>
            <button class='boton-menu' id='btn-estudiar'>Estudiar</button>
            ${opcionesCarrera}
            ${opcionesPosgrado}
            <hr>
            <h2>Trabajo</h2>
            <p><strong>Estado:</strong> ${trabajo.estado || 'Desempleado'}</p>
            <p><strong>Rol:</strong> ${trabajo.rol || '-'}</p>
            <p><strong>Empresa:</strong> ${trabajo.empresa || '-'}</p>
            <p><strong>Salario:</strong> ${trabajo.salario || 0}</p>
            <p><strong>Años de experiencia:</strong> ${trabajo.añosExperiencia || 0}</p>
            <button class='boton-menu' id='btn-buscar-trabajo' ${!puedeTrabajar ? 'disabled' : ''}>Buscar trabajo</button>
            <button class='boton-menu peligro' id='btn-renunciar' ${trabajo.estado !== 'activo' ? 'disabled' : ''}>Renunciar</button>
            <div id='estudios-feedback'></div>
            ${mensajeRestriccion}
            ${trabajosDisponibles}
        `;
        // Estudiar
        const btnEstudiar = contenidoEstudios.querySelector('#btn-estudiar');
        if (btnEstudiar) {
            btnEstudiar.onclick = () => {
                personaje.modificarAtributo('inteligencia', 5);
                personaje.agregarEvento({
                    titulo: 'Estudio',
                    descripcion: 'Has estudiado y mejorado tu inteligencia.',
                    tipo: 'estudio',
                    edad: personaje.edad
                });
                document.getElementById('estudios-feedback').innerHTML = `<span style='color:var(--color-primary)'>Has estudiado y mejorado tu inteligencia.</span>`;
                window.juego.ui.actualizarPersonaje(personaje);
            };
        }
        // Elegir carrera
        const btnElegirCarrera = contenidoEstudios.querySelector('#btn-elegir-carrera');
        if (btnElegirCarrera) {
            btnElegirCarrera.onclick = () => {
                const select = contenidoEstudios.querySelector('#select-carrera');
                const carrera = select.value;
                if (!carrera) {
                    document.getElementById('estudios-feedback').innerHTML = `<span style='color:var(--color-error)'>Selecciona una carrera.</span>`;
                    return;
                }
                educacion.carrera = carrera;
                educacion.nivel = 'Universidad';
                educacion.añosCompletados = 0;
                document.getElementById('estudios-feedback').innerHTML = `<span style='color:var(--color-primary)'>¡Has comenzado la carrera de ${carrera}!</span>`;
                window.juego.ui.actualizarPersonaje(personaje);
                mostrarEstudiosTrabajo(juego);
            };
        }
        // Hacer posgrado/curso
        const btnHacerPosgrado = contenidoEstudios.querySelector('#btn-hacer-posgrado');
        if (btnHacerPosgrado) {
            btnHacerPosgrado.onclick = () => {
                const select = contenidoEstudios.querySelector('#select-posgrado');
                const tipo = select.value;
                if (!tipo) {
                    document.getElementById('estudios-feedback').innerHTML = `<span style='color:var(--color-error)'>Selecciona un posgrado o curso.</span>`;
                    return;
                }
                educacion.posgrado = tipo;
                document.getElementById('estudios-feedback').innerHTML = `<span style='color:var(--color-primary)'>¡Has realizado un ${tipo}!</span>`;
                window.juego.ui.actualizarPersonaje(personaje);
                mostrarEstudiosTrabajo(juego);
            };
        }
        // Buscar trabajo
        const btnBuscar = contenidoEstudios.querySelector('#btn-buscar-trabajo');
        if (btnBuscar) {
            btnBuscar.onclick = () => {
                if (!puedeTrabajar) {
                    document.getElementById('estudios-feedback').innerHTML = `<span style='color:var(--color-error)'>¡Debes tener al menos 18 años para trabajar!</span>`;
                    return;
                }
                // Opciones de trabajo según estudios
                let opciones = [];
                if (educacion.carrera) {
                    opciones = [
                        { nombre: `Junior en ${educacion.carrera}`, salario: 3000, desgaste: 10, empresa: 'Empresa S.A.', rol: 'Junior' },
                        { nombre: `Semi-Senior en ${educacion.carrera}`, salario: 5000, desgaste: 15, empresa: 'Empresa S.A.', rol: 'Semi-Senior' },
                        { nombre: `Freelance en ${educacion.carrera}`, salario: 2500, desgaste: 7, empresa: 'Freelance', rol: 'Freelance' }
                    ];
                } else if (educacion.nivel === 'Escuela Secundaria') {
                    opciones = [
                        { nombre: 'Empleado administrativo', salario: 1200, desgaste: 8, empresa: 'Comercio Local', rol: 'Empleado' },
                        { nombre: 'Vendedor', salario: 1000, desgaste: 10, empresa: 'Tienda', rol: 'Vendedor' },
                        { nombre: 'Repartidor', salario: 900, desgaste: 12, empresa: 'Delivery', rol: 'Repartidor' }
                    ];
                } else {
                    opciones = [
                        { nombre: 'Obrero', salario: 800, desgaste: 15, empresa: 'Fábrica', rol: 'Obrero' },
                        { nombre: 'Limpiador', salario: 700, desgaste: 10, empresa: 'Servicios', rol: 'Limpiador' },
                        { nombre: 'Ayudante', salario: 600, desgaste: 8, empresa: 'Varios', rol: 'Ayudante' }
                    ];
                }
                // Mostrar opciones en un modal flotante
                let modal = document.getElementById('modal-trabajo-opciones');
                if (!modal) {
                    modal = document.createElement('div');
                    modal.id = 'modal-trabajo-opciones';
                    modal.className = 'modal-flotante';
                    document.body.appendChild(modal);
                }
                // Asegurar que el modal se muestre centrado y visible
                modal.style.display = 'flex';
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100vw';
                modal.style.height = '100vh';
                modal.style.alignItems = 'center';
                modal.style.justifyContent = 'center';
                modal.style.background = 'rgba(0,0,0,0.4)';
                modal.style.zIndex = '9999';
                modal.innerHTML = `
                    <div class='modal-contenido' style='background:white;padding:30px 20px;border-radius:12px;min-width:320px;max-width:90vw;'>
                        <h3>Elige un trabajo</h3>
                        <ul style='list-style:none;padding:0;'>
                            ${opciones.map((op, i) => `
                                <li style='margin-bottom:10px;'>
                                    <button class='boton-menu' data-trabajo='${i}'>${op.nombre}</button><br>
                                    <span>Salario: $${op.salario} | Desgaste: ${op.desgaste}</span>
                                </li>
                            `).join('')}
                        </ul>
                        <button class='boton-menu' id='cerrar-modal-trabajo'>Cancelar</button>
                    </div>
                `;
                // Listeners para elegir trabajo
                opciones.forEach((op, i) => {
                    modal.querySelector(`[data-trabajo='${i}']`).onclick = () => {
                        trabajo.estado = 'activo';
                        trabajo.rol = op.rol;
                        trabajo.empresa = op.empresa;
                        trabajo.salario = op.salario;
                        trabajo.desgaste = op.desgaste;
                        trabajo.añosExperiencia = 0;
                        personaje.agregarEvento({
                            titulo: 'Trabajo',
                            descripcion: `Has conseguido el trabajo de ${op.nombre}.`,
                            tipo: 'trabajo',
                            edad: personaje.edad
                        });
                        document.getElementById('estudios-feedback').innerHTML = `<span style='color:var(--color-primary)'>¡Has conseguido el trabajo de ${op.nombre}!</span>`;
                        window.juego.ui.actualizarPersonaje(personaje);
                        modal.style.display = 'none';
                        mostrarEstudiosTrabajo(juego);
                    };
                });
                // Cerrar modal
                modal.querySelector('#cerrar-modal-trabajo').onclick = () => {
                    modal.style.display = 'none';
                };
            };
        }
        // Renunciar
        const btnRenunciar = contenidoEstudios.querySelector('#btn-renunciar');
        if (btnRenunciar) {
            btnRenunciar.onclick = () => {
                trabajo.estado = 'desempleado';
                trabajo.rol = '-';
                trabajo.empresa = '-';
                trabajo.salario = 0;
                trabajo.añosExperiencia = 0;
                personaje.agregarEvento({
                    titulo: 'Renuncia',
                    descripcion: 'Has renunciado a tu trabajo.',
                    tipo: 'trabajo',
                    edad: personaje.edad
                });
                document.getElementById('estudios-feedback').innerHTML = `<span style='color:var(--color-accent)'>Has renunciado a tu trabajo.</span>`;
                window.juego.ui.actualizarPersonaje(personaje);
            };
        }
    }

    // Mostrar panel dinámicamente al abrir modal
    function abrirModal(id) {
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('visible'));
        const modal = document.getElementById(id);
        if (modal) modal.classList.add('visible');
        // Siempre mostrar el contenido actualizado
        if (window.juego && window.juego.personaje) {
            if (id === 'modal-estudios') mostrarEstudiosTrabajo(window.juego);
            if (id === 'modal-propiedades') mostrarPropiedades(window.juego);
            if (id === 'modal-relaciones') mostrarRelaciones(window.juego);
            if (id === 'modal-actividades') mostrarActividades(window.juego);
        } else {
            if (id === 'modal-estudios') contenidoEstudios.innerHTML = '<p>Crea un personaje para ver esta sección.</p>';
            if (id === 'modal-propiedades') contenidoPropiedades.innerHTML = '<p>Crea un personaje para ver esta sección.</p>';
            if (id === 'modal-relaciones') contenidoRelaciones.innerHTML = '<p>Crea un personaje para ver esta sección.</p>';
            if (id === 'modal-actividades') contenidoActividades.innerHTML = '<p>Crea un personaje para ver esta sección.</p>';
        }
    }
    // Guardar referencia global para acceso en modales
    window.juego = juego;

    // Asignar listeners a los botones del menú inferior dentro de DOMContentLoaded
    document.getElementById('btn-estudios').onclick = () => abrirModal('modal-estudios');
    document.getElementById('btn-propiedades').onclick = () => abrirModal('modal-propiedades');
    document.getElementById('btn-relaciones').onclick = () => abrirModal('modal-relaciones');
    document.getElementById('btn-actividades').onclick = () => abrirModal('modal-actividades');

    // Listeners para cerrar modales
    document.querySelectorAll('.cerrar-modal').forEach(btn => {
      btn.onclick = e => {
        const id = btn.getAttribute('data-close');
        cerrarModal(id);
      };
    });
    // Cerrar modal al hacer click fuera del contenido
    window.addEventListener('click', function(e) {
      document.querySelectorAll('.modal.visible').forEach(modal => {
        if (e.target === modal) modal.classList.remove('visible');
      });
    });
});

// Definir cerrarModal global para evitar ReferenceError
function cerrarModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'none';
} 