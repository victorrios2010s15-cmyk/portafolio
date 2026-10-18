const discordWebhookURL = "https://discord.com/api/webhooks/1561447100405911653/p6o6LsuLKKPJ3oZ4NKzy-EiU-gCH0FkqMBpzvu86yTNwfNy_XqJEJjDcR1onVZcKHs1i";

document.addEventListener('DOMContentLoaded', () => {

    const checkboxes = document.querySelectorAll('.chk-servicio');
    const inputPaginas = document.getElementById('num-paginas');
    const totalElemento = document.getElementById('total-calculado');
    const btnSolicitar = document.getElementById('btn-solicitar');
    const btnTexto = document.getElementById('btn-texto');

    // --- FUNCIÓN PARA CALCULAR Y ACTUALIZAR EL TOTAL EN TIEMPO REAL ---
    function calcularTotal() {
        let total = 0;

        // Sumar checkboxes
        checkboxes.forEach(chk => {
            if (chk.checked) {
                total += parseFloat(chk.getAttribute('data-precio')) || 0;
            }
        });

        // Sumar páginas adicionales
        if (inputPaginas) {
            const numPaginas = parseInt(inputPaginas.value) || 0;
            total += (numPaginas * 10);
        }

        // Actualizar en pantalla
        if (totalElemento) {
            totalElemento.textContent = `$${total} USD`;
        }

        return total;
    }

    // Escuchar cambios en checkboxes e input de páginas
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

            let total = 0;
            let serviciosSeleccionados = [];

            // Recorrer seleccionados
            checkboxes.forEach(chk => {
                if (chk.checked) {
                    const tarjeta = chk.closest('.opcion-card');
                    const titulo = tarjeta.querySelector('.opcion-titulo') ? tarjeta.querySelector('.opcion-titulo').textContent.trim() : "Servicio";
                    const precio = parseFloat(chk.getAttribute('data-precio')) || 0;
                    
                    serviciosSeleccionados.push(`• **${titulo}** ($${precio} USD)`);
                    total += precio;
                }
            });

            // Recorrer páginas adicionales
            if (inputPaginas) {
                const numPaginas = parseInt(inputPaginas.value) || 0;
                if (numPaginas > 0) {
                    const precioExtra = numPaginas * 10;
                    serviciosSeleccionados.push(`• **${numPaginas} Páginas Secundarias Adicionales** ($${precioExtra} USD)`);
                    total += precioExtra;
                }
            }

            // Datos para Discord
            const payload = {
                username: "Bot Cotizador",
                embeds: [
                    {
                        title: "📥 ¡Nuevo Presupuesto Generado!",
                        color: 5793266, // Púrpura Discord
                        fields: [
                            {
                                name: "Módulos Seleccionados:",
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
                            text: "Notificación automática enviada desde tu Cotizador Web"
                        },
                        timestamp: new Date().toISOString()
                    }
                ]
            };

            // Animación del botón
            const textoOriginal = btnTexto.textContent;
            btnTexto.textContent = "TRANSMITIENDO...";
            btnSolicitar.disabled = true;

            // Enviar petición Fetch a Discord
            fetch(discordWebhookURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (response.ok) {
                    alert('¡Tu presupuesto ha sido transmitido con éxito! Me pondré en contacto contigo a la brevedad.');
                } else {
                    alert('Hubo un error al transmitir el presupuesto. Por favor inténtalo nuevamente.');
                }
            })
            .catch(err => {
                console.error('Error al enviar a Discord:', err);
                alert('Ocurrió un problema de conexión al transmitir.');
            })
            .finally(() => {
                btnTexto.textContent = textoOriginal;
                btnSolicitar.disabled = false;
            });
        });
    }

    // Cálculo inicial al cargar
    calcularTotal();
});

