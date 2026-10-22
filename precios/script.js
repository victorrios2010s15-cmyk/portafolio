document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.chk-servicio');
    const numPaginasInput = document.getElementById('num-paginas');
    const totalCalculado = document.getElementById('total-calculado');
    const btnSolicitar = document.getElementById('btn-solicitar');
    const alertaError = document.getElementById('alerta-error');
    const modalExito = document.getElementById('modal-exito');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');

    // 1. Lógica de cálculo de precios en tiempo real
    function calcularTotal() {
        let total = 0;

        // Sumar servicios seleccionados
        checkboxes.forEach(chk => {
            if (chk.checked) {
                total += parseFloat(chk.getAttribute('data-precio')) || 0;
            }
        });

        // Sumar páginas adicionales ($10 USD cada una)
        const paginasExtra = parseInt(numPaginasInput.value) || 0;
        total += paginasExtra * 10;

        // Actualizar el texto en pantalla
        totalCalculado.textContent = `$${total} USD`;
    }

    // Escuchar cambios en los checkboxes y en el input numérico
    checkboxes.forEach(chk => {
        chk.addEventListener('change', calcularTotal);
    });
    numPaginasInput.addEventListener('input', calcularTotal);

    // Calcular al cargar la página
    calcularTotal();

    // 2. Lógica de envío seguro hacia tu API de Vercel (Discord)
    if (btnSolicitar) {
        btnSolicitar.addEventListener('click', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre-cliente').value.trim();
            const contacto = document.getElementById('contacto-cliente').value.trim();

            // Validar que los campos no estén vacíos
            if (!nombre || !contacto) {
                if (alertaError) alertaError.style.display = 'block';
                return;
            } else {
                if (alertaError) alertaError.style.display = 'none';
            }

            const endpointAPI = "/api/enviar-cotizacion";
            const totalFinal = totalCalculado.textContent;

            // Recopilar qué servicios marcó el cliente
            let listaServicios = [];
            checkboxes.forEach(chk => {
                if (chk.checked) {
                    const tituloServicio = chk.closest('.opcion-card').querySelector('.opcion-titulo').textContent;
                    listaServicios.push(tituloServicio);
                }
            });
            
            const extraPaginas = parseInt(numPaginasInput.value) || 0;
            if (extraPaginas > 0) {
                listaServicios.push(`${extraPaginas} Páginas Adicionales`);
            }

            // Construir el mensaje privado para Discord
            const payload = {
                content: `📩 **Nueva Cotización Recibida (Cyberpunk)**\n` +
                         `👤 **Cliente:** ${nombre}\n` +
                         `📞 **Contacto:** ${contacto}\n` +
                         `🛠️ **Módulos:**\n- ${listaServicios.join('\n- ')}\n` +
                         `💰 **Total:** ${totalFinal}`
            };

            // Efecto visual de carga en el botón
            const textoBtn = document.getElementById('btn-texto');
            const textoOriginal = textoBtn.textContent;
            btnSolicitar.disabled = true;
            textoBtn.textContent = "TRANSMITIENDO...";

            // Enviar a la función serverless de Vercel
            fetch(endpointAPI, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (response.ok) {
                    // Mostrar tu modal cyberpunk de éxito
                    if (modalExito) modalExito.classList.remove('oculto');
                } else {
                    alert("Error en el servidor al procesar la transmisión.");
                }
            })
            .catch(err => {
                console.error("Error de conexión:", err);
                alert("Error de red al intentar conectar con el backend.");
            })
            .finally(() => {
                btnSolicitar.disabled = false;
                textoBtn.textContent = textoOriginal;
            });
        });
    }

    // 3. Cerrar el modal de éxito
    if (btnCerrarModal) {
        btnCerrarModal.addEventListener('click', () => {
            if (modalExito) modalExito.classList.add('oculto');
        });
    }
});