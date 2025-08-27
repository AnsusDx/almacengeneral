// ------------------- FIREBASE -------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAWpSmJZgCkcHqhLIiX_GqYIZka8tf8mfI",
  authDomain: "catalogorefacciones.firebaseapp.com",
  projectId: "catalogorefacciones",
  storageBucket: "catalogorefacciones.firebasestorage.app",
  messagingSenderId: "686630156000",
  appId: "1:686630156000:web:f868aac53b45befacac285",
  measurementId: "G-WEBZHRJ8K1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ------------------- FUNCIONES -------------------
export async function marcarCheckYActualizarTexto(etiqueta) {
  const recuadro = etiqueta.querySelector('.recuadro');
  const id = etiqueta.id;

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

  // Guardar en Firestore
  try {
    await setDoc(doc(db, "refacciones", id), { estado: nuevoTexto });
    console.log(`Guardado en Firestore: ${id} → ${nuevoTexto}`);
  } catch (err) {
    console.error("Error guardando en Firestore:", err);
  }
}

// Cargar estados desde Firestore y asignar eventos
document.addEventListener('DOMContentLoaded', async () => {
  const etiquetas = document.querySelectorAll('.etiqueta');
  for (const etiqueta of etiquetas) {
    const id = etiqueta.id;
    const recuadro = etiqueta.querySelector('.recuadro');

    try {
      const docSnap = await getDoc(doc(db, "refacciones", id));
      if (docSnap.exists()) {
        const data = docSnap.data();
        recuadro.textContent = `☑ ${data.estado}`;
        recuadro.style.fontSize = "11px";
        recuadro.style.margin = "9.5px";
      }
    } catch (err) {
      console.error("Error leyendo Firestore:", err);
    }

    etiqueta.addEventListener('click', () => {
      marcarCheckYActualizarTexto(etiqueta);
    });
  }
});
