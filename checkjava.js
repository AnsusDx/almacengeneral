import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAeUkFBkdN4-DGFuCMvYY-B6c_Qy_1n84w",
  authDomain: "refacciones-67f92.firebaseapp.com",
  databaseURL: "https://refacciones-67f92-default-rtdb.firebaseio.com",
  projectId: "refacciones-67f92",
  storageBucket: "refacciones-67f92.firebasestorage.app",
  messagingSenderId: "577035417351",
  appId: "1:577035417351:web:d6d4be5125fb3616cf37a2"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Función para actualizar el recuadro y guardar en Firebase
function actualizarEstado(idEtiqueta, nuevoTexto) {
    const etiqueta = document.getElementById(idEtiqueta);
    const recuadro = etiqueta.querySelector('.recuadro');

    if (nuevoTexto === "En revisión") {
        recuadro.textContent = '☐ En revisión';
        recuadro.classList.remove('checked');
    } else {
        recuadro.textContent = `☑ ${nuevoTexto}`;
        recuadro.classList.add('checked');
    }

    // Guardar en Firebase
    set(ref(database, 'etiquetas/' + idEtiqueta), { estado: nuevoTexto });
}

// Función para cargar los estados desde Firebase en tiempo real
function cargarEstados() {
    const etiquetas = document.querySelectorAll('.etiqueta');

    etiquetas.forEach(etiqueta => {
        const idEtiqueta = etiqueta.id;
        const recuadro = etiqueta.querySelector('.recuadro');

        // Escucha cambios en tiempo real
        onValue(ref(database, 'etiquetas/' + idEtiqueta), snapshot => {
            const estado = snapshot.val() ? snapshot.val().estado : null;
            if (!estado) {
                recuadro.textContent = '☐';
                recuadro.classList.remove('checked');
            } else if (estado === "En revisión") {
                recuadro.textContent = '☐ En revisión';
                recuadro.classList.remove('checked');
            } else {
                recuadro.textContent = `☑ ${estado}`;
                recuadro.classList.add('checked');
            }
        });

        // Agregar evento a los botones
        const botones = etiqueta.querySelectorAll('.boton-opcion');
        botones.forEach(btn => {
            btn.onclick = () => actualizarEstado(idEtiqueta, btn.dataset.valor);
        });
    });
}

// Inicializar al cargar
window.onload = cargarEstados;
