import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, set, update, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

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

// ----------------------
// 📌 FUNCIONES DEL CHECK
// ----------------------
function actualizarEstado(idEtiqueta, nuevoTexto) {
    const etiqueta = document.getElementById(idEtiqueta);
    const recuadro = etiqueta.querySelector('.recuadro');
    const estadoDiv = etiqueta.querySelector('.estado-etiqueta');

    if (nuevoTexto === "En revisión") {
        recuadro.textContent = '☑ Estratégico';
        recuadro.classList.remove('checked');
    } else {
        recuadro.textContent = `☑ ${nuevoTexto}`;
        recuadro.classList.add('checked');
    }

    if (estadoDiv) {
        estadoDiv.innerText = "Estado: " + nuevoTexto;
    }

    // Guardar en Firebase
    set(ref(database, 'etiquetas/' + idEtiqueta), { estado: nuevoTexto });
}

// Esta función la llamas desde el onclick del recuadro
window.marcarCheckYActualizarTexto = function(idEtiqueta) {
    actualizarEstado(idEtiqueta, "Marcado");
};

// ----------------------
// 📌 FUNCIONES DEL MENÚ ⚙️
// ----------------------
function inicializarMenus() {
    // Abrir/cerrar menú
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const opciones = btn.nextElementSibling;
            opciones.style.display = opciones.style.display === 'block' ? 'none' : 'block';
        });
    });

    // Cerrar menús al hacer click fuera
    document.addEventListener('click', () => {
        document.querySelectorAll('.menu-opciones').forEach(menu => menu.style.display = 'none');
    });

    // Manejar opciones seleccionadas
    document.querySelectorAll('.boton-opcion').forEach(boton => {
        boton.addEventListener('click', e => {
            e.stopPropagation();
            const estado = boton.dataset.valor;
            const id = boton.dataset.id;

            // 👉 Ahora el menú también actualiza el recuadro
            actualizarEstado(id, estado);

            // Guardar en Firebase
            update(ref(database, 'etiquetas/' + id), { estado: estado });
        });
    });
}

// ----------------------
// 📌 CARGA DE ESTADOS
// ----------------------
function cargarEstados() {
    const etiquetas = document.querySelectorAll('.etiqueta');

    etiquetas.forEach(etiqueta => {
        const idEtiqueta = etiqueta.id;
        const recuadro = etiqueta.querySelector('.recuadro');
        const estadoDiv = etiqueta.querySelector('.estado-etiqueta');

        onValue(ref(database, 'etiquetas/' + idEtiqueta), snapshot => {
            const data = snapshot.val();
            const estado = data ? data.estado : null;

            if (!estado) {
                recuadro.textContent = '☐';
                recuadro.classList.remove('checked');
                if (estadoDiv) estadoDiv.innerText = "Estado: Ninguno";
            } else if (estado === "En revisión") {
                recuadro.textContent = '☐ En revisión';
                recuadro.classList.remove('checked');
                if (estadoDiv) estadoDiv.innerText = "Estado: En revisión";
            } else {
                recuadro.textContent = `☑ ${estado}`;
                recuadro.classList.add('checked');
                if (estadoDiv) estadoDiv.innerText = "Estado: " + estado;
            }
        });
    });
}

// ----------------------
// 📌 INICIALIZAR
// ----------------------
window.onload = () => {
    cargarEstados();
    inicializarMenus();
};

