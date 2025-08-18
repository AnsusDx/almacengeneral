
// Funcionalidad del buscador
document.getElementById('buscador').addEventListener('input', function() {
    let query = this.value.toLowerCase();
    let etiquetas = document.querySelectorAll('.etiqueta');

    etiquetas.forEach(function(etiqueta) {
        if (etiqueta.textContent.toLowerCase().includes(query)) {
            etiqueta.style.display = 'block';
        } else {
            etiqueta.style.display = 'none';
        }
    });
});
