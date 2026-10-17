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

        btnSolicitar.addEventListener('click', () => {
        let mensajeTelegram = "Hola Víctor, armé este presupuesto desde tu Cotizador Web:\n\n";
        
        checkboxes.forEach(chk => {
            if (chk.checked || chk.disabled) {
                const titulo = chk.closest('.opcion-card').querySelector('.opcion-titulo').textContent;
                mensajeTelegram += `✅ ${titulo}\n`;
            }
        });

        const paginasExtra = parseInt(inputPaginas.value) || 0;
        if (paginasExtra > 0) {
            mensajeTelegram += `📄 Páginas secundarias: ${paginasExtra} (+$${paginasExtra * 10} USD)\n`;
        }

        mensajeTelegram += `\n💵 *Total Estimado: ${totalElemento.textContent}*`;

        // LÍNEA CORREGIDA CON NOMBRE DE USUARIO Y SINTAXIS DE VARIABLE:
        const urlTelegram = `https://telegram.me{encodeURIComponent(mensajeTelegram)}`;
        
        window.open(urlTelegram, '_blank');
    });
