// 🔹 Configuración Firebase (poner la tuya)
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://TU_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_PROJECT_ID.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Opciones válidas
const opcionesValidas = ["estratégico", "estrategico",
                         "no estratégico", "no estrategico",
                         "obsoleto"];

// Función para guardar en Firebase
function guardarEnFirebase(idEtiqueta, texto) {
    firebase.database().ref('etiquetas/' + idEtiqueta).set({
        estado: texto
    });
}

// Función para alternar estado y actualizar texto
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

// Función para cargar estados desde Firebase
function cargarEstadoEtiquetasYTexto() {
    const etiquetas = document.querySelectorAll('.etiqueta');

    etiquetas.forEach(etiqueta => {
        const recuadro = etiqueta.querySelector('.recuadro');
        const idEtiqueta = etiqueta.id;

        // Escucha en tiempo real
        firebase.database().ref('etiquetas/' + idEtiqueta).on('value', snapshot => {
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

// Inicializar al cargar la página
window.onload = cargarEstadoEtiquetasYTexto;
