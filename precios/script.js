const discordWebhookURL = "https://discord.com/api/webhooks/1561447100405911653/p6o6LsuLKKPJ3oZ4NKzy-EiU-gCH0FkqMBpzvu86yTNwfNy_XqJEJjDcR1onVZcKHs1i";

document.addEventListener('DOMContentLoaded', () => {

    // Selección de elementos del DOM
    const checkboxes = document.querySelectorAll('.chk-servicio');
    const inputPaginas = document.getElementById('num-paginas');
    const totalElemento = document.getElementById('total-calculado');
    const btnSolicitar = document.getElementById('btn-solicitar');
    const btnTexto = document.getElementById('btn-texto');
    
    const inputNombre = document.getElementById('nombre-cliente');
    const inputContacto = document.getElementById('contacto-cliente');
    const modalExito = document.getElementById('modal-exito');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');
    const alertaError = document.getElementById('alerta-error');

    // --- CÁLCULO EN TIEMPO REAL ---
    function calcularTotal() {
        let total = 0;

        // Sumar checkboxes seleccionados
        checkboxes.forEach(chk => {
            if (chk.checked) {
                total += parseFloat(chk.getAttribute('data-precio')) || 0;
            }
        });

        // Sumar páginas secundarias adicionales
        if (inputPaginas) {
            const numPaginas = parseInt(inputPaginas.value) || 0;
            total += (numPaginas * 10);
        }

        // Actualizar monto visible en pantalla
        if (totalElemento) {
            totalElemento.textContent = `$${total} USD`;
        }

        return total;
    }

    // Escuchar cambios para calcular dinámicamente
    checkboxes.forEach(chk => {
        chk.addEventListener('change', calcularTotal);
    });

    if (inputPaginas) {
        inputPaginas.addEventListener('input', calcularTotal);
    }

    // --- TRANSMISIÓN A DISCORD ---
    if (btnSolicitar) {
        btnSolicitar.addEventListener('click', (e) => {
            e.preventDefault();

            const nombre = inputNombre ? inputNombre.value.trim() : "";
            const contacto = inputContacto ? inputContacto.value.trim() : "";

            // VALIDACIÓN CYBERPUNK EN PANTALLA (Sin alerts nativos del navegador)
            if (!nombre || !contacto) {
                if (alertaError) {
                    alertaError.style.display = 'block';
                    setTimeout(() => { 
                        alertaError.style.display = 'none'; 
                    }, 4000);
                }
                return;
            }

            // Ocultar alerta de error si ya llenó los campos
            if (alertaError) {
                alertaError.style.display = 'none';
            }

            let total = 0;
            let serviciosSeleccionados = [];

            // Recopilar módulos seleccionados
            checkboxes.forEach(chk => {
                if (chk.checked) {
                    const tarjeta = chk.closest('.opcion-card');
                    const tituloEl = tarjeta ? tarjeta.querySelector('.opcion-titulo') : null;
                    const titulo = tituloEl ? tituloEl.textContent.trim() : "Servicio";
                    const precio = parseFloat(chk.getAttribute('data-precio')) || 0;
                    
                    serviciosSeleccionados.push(`• **${titulo}** ($${precio} USD)`);
                    total += precio;
                }
            });

            // Recopilar páginas adicionales
            if (inputPaginas) {
                const numPaginas = parseInt(inputPaginas.value) || 0;
                if (numPaginas > 0) {
                    const precioExtra = numPaginas * 10;
                    serviciosSeleccionados.push(`• **${numPaginas} Páginas Secundarias Adicionales** ($${precioExtra} USD)`);
                    total += precioExtra;
                }
            }

            // Estructura del Embed para Discord
            const payload = {
                username: "Bot Cotizador",
                embeds: [
                    {
                        title: "📥 ¡Nuevo Presupuesto Solicitado!",
                        color: 5793266, // Púrpura Discord
                        fields: [
                            {
                                name: "👤 Datos del Cliente:",
                                value: `**Nombre:** ${nombre}\n**Contacto:** ${contacto}`,
                                inline: false
                            },
                            {
                                name: "🛒 Módulos Seleccionados:",
                                value: serviciosSeleccionados.length > 0 ? serviciosSeleccionados.join('\n') : "Ninguno",
                                inline: false
                            },
                            {
                                name: "💰 Total Estimado:",
                                value: `**$${total} USD**`,
                                inline: true
                            }
                        ],
                        footer: {
                            text: "Notificación enviada desde tu Cotizador Web"
                        },
                        timestamp: new Date().toISOString()
                    }
                ]
            };

            // Animación del botón durante el envío
            const textoOriginal = btnTexto ? btnTexto.textContent : "TRANSMITIR PRESUPUESTO";
            if (btnTexto) btnTexto.textContent = "TRANSMITIENDO...";
            btnSolicitar.disabled = true;

            // Petición al Webhook de Discord
            fetch(discordWebhookURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (response.ok) {
                    // Mostrar modal de éxito estilizado
                    if (modalExito) {
                        modalExito.classList.remove('oculto');
                    }
                } else {
                    if (alertaError) {
                        alertaError.textContent = "Error al transmitir. Inténtalo nuevamente.";
                        alertaError.style.display = 'block';
                    }
                }
            })
            .catch(err => {
                console.error('Error al enviar a Discord:', err);
                if (alertaError) {
                    alertaError.textContent = "Error de conexión con el servidor.";
                    alertaError.style.display = 'block';
                }
            })
            .finally(() => {
                if (btnTexto) btnTexto.textContent = textoOriginal;
                btnSolicitar.disabled = false;
            });
        });
    }

    // Evento para cerrar el modal y resetear el formulario
    if (btnCerrarModal && modalExito) {
        btnCerrarModal.addEventListener('click', () => {
            modalExito.classList.add('oculto');
            if (inputNombre) inputNombre.value = "";
            if (inputContacto) inputContacto.value = "";
        });
    }

    // Cálculo inicial automático
    calcularTotal();
});