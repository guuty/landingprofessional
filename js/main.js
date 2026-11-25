// ---------- Header ----------
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// ---------- Menú mobile ----------
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  nav.classList.toggle('abierto');
  navToggle.classList.toggle('activo');
});

nav.querySelectorAll('a').forEach(enlace => {
  enlace.addEventListener('click', () => {
    nav.classList.remove('abierto');
    navToggle.classList.remove('activo');
  });
});

// ---------- Aparecer al scrollear ----------
const observador = new IntersectionObserver(entradas => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('visible');
      observador.unobserve(entrada.target);
    }
  });
}, { threshold: .15 });

document.querySelectorAll('.reveal').forEach(el => observador.observe(el));

// ---------- Contadores ----------
const contadores = document.querySelectorAll('.contador-num');

const observadorContadores = new IntersectionObserver(entradas => {
  entradas.forEach(entrada => {
    if (!entrada.isIntersecting) return;

    const el = entrada.target;
    const destino = parseInt(el.dataset.target, 10);
    const paso = destino / 60;
    let actual = 0;

    const timer = setInterval(() => {
      actual += paso;
      if (actual >= destino) {
        actual = destino;
        clearInterval(timer);
      }
      el.textContent = Math.floor(actual);
    }, 20);

    observadorContadores.unobserve(el);
  });
}, { threshold: .5 });

contadores.forEach(c => observadorContadores.observe(c));

// ---------- Pestañas de disciplinas ----------
const tabs = document.querySelectorAll('.tab');
const paneles = document.querySelectorAll('.panel-disciplina');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('activo'));
    paneles.forEach(p => p.classList.remove('activo'));
    tab.classList.add('activo');
    document.getElementById(tab.dataset.target).classList.add('activo');
  });
});

// ---------- Testimonios rotativos ----------
const testimonios = document.querySelectorAll('.testimonio');
const puntos = document.getElementById('puntos');
const barra = document.getElementById('barraProgreso');
let indiceActual = 0;
let rotacion;

testimonios.forEach((_, i) => {
  const punto = document.createElement('button');
  punto.className = 'punto' + (i === 0 ? ' activo' : '');
  punto.setAttribute('aria-label', 'Reseña ' + (i + 1));
  punto.addEventListener('click', () => {
    mostrarTestimonio(i);
    reiniciarRotacion();
  });
  puntos.appendChild(punto);
});

function reiniciarBarra() {
  barra.classList.remove('corriendo');
  void barra.offsetWidth;   // fuerza un recálculo; sin esto la animación no vuelve a arrancar
  barra.classList.add('corriendo');
}

function mostrarTestimonio(i) {
  testimonios.forEach(t => t.classList.remove('activo'));
  puntos.querySelectorAll('.punto').forEach(p => p.classList.remove('activo'));
  testimonios[i].classList.add('activo');
  puntos.querySelectorAll('.punto')[i].classList.add('activo');
  indiceActual = i;
  reiniciarBarra();
}

function reiniciarRotacion() {
  clearInterval(rotacion);
  rotacion = setInterval(() => {
    mostrarTestimonio((indiceActual + 1) % testimonios.length);
  }, 6000);
}

reiniciarBarra();
reiniciarRotacion();

// ---------- Mapa ----------
const sedes = [
  { nombre: 'Sede Central<br>Tornquist 3959, Isidro Casanova', coords: [-34.717102,  -58.590808]  },
  { nombre: 'González Catán<br>Simón Pérez 5943',              coords: [-34.7839703, -58.630918]  },
  { nombre: 'Aldo Bonzi<br>Cucha Cucha 2026',                  coords: [-34.7107283, -58.5176597] },
  { nombre: 'Sede Don Juan<br>Spiro 4375 esq. Raulies',        coords: [-34.7589722, -58.5935822] },
  { nombre: 'Sede La Tablada<br>Alberti 3140',                 coords: [-34.6975967, -58.5435177] },
  { nombre: 'Sede Laferrere<br>Cobo 6437',                     coords: [-34.7676473, -58.6039242] },
  { nombre: 'Sede Luzuriaga<br>Granaderos 2209',               coords: [-34.6591869, -58.5824648] }
];

const mapa = L.map('mapa', { scrollWheelZoom: false }).setView(sedes[0].coords, 12);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri',
  maxZoom: 19
}).addTo(mapa);

const iconoShogun = L.divIcon({
  className: 'marcador',
  html: '<span></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  popupAnchor: [0, -12]
});

const marcadores = sedes.map(sede =>
  L.marker(sede.coords, { icon: iconoShogun }).addTo(mapa).bindPopup(sede.nombre)
);

mapa.fitBounds(L.featureGroup(marcadores).getBounds().pad(0.35));