// Función para alternar el estado del recuadro y validar/actualizar el texto
function marcarCheckYActualizarTexto(idEtiqueta) {
    const etiqueta = document.getElementById(idEtiqueta);
    const recuadro = etiqueta.querySelector('.recuadro');

    if (recuadro.classList.contains('checked')) {
        const confirmacion = confirm("¿Desea dejar este elemento 'En revisión'?"); 
        if (confirmacion) {
            recuadro.classList.remove('checked');
            recuadro.textContent = '☐ En revisión'; 
            recuadro.style.fontSize = "11px"; 
            recuadro.style.margin = "9.5px"; // Márgenes amplios para 'En revisión'
            localStorage.setItem(`${idEtiqueta}_texto`, "En revisión"); 
        }
    } else {
        recuadro.classList.add('checked');
        let nuevoTexto = '';
        while (!["estratégico", "estrategico", "estratégico",
                 "obsoleto", "Obsoleto", 
                 "no estratégico", "no estrategico", "No estratégico"].includes(nuevoTexto.toLowerCase())) {
            nuevoTexto = prompt("Seleccione el estado (Estratégico, No estratégico, Obsoleto):");
            if (!["estratégico", "estrategico", "estratégico",
                  "obsoleto", "Obsoleto", 
                  "no estratégico", "no estrategico", "No estratégico"].includes(nuevoTexto.toLowerCase())) {
                alert("La palabra ingresada no es correcta o no se escribió correctamente. Intente nuevamente.");
            }
        }

        if (["estratégico", "estrategico"].includes(nuevoTexto.toLowerCase())) {
            nuevoTexto = "Estratégico";
        } else if (["no estratégico", "no estrategico"].includes(nuevoTexto.toLowerCase())) {
            nuevoTexto = "No estratégico";
        } else if (["obsoleto"].includes(nuevoTexto.toLowerCase())) {
            nuevoTexto = "Obsoleto";
        }

        recuadro.textContent = `☑ ${nuevoTexto}`; 
        recuadro.style.fontSize = "11px"; 
        recuadro.style.margin = "9.5px"; // Márgenes más pequeños para estados seleccionados
        localStorage.setItem(idEtiqueta, 'checked'); 
        localStorage.setItem(`${idEtiqueta}_texto`, nuevoTexto); 
    }
}

// Función para cargar el estado y el texto del recuadro desde localStorage
function cargarEstadoEtiquetasYTexto() {
    const etiquetas = document.querySelectorAll('.etiqueta');
    etiquetas.forEach(etiqueta => {
        const recuadro = etiqueta.querySelector('.recuadro');
        const idEtiqueta = etiqueta.id;

        const estadoGuardado = localStorage.getItem(idEtiqueta);
        const textoGuardado = localStorage.getItem(`${idEtiqueta}_texto`);

        if (estadoGuardado === 'checked') {
            recuadro.classList.add('checked');
            recuadro.textContent = textoGuardado ? `☑ ${textoGuardado}` : '☑'; 
            recuadro.style.fontSize = "11px"; 
            recuadro.style.margin = "9.5px"; 
        } else if (textoGuardado === "En revisión") {
            recuadro.textContent = '☐ En revisión'; 
            recuadro.style.fontSize = "11px"; 
            recuadro.style.margin = "9.5px"; 
        } else {
            recuadro.textContent = '☐'; 
            recuadro.style.fontSize = "11px"; 
            recuadro.style.margin = "1px"; 
        }
    });
}

// Llama a la función al cargar la página
window.onload = cargarEstadoEtiquetasYTexto;
