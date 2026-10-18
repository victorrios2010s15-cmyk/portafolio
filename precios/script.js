const discordWebhookURL = "https://discord.com/api/webhooks/1561447100405911653/p6o6LsuLKKPJ3oZ4NKzy-EiU-gCH0FkqMBpzvu86yTNwfNy_XqJEJjDcR1onVZcKHs1i";

document.addEventListener('DOMContentLoaded', () => {

    const checkboxes = document.querySelectorAll('.chk-servicio');
    const inputPaginas = document.getElementById('num-paginas');
    const totalElemento = document.getElementById('total-calculado');
    const btnSolicitar = document.getElementById('btn-solicitar');
    const btnTexto = document.getElementById('btn-texto');
    
    const inputNombre = document.getElementById('nombre-cliente');
    const inputContacto = document.getElementById('contacto-cliente');
    const modalExito = document.getElementById('modal-exito');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');

    // --- FUNCIÓN DE CÁLCULO EN VIVO ---
    function calcularTotal() {
        let total = 0;

        checkboxes.forEach(chk => {
            if (chk.checked) {
                total += parseFloat(chk.getAttribute('data-precio')) || 0;
            }
        });

        if (inputPaginas) {
            const numPaginas = parseInt(inputPaginas.value) || 0;
            total += (numPaginas * 10);
        }

        if (totalElemento) {
            totalElemento.textContent = `$${total} USD`;
        }

        return total;
    }

    // Escuchar cambios para sumar en tiempo real
    checkboxes.forEach(chk => {
        chk.addEventListener('change', calcularTotal);
    });

    if (inputPaginas) {
        inputPaginas.addEventListener('input', calcularTotal);
    }

    // --- ENVIAR AL WEBHOOK DE DISCORD ---
    if (btnSolicitar) {
        btnSolicitar.addEventListener('click', (e) => {
            e.preventDefault();

            // Validar campos de texto
            const nombre = inputNombre.value.trim();
            const contacto = inputContacto.value.trim();

            if (!nombre || !contacto) {
                alert('Por favor completa tu Nombre y tu Correo o Discord para continuar.');
                return;
            }

            let total = 0;
            let serviciosSeleccionados = [];

            checkboxes.forEach(chk => {
                if (chk.checked) {
                    const tarjeta = chk.closest('.opcion-card');
                    const tituloEl = tarjeta.querySelector('.opcion-titulo');
                    const titulo = tituloEl ? tituloEl.textContent.trim() : "Servicio";
                    const precio = parseFloat(chk.getAttribute('data-precio')) || 0;
                    
                    serviciosSeleccionados.push(`• **${titulo}** ($${precio} USD)`);
                    total += precio;
                }
            });

            if (inputPaginas) {
                const numPaginas = parseInt(inputPaginas.value) || 0;
                if (numPaginas > 0) {
                    const precioExtra = numPaginas * 10;
                    serviciosSeleccionados.push(`• **${numPaginas} Páginas Secundarias Adicionales** ($${precioExtra} USD)`);
                    total += precioExtra;
                }
            }

            const payload = {
                username: "Bot Cotizador",
                embeds: [
                    {
                        title: "📥 ¡Nuevo Presupuesto Solicitado!",
                        color: 5793266,
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

            const textoOriginal = btnTexto.textContent;
            btnTexto.textContent = "TRANSMITIENDO...";
            btnSolicitar.disabled = true;

            fetch(discordWebhookURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (response.ok) {
                    if (modalExito) {
                        modalExito.classList.remove('oculto');
                    } else {
                        alert('¡Presupuesto enviado con éxito!');
                    }
                } else {
                    alert('Hubo un error al transmitir el presupuesto.');
                }
            })
            .catch(err => {
                console.error('Error al enviar a Discord:', err);
                alert('Ocurrió un problema de conexión.');
            })
            .finally(() => {
                btnTexto.textContent = textoOriginal;
                btnSolicitar.disabled = false;
            });
        });
    }

    if (btnCerrarModal && modalExito) {
        btnCerrarModal.addEventListener('click', () => {
            modalExito.classList.add('oculto');
        });
    }

    // Cálculo inicial
    calcularTotal();
});