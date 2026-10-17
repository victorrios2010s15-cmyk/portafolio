document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.chk-servicio');
    const inputPaginas = document.getElementById('num-paginas');
    const totalElemento = document.getElementById('total-calculado');
    const btnSolicitar = document.getElementById('btn-solicitar');

    function calcularTotal() {
        let total = 0;

        checkboxes.forEach(chk => {
            if (chk.checked || chk.disabled) {
                total += parseFloat(chk.getAttribute('data-precio'));
            }
        });

        const cantidadPaginas = parseInt(inputPaginas.value) || 0;
        total += (cantidadPaginas * 10);

        totalElemento.textContent = `$${total} USD`;
    }

    checkboxes.forEach(chk => {
        chk.addEventListener('change', calcularTotal);
    });

    inputPaginas.addEventListener('input', () => {
        if (inputPaginas.value < 0) inputPaginas.value = 0;
        calcularTotal();
    });

    btnSolicitar.addEventListener('click', (e) => {
    e.preventDefault();

    let total = 0;
    let serviciosSeleccionados = [];

    // Recorremos los checkboxes seleccionados
    checkboxes.forEach(chk => {
        if (chk.checked || chk.disabled) {
            const nombreServicio = chk.parentElement.textContent.trim();
            const precio = parseFloat(chk.getAttribute('data-precio'));
            serviciosSeleccionados.push(`• ${nombreServicio} ($${precio} USD)`);
            total += precio;
        }
    });

    const cantidadPaginas = parseInt(inputPaginas.value) || 0;
    if (cantidadPaginas > 0) {
        serviciosSeleccionados.push(`• ${cantidadPaginas} Página(s) adicional(es) ($${cantidadPaginas * 10} USD)`);
        total += (cantidadPaginas * 10);
    }

    // Armamos el texto del mensaje personalizado
    const mensajeText = `¡Hola Victor! Me gustaría solicitar el siguiente presupuesto:\n\n` +
                          serviciosSeleccionados.join('\n') + 
                          `\n\nTotal estimado: $${total} USD`;

    // Codificamos el texto para que la URL sea válida
    const mensajeCodificado = encodeURIComponent(mensajeText);

    // Enlace directo a TU perfil de Telegram pasando el texto
    const urlTelegram = `https://t.me/Victor2010s?text=${mensajeCodificado}`;

    // Abrimos tu Telegram directo en una pestaña nueva
    window.open(urlTelegram, '_blank');
});
});