export class EfectosVisuales {
    constructor() {
        this.crearNubes();
        this.crearParticulas();
    }

    crearNubes() {
        const numNubes = 5;
        for (let i = 0; i < numNubes; i++) {
            const nube = document.createElement('div');
            nube.className = 'nube';
            nube.style.width = `${Math.random() * 100 + 50}px`;
            nube.style.height = `${Math.random() * 50 + 25}px`;
            nube.style.left = `${Math.random() * 100}%`;
            nube.style.top = `${Math.random() * 100}%`;
            nube.style.animationDelay = `${Math.random() * 20}s`;
            document.body.appendChild(nube);
        }
    }

    crearParticulas() {
        const numParticulas = 20;
        for (let i = 0; i < numParticulas; i++) {
            const particula = document.createElement('div');
            particula.className = 'particula';
            particula.style.width = `${Math.random() * 10 + 5}px`;
            particula.style.height = particula.style.width;
            particula.style.left = `${Math.random() * 100}%`;
            particula.style.top = `${Math.random() * 100}%`;
            particula.style.animationDelay = `${Math.random() * 15}s`;
            document.body.appendChild(particula);
        }
    }

    mostrarBarraImpacto(impactos) {
        const barra = document.createElement('div');
        barra.className = 'barra-impacto';

        Object.entries(impactos).forEach(([atributo, valor]) => {
            const item = document.createElement('div');
            item.className = 'impacto-item';
            
            const icono = document.createElement('div');
            icono.className = 'impacto-icono';
            icono.style.backgroundColor = this._obtenerColorAtributo(atributo);
            
            const texto = document.createElement('span');
            texto.className = 'impacto-valor';
            texto.textContent = `${atributo}: ${valor > 0 ? '+' : ''}${valor}`;
            
            item.appendChild(icono);
            item.appendChild(texto);
            barra.appendChild(item);
        });

        document.body.appendChild(barra);
        setTimeout(() => barra.remove(), 3000);
    }

    mostrarEstadisticasMuerte(personaje) {
        const contenedor = document.createElement('div');
        contenedor.className = 'estadisticas-muerte';

        const contenido = document.createElement('div');
        contenido.className = 'estadisticas-contenido';

        const titulo = document.createElement('h2');
        titulo.className = 'estadisticas-titulo';
        titulo.textContent = 'Estadísticas Finales';

        const grid = document.createElement('div');
        grid.className = 'estadisticas-grid';

        // Estadísticas básicas
        const estadisticas = {
            'Edad alcanzada': personaje.edad,
            'Patrimonio final': personaje.finanzas.dinero,
            'Propiedades': personaje.finanzas.propiedades.length,
            'Hijos': personaje.relaciones.reduce((total, r) => total + r.hijos.length, 0),
            'Logros': personaje.historial.filter(e => e.tipo === 'logro').length,
            'Educación': personaje.carrera.educacion.nivel || 'Sin estudios'
        };

        Object.entries(estadisticas).forEach(([etiqueta, valor]) => {
            const item = document.createElement('div');
            item.className = 'estadistica-item';
            
            const valorElement = document.createElement('div');
            valorElement.className = 'estadistica-valor';
            valorElement.textContent = valor;
            
            const etiquetaElement = document.createElement('div');
            etiquetaElement.className = 'estadistica-etiqueta';
            etiquetaElement.textContent = etiqueta;
            
            item.appendChild(valorElement);
            item.appendChild(etiquetaElement);
            grid.appendChild(item);
        });

        contenido.appendChild(titulo);
        contenido.appendChild(grid);
        contenedor.appendChild(contenido);
        document.body.appendChild(contenedor);

        // Cerrar al hacer clic
        contenedor.addEventListener('click', () => contenedor.remove());
    }

    _obtenerColorAtributo(atributo) {
        const colores = {
            felicidad: '#f1c40f',
            salud: '#2ecc71',
            inteligencia: '#3498db',
            aspecto: '#e74c3c'
        };
        return colores[atributo] || '#95a5a6';
    }

    limpiar() {
        document.querySelectorAll('.nube, .particula').forEach(el => el.remove());
    }
} 