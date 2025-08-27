document.addEventListener('DOMContentLoaded', () => {
  const etiquetas = document.querySelectorAll('.etiqueta');

  etiquetas.forEach(etiqueta => {
    const id = etiqueta.id;
    const recuadro = etiqueta.querySelector('.recuadro');

    // Cargar estado desde Firestore
    db.collection("refacciones").doc(id).get()
      .then(docSnap => {
        if (docSnap.exists) {
          const data = docSnap.data();
          recuadro.textContent = `☑ ${data.estado}`;
          recuadro.style.fontSize = "11px";
          recuadro.style.margin = "9.5px";
          recuadro.classList.add('checked');
        } else {
          recuadro.textContent = '☐';
          recuadro.style.fontSize = "11px";
          recuadro.style.margin = "1px";
          recuadro.classList.remove('checked');
        }
      })
      .catch(err => console.error("Error leyendo Firestore:", err));

    // Asignar click
    etiqueta.addEventListener('click', () => {
      const recuadro = etiqueta.querySelector('.recuadro');
      let nuevoTexto = '';
      while (!["estratégico","estrategico","no estratégico","no estrategico","obsoleto"].includes(nuevoTexto.toLowerCase())) {
        nuevoTexto = prompt("Seleccione el estado (Estratégico, No estratégico, Obsoleto):");
        if (!nuevoTexto) return;
        if (!["estratégico","estrategico","no estratégico","no estrategico","obsoleto"].includes(nuevoTexto.toLowerCase())) {
          alert("La palabra ingresada no es correcta. Intente nuevamente.");
        }
      }

      if (["estratégico","estrategico"].includes(nuevoTexto.toLowerCase())) nuevoTexto = "Estratégico";
      else if (["no estratégico","no estrategico"].includes(nuevoTexto.toLowerCase())) nuevoTexto = "No estratégico";
      else nuevoTexto = "Obsoleto";

      recuadro.textContent = `☑ ${nuevoTexto}`;
      recuadro.style.fontSize = "11px";
      recuadro.style.margin = "9.5px";
      recuadro.classList.add('checked');

      // Guardar en Firestore
      db.collection("refacciones").doc(id).set({ estado: nuevoTexto })
        .then(() => console.log(`Guardado: ${id} → ${nuevoTexto}`))
        .catch(err => console.error("Error guardando:", err));
    });
  });
});
