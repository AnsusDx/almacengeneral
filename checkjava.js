// 🔹 Importar solo lo que necesitamos
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// 🔹 Configuración Firebase (tu proyecto)
const firebaseConfig = {
  apiKey: "AIzaSyAeUkFBkdN4-DGFuCMvYY-B6c_Qy_1n84w",
  authDomain: "refacciones-67f92.firebaseapp.com",
  databaseURL: "https://refacciones-67f92-default-rtdb.firebaseio.com",
  projectId: "refacciones-67f92",
  storageBucket: "refacciones-67f92.firebasestorage.app",
  messagingSenderId: "577035417351",
  appId: "1:577035417351:web:d6d4be5125fb3616cf37a2"
};

// 🔹 Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Opciones válidas para selección
const opcionesValidas = ["estratégico", "estrategico",
                         "no estratégico", "no estrategico",
                         "obsoleto"];

// 🔹 Guardar estado en Firebase
function guardarEnFirebase(idEtiqueta, texto) {
    set(ref(database, 'etiquetas/' + idEtiqueta), { estado: texto });
}

// 🔹 Función para alternar estado y actualizar UI
function marcarCheckYActualizarTexto(idEtiqueta) {
    const etiqueta = document.getElementById(idEtiqueta);
    const recuadro = etiqueta.querySelector('.recuadro');

    if (recuadro.classList.contains('checked')) {
        const confirmacion = confirm("¿Desea dejar este elemento 'En revisión'?");
        if (confirmacion) {
            recuadro.classList.remove('checked');
            recuadro.textContent = '☐ En revisión';
            guardarEnFirebase(idEtiqueta, "En revisión");
        }
    } else {
        let nuevoTexto = '';
        while (!opcionesValidas.includes(nuevoTexto.toLowerCase())) {
            nuevoTexto = prompt("Seleccione el estado (Estratégico, No estratégico, Obsoleto):");
            if (!opcionesValidas.includes(nuevoTexto.toLowerCase())) {
                alert("La palabra ingresada no es correcta. Intente nuevamente.");
            }
        }

        // Normalizar texto
        const textoLower = nuevoTexto.toLowerCase();
        if (["estratégico", "estrategico"].includes(textoLower)) nuevoTexto = "Estratégico";
        else if (["no estratégico", "no estrategico"].includes(textoLower)) nuevoTexto = "No estratégico";
        else if (textoLower === "obsoleto") nuevoTexto = "Obsoleto";

        recuadro.textContent = `☑ ${nuevoTexto}`;
        recuadro.classList.add('checked');
        guardarEnFirebase(idEtiqueta, nuevoTexto);
    }
}

// 🔹 Función para cargar estados desde Firebase
function cargarEstadoEtiquetasYTexto() {
    const etiquetas = document.querySelectorAll('.etiqueta');

    etiquetas.forEach(etiqueta => {
        const recuadro = etiqueta.querySelector('.recuadro');
        const idEtiqueta = etiqueta.id;

        // Escucha en tiempo real
        onValue(ref(database, 'etiquetas/' + idEtiqueta), (snapshot) => {
            const textoGuardado = snapshot.val() ? snapshot.val().estado : null;

            if (!textoGuardado) {
                recuadro.textContent = '☐';
                recuadro.classList.remove('checked');
            } else if (textoGuardado === "En revisión") {
                recuadro.textContent = '☐ En revisión';
                recuadro.classList.remove('checked');
            } else {
                recuadro.textContent = `☑ ${textoGuardado}`;
                recuadro.classList.add('checked');
            }
        });

        // Evento click
        recuadro.onclick = () => marcarCheckYActualizarTexto(idEtiqueta);
    });
}

// 🔹 Inicializar al cargar la página
window.onload = cargarEstadoEtiquetasYTexto;
